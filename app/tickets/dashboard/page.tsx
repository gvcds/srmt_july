'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity, 
  Terminal, 
  Ticket as TicketIcon, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb, 
  FolderPlus,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  ListOrdered,
  History as HistoryIcon,
  Bug,
  Zap,
  FolderGit2,
  X,
  CheckCircle,
  Users,
  Copy,
  FileText,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { TicketNavigation } from "@/components/ticket-navigation";
import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/components/language-provider';
import { useToast } from "@/components/ui/use-toast";

interface Creator {
  name: string;
  team: string;
}

interface TicketRecord {
  id: number;
  type: 'ticket' | 'improvement' | 'project';
  priority: string;
  status: string;
  title: string;
  content: string;
  resolution?: string;
  creators: Creator[];
  created_at: string;
}

const COLORS = {
  ticket: '#ef4444',
  improvement: '#f59e0b',
  project: '#3b82f6',
  pendente: '#f97316',
  aceito: '#22c55e',
  rejeitado: '#dc2626',
  concluido: '#3b82f6',
  baixa: '#22c55e',
  media: '#3b82f6',
  alta: '#f59e0b',
  urgente: '#ef4444'
};

// --- COMPONENTE DE FUNDO ANIMADO (ESTRELAS/IA GLOW) ---
const AIBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [stars, setStars] = useState<{ top: string; left: string; delay: string; duration: string; opacity: number; scale: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 7}s`,
      opacity: 0.1 + Math.random() * 0.5,
      scale: 0.5 + Math.random()
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-xl blur-[120px] opacity-20 animate-pulse 
        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '8s' }} 
      />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-xl blur-[150px] opacity-20 animate-pulse
        ${isDarkMode ? 'bg-purple-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '12s', animationDelay: '2s' }} 
      />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)' }}>
        <div className="stars-container">
          {stars.map((star, i) => (
            <div 
              key={i} 
              className={`star ${isDarkMode ? 'bg-white' : 'bg-blue-500'}`}
              style={{
                top: star.top,
                left: star.left,
                animationDelay: star.delay,
                animationDuration: star.duration,
                opacity: star.opacity,
                transform: `scale(${star.scale})`
              }}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .stars-container { position: relative; width: 100%; height: 100%; }
        .star { position: absolute; width: 2px; height: 2px; border-radius: 50%; animation: float linear infinite; }
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

type Language = 'pt' | 'en' | 'ko';

const translations = {
  pt: {
    badge: "Dashboard Analítico",
    title: "Central de",
    titleAccent: "Métricas",
    subtitle: "Análise de desempenho e distribuição de carga técnica.",
    kpiTotal: "Total Registros",
    kpiPending: "Pendentes",
    kpiCompleted: "Concluídos",
    kpiRate: "Taxa Conclusão",
    kpiRejectionRate: "Taxa Rejeição",
    chartCreationFlow: "Fluxo de Criação",
    chartByCategory: "Por Categoria",
    chartByStatus: "Carga por Status",
    chartByUrgency: "Níveis de Urgência",
    tableTitle: "Tabela de Registros",
    tableTotal: "Total",
    tableColRecord: "Registro",
    tableColType: "Tipo",
    tableColUrgency: "Urgência",
    tableColStatus: "Status",
    tableColDate: "Data",
    paginationPrev: "Anterior",
    paginationNext: "Próxima",
    paginationPage: "Pág",
    paginationOf: "de",
    loadingText: "Processando Inteligência...",
    suspenseLoading: "Iniciando Dashboard...",
    typeTickets: "Tickets",
    typeImprovements: "Melhorias",
    typeProjects: "Projetos"
  },
  en: {
    badge: "Analytical Dashboard",
    title: "Metrics",
    titleAccent: "Center",
    subtitle: "Performance analysis and technical load distribution.",
    kpiTotal: "Total Records",
    kpiPending: "Pending",
    kpiCompleted: "Completed",
    kpiRate: "Completion Rate",
    kpiRejectionRate: "Rejection Rate",
    chartCreationFlow: "Creation Flow",
    chartByCategory: "By Category",
    chartByStatus: "Load by Status",
    chartByUrgency: "Urgency Levels",
    tableTitle: "Records Table",
    tableTotal: "Total",
    tableColRecord: "Record",
    tableColType: "Type",
    tableColUrgency: "Urgency",
    tableColStatus: "Status",
    tableColDate: "Date",
    paginationPrev: "Previous",
    paginationNext: "Next",
    paginationPage: "Page",
    paginationOf: "of",
    loadingText: "Processing Intelligence...",
    suspenseLoading: "Starting Dashboard...",
    typeTickets: "Tickets",
    typeImprovements: "Improvements",
    typeProjects: "Projects"
  },
  ko: {
    badge: "분석 대시보드",
    title: "지표",
    titleAccent: "센터",
    subtitle: "성능 분석 및 기술 부하 분산.",
    kpiTotal: "총 기록",
    kpiPending: "대기 중",
    kpiCompleted: "완료됨",
    kpiRate: "완료율",
    kpiRejectionRate: "거부율",
    chartCreationFlow: "생성 흐름",
    chartByCategory: "범주별",
    chartByStatus: "상태별 부하",
    chartByUrgency: "긴급도 수준",
    tableTitle: "기록 테이블",
    tableTotal: "합계",
    tableColRecord: "기록",
    tableColType: "유형",
    tableColUrgency: "긴급도",
    tableColStatus: "상태",
    tableColDate: "날짜",
    paginationPrev: "이전",
    paginationNext: "다음",
    paginationPage: "페이지",
    paginationOf: "/",
    loadingText: "지능 처리 중...",
    suspenseLoading: "대시보드 시작 중...",
    typeTickets: "티켓",
    typeImprovements: "개선 사항",
    typeProjects: "프로젝트"
  }
};

function TicketsDashboardContent() {
  const { isDarkMode } = useTheme();
  const { language: globalLang } = useLanguage();
  const lang = (globalLang === 'pt-BR' ? 'pt' : globalLang) as Language;
  const t = translations[lang];
  const { toast } = useToast();

  const [records, setRecords] = useState<TicketRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [selectedRecord, setSelectedRecord] = useState<TicketRecord | null>(null);

  const [dialog, setDialog] = useState<{ isOpen: boolean; title: string; message: string; type: 'alert' | 'password' | 'resolution'; onConfirm?: (val?: string) => void }>({ isOpen: false, title: '', message: '', type: 'alert' });
  const [inputValue, setInputValue] = useState('');

  const API_URL = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:8001` 
    : '';

  const showAlert = (title: string, message: string, type: any = 'alert', onConfirm?: any) => {
    setInputValue('');
    setDialog({ isOpen: true, title, message, type, onConfirm });
  };

  const updateStatus = async (id: number, newStatus: string) => {
    if (newStatus === 'concluido') {
      showAlert('Resolução Final', 'Digite o relatório de conclusão do chamado.', 'resolution', async (text: string) => {
        if (!text?.trim()) return alert('O relatório de resolução é obrigatório.');
        try {
          const res = await fetch(`${API_URL}/tickets/${id}/status`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ status: newStatus, resolution: text }) 
          });
          if (res.ok) {
            toast({ title: "Salvo com sucesso", description: "O status e a resolução foram atualizados." });
            fetchTickets();
            setDialog(prev => ({ ...prev, isOpen: false }));
            if (selectedRecord?.id === id) setSelectedRecord({ ...selectedRecord, status: newStatus, resolution: text });
          } else {
            const err = await res.json();
            throw new Error(err.detail || 'Erro ao salvar');
          }
        } catch (e: any) {
          toast({ title: "Erro ao salvar", description: e.message || "Não foi possível atualizar o banco de dados.", variant: "destructive" });
        }
      });
    } else {
      showAlert('Confirmar Ação', `Deseja realmente alterar o status para ${newStatus.toUpperCase()}?`, 'alert', async () => {
        try {
          const res = await fetch(`${API_URL}/tickets/${id}/status`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ status: newStatus }) 
          });
          if (res.ok) {
            toast({ title: "Status atualizado", description: "As mudanças foram aplicadas com sucesso." });
            fetchTickets();
            setDialog(prev => ({ ...prev, isOpen: false }));
            if (selectedRecord?.id === id) setSelectedRecord({ ...selectedRecord, status: newStatus });
          } else {
            const err = await res.json();
            throw new Error(err.detail || 'Erro ao salvar');
          }
        } catch (e: any) {
          toast({ title: "Erro ao salvar", description: e.message || "Não foi possível atualizar o banco de dados.", variant: "destructive" });
        }
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ticket': return <Bug className="w-3.5 h-3.5 text-rose-500" />;
      case 'improvement': return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      default: return <FolderGit2 className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Baixa': return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500';
      case 'Média': return 'bg-blue-500/20 border-blue-500/30 text-blue-500';
      case 'Alta': return 'bg-amber-500/20 border-amber-500/30 text-amber-500';
      case 'Urgente': return 'bg-rose-500/20 border-rose-500/30 text-rose-500';
      default: return 'bg-zinc-500/20 border-zinc-500/30 text-zinc-500';
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Pendente': return { bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50', border: 'border-amber-500/20', text: 'text-amber-600' };
      case 'Em Andamento': return { bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50', border: 'border-blue-500/20', text: 'text-blue-600' };
      case 'Concluído': return { bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50', border: 'border-emerald-500/20', text: 'text-emerald-600' };
      default: return { bg: isDarkMode ? 'bg-zinc-500/10' : 'bg-zinc-50', border: 'border-zinc-500/20', text: 'text-zinc-600' };
    }
  };

  const handleCopyTicket = async (record: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const typeLabel = record.type === 'ticket' ? 'BUG TICKET' : record.type === 'improvement' ? 'IMPROVEMENT' : 'PROJECT';
    const copyText = `[${typeLabel}]\nID: ${record.id}\nStatus: ${record.status}\nPriority: ${record.priority}\nTitle: ${record.title}\nDescription: ${record.content.replace(/<[^>]*>?/gm, '')}\n`;
    try {
      await navigator.clipboard.writeText(copyText);
    } catch (err) {}
  };

  const fetchTickets = useCallback(async () => {
    if (!API_URL) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/tickets`);
      if (res.ok) {
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
      }
    } catch (error) {} finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const stats = useMemo(() => {
    if (records.length === 0) return null;

    const byType = {
      ticket: records.filter(r => r.type === 'ticket').length,
      improvement: records.filter(r => r.type === 'improvement').length,
      project: records.filter(r => r.type === 'project').length,
    };

    const byStatus = {
      pendente: records.filter(r => r.status === 'pendente').length,
      aceito: records.filter(r => r.status === 'aceito').length,
      rejeitado: records.filter(r => r.status === 'rejeitado').length,
      concluido: records.filter(r => r.status === 'concluido').length,
    };

    const byPriority = {
      Baixa: records.filter(r => r.priority === 'Baixa').length,
      Média: records.filter(r => r.priority === 'Média').length,
      Alta: records.filter(r => r.priority === 'Alta').length,
      Urgente: records.filter(r => r.priority === 'Urgente').length,
    };

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const overTime = last7Days.map(date => ({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      count: records.filter(r => r.created_at.startsWith(date)).length
    }));

    const typeData = [
      { name: 'Tickets', value: byType.ticket, color: COLORS.ticket },
      { name: 'Melhorias', value: byType.improvement, color: COLORS.improvement },
      { name: 'Projetos', value: byType.project, color: COLORS.project },
    ];

    const statusData = [
      { name: 'Pendente', value: byStatus.pendente, color: COLORS.pendente },
      { name: 'Aceito', value: byStatus.aceito, color: COLORS.aceito },
      { name: 'Rejeitado', value: byStatus.rejeitado, color: COLORS.rejeitado },
      { name: 'Concluído', value: byStatus.concluido, color: COLORS.concluido },
    ];

    const priorityData = [
      { name: 'Baixa', value: byPriority.Baixa, color: COLORS.baixa },
      { name: 'Média', value: byPriority.Média, color: COLORS.media },
      { name: 'Alta', value: byPriority.Alta, color: COLORS.alta },
      { name: 'Urgente', value: byPriority.Urgente, color: COLORS.urgente },
    ];

    const validForCompletion = records.length - byStatus.rejeitado;

    return {
      total: records.length,
      byType,
      byStatus,
      byPriority,
      typeData,
      statusData,
      priorityData,
      overTime,
      concluidosRate: validForCompletion > 0 ? Math.round((byStatus.concluido / validForCompletion) * 100) : 0,
      rejeitadosRate: records.length ? Math.round((byStatus.rejeitado / records.length) * 100) : 0
    };
  }, [records]);

  const mainBgClass = isDarkMode ? "bg-[#050505] text-gray-200" : "bg-[#f5f5f7] text-gray-800";
  // Ajuste de transparência para seguir o padrão da Navbar (bg-black/30 e bg-white/40)
  const cardClass = `relative overflow-hidden rounded-xl border transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendente': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'aceito': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejeitado': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'concluido': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${mainBgClass}`}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm font-black uppercase tracking-widest opacity-40">Processando Inteligência...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 transition-colors duration-1000 ${mainBgClass} overflow-x-hidden pb-20`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />

      <div className="w-full max-w-7xl relative z-10 space-y-10 px-4">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border-b border-black/5 dark:border-white/5 pb-8 text-center md:text-left pt-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> {t.badge}
            </div>
            <h1 className={`text-4xl lg:text-5xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{t.titleAccent}</span>
            </h1>
            <p className="text-sm font-bold opacity-50 max-w-sm">{t.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4 mt-4 md:mt-0">
            <TicketNavigation />
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { label: t.kpiTotal, val: stats?.total, icon: FileText, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
            { label: t.kpiPending, val: stats?.byStatus.pendente, icon: Clock, gradient: 'from-orange-400 to-rose-500', shadow: 'shadow-orange-500/20' },
            { label: t.kpiCompleted, val: stats?.byStatus.concluido, icon: CheckCircle2, gradient: 'from-emerald-400 to-teal-600', shadow: 'shadow-emerald-500/20' },
            { label: t.kpiRate, val: `${stats?.concluidosRate}%`, icon: TrendingUp, gradient: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20' },
            { label: t.kpiRejectionRate, val: `${stats?.rejeitadosRate}%`, icon: AlertTriangle, gradient: 'from-rose-500 to-red-700', shadow: 'shadow-red-500/20' }
          ].map((kpi, i) => (
            <Card key={i} className={`${cardClass} p-6 flex items-center justify-between group hover:scale-[1.02]`}>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">{kpi.label}</p>
                <p className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{kpi.val || 0}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${kpi.gradient} shadow-lg ${kpi.shadow} transition-all duration-500 group-hover:rotate-3 group-hover:scale-110`}>
                <kpi.icon className="w-6 h-6"/>
              </div>
            </Card>
          ))}
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className={`${cardClass} lg:col-span-2 p-8 border-none shadow-xl`}>
            <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-8 flex items-center gap-2"><div className="w-2 h-2 rounded-xl bg-blue-500 animate-pulse"></div> {t.chartCreationFlow}</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.overTime || []}>
                  <defs><linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: isDarkMode ? '#555' : '#aaa' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: isDarkMode ? '#555' : '#aaa' }} />
                  <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#111' : '#fff', borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }} />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" name="Registros" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className={`${cardClass} p-8 border-none shadow-xl flex flex-col`}>
            <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-8">{t.chartByCategory}</h3>
            <div className="flex-grow flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stats?.typeData || []} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                    {(stats?.typeData || []).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', fontWeight: 'bold' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Status e Prioridade */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className={`${cardClass} p-8 border-none shadow-xl`}>
            <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-10">{t.chartByStatus}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.statusData || []} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'black', fill: isDarkMode ? '#aaa' : '#555' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '15px', border: 'none' }} />
                  <Bar dataKey="value" radius={[0, 15, 15, 0]} barSize={35}>
                    {(stats?.statusData || []).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className={`${cardClass} p-8 border-none shadow-xl`}>
            <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-10">{t.chartByUrgency}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.priorityData || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'black', fill: isDarkMode ? '#aaa' : '#555' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDarkMode ? '#555' : '#aaa' }} />
                  <Tooltip cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', radius: 15 }} contentStyle={{ borderRadius: '15px', border: 'none' }} />
                  <Bar dataKey="value" radius={[15, 15, 0, 0]} barSize={50}>
                    {(stats?.priorityData || []).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Tabela de Dados */}
        <Card className={`${cardClass} p-8 border-none shadow-2xl`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-40">{t.tableTitle}</h3>
            <span className="px-4 py-1.5 rounded-xl bg-black/10 dark:bg-white/10 text-[10px] font-black uppercase tracking-widest">{t.tableTotal}: {records.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-separate border-spacing-y-3">
              <thead>
                <tr className="opacity-30 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-4 pb-4">{t.tableColRecord}</th>
                  <th className="px-4 pb-4">{t.tableColType}</th>
                  <th className="px-4 pb-4">{t.tableColUrgency}</th>
                  <th className="px-4 pb-4">{t.tableColStatus}</th>
                  <th className="px-4 pb-4 text-right">{t.tableColDate}</th>
                </tr>
              </thead>
              <tbody>
                {records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((r) => (
                  <tr key={r.id} onClick={() => setSelectedRecord(r)} className={`cursor-pointer ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} hover:scale-[1.01] transition-all duration-300`}>
                    <td className="px-4 py-5 rounded-l-2xl font-bold truncate max-w-[250px]">{r.title}</td>
                    <td className="px-4 py-5"><span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${r.type === 'ticket' ? 'bg-red-500/10 border-red-500/20 text-red-500' : r.type === 'improvement' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>{r.type}</span></td>
                    <td className="px-4 py-5"><span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${r.priority === 'Baixa' ? 'bg-green-500/10 border-green-500/20 text-green-500' : r.priority === 'Alta' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : r.priority === 'Urgente' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>{r.priority}</span></td>
                    <td className="px-4 py-5"><span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${getStatusColor(r.status)}`}>{r.status}</span></td>
                    <td className="px-4 py-5 rounded-r-2xl text-right font-bold opacity-40 text-[10px]">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {records.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-black/5 dark:border-white/5">
              <span className="text-[10px] font-black uppercase opacity-20">{t.paginationPage} {currentPage} {t.paginationOf} {Math.ceil(records.length / itemsPerPage)}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="rounded-xl h-10 px-5 text-[10px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all">{t.paginationPrev}</Button>
                <div className="flex gap-1.5">
                  {Array.from({ length: Math.ceil(records.length / itemsPerPage) }).map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-black/5 dark:bg-white/5 opacity-40 hover:opacity-100'}`}>{i + 1}</button>
                  ))}
                </div>
                <Button variant="ghost" disabled={currentPage === Math.ceil(records.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)} className="rounded-xl h-10 px-5 text-[10px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all">{t.paginationNext}</Button>
              </div>
            </div>
          )}
        </Card>

      </div>

      {/* MODAL DE DETALHES DE ALTA FIDELIDADE */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-6 backdrop-blur-[40px] transition-all duration-700 animate-in fade-in zoom-in-95">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedRecord(null)} />

          <Card className={`relative w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col z-10 border-none shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-xl md:rounded-[3rem] ${isDarkMode ? 'bg-[#0a0a0a]/95 ring-1 ring-white/10' : 'bg-white/95 ring-1 ring-black/5'}`}>
            <div className={`absolute top-0 right-0 w-[60%] h-64 blur-[120px] opacity-20 pointer-events-none transition-all duration-1000 ${getPriorityColor(selectedRecord.priority)}`} />

            {/* Modal Header */}
            <div className={`px-8 md:px-10 py-8 border-b flex flex-col gap-5 relative z-10 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/[0.02]'}`}>
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'} shadow-sm flex items-center gap-2`}>
                    {getTypeIcon(selectedRecord.type)} {selectedRecord.type}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${getStatusStyle(selectedRecord.status).bg} ${getStatusStyle(selectedRecord.status).border} ${getStatusStyle(selectedRecord.status).text}`}>
                    {selectedRecord.status}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm text-white ${getPriorityColor(selectedRecord.priority)}`}>
                    {selectedRecord.priority}
                  </span>
                  <div className="text-[9px] font-bold opacity-40 ml-2 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Aberto em {new Date(selectedRecord.created_at).toLocaleString('pt-BR')}
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedRecord(null)} className="h-10 w-10 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-red-500/20 dark:hover:text-red-500 transition-all"><X className="w-5 h-5" /></Button>
              </div>
              <h2 className={`text-3xl md:text-4xl font-black tracking-tighter leading-tight pr-10 uppercase ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{selectedRecord.title}</h2>
            </div>

            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto p-8 md:p-10 custom-scrollbar relative z-10 scroll-smooth flex flex-col lg:flex-row gap-10">
              <div className="flex-grow space-y-10">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Especificação Técnica</h3>
                  <div className={`prose-content max-w-none text-base leading-relaxed font-medium p-6 rounded-xl border shadow-inner ${isDarkMode ? 'bg-black/20 border-white/5 text-zinc-300' : 'bg-black/[0.02] border-black/5 text-zinc-700'}`} dangerouslySetInnerHTML={{ __html: selectedRecord.content }} />
                </div>

                {selectedRecord.resolution && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Despacho Final de Resolução</h3>
                    <div className={`p-6 rounded-xl border shadow-lg ${isDarkMode ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                      <p className={`text-lg font-bold leading-relaxed ${isDarkMode ? 'text-emerald-50' : 'text-emerald-900'}`}>{selectedRecord.resolution}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lateral Direita do Modal (Metadados e Ações) */}
              <div className="w-full lg:w-[320px] shrink-0 space-y-6">
                <section className={`p-6 rounded-xl border shadow-sm ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/[0.02] border-black/5'}`}>
                  <h3 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-5 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Equipe Alocada</h3>
                  <div className="space-y-4">
                    {(selectedRecord.creators || []).map((c: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-base font-black text-white shadow-md ${['bg-blue-500', 'bg-indigo-500', 'bg-purple-500'][i%3]}`}>
                          {c.name ? c.name.charAt(0) : '?'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{c.name}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{c.team || c.role}</span>
                        </div>
                      </div>
                    ))}
                    {(!selectedRecord.creators || selectedRecord.creators.length === 0) && (
                      <span className="text-xs opacity-50 font-bold">Sem equipe alocada</span>
                    )}
                  </div>
                </section>

                <section className={`p-6 rounded-xl border shadow-sm ${isDarkMode ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
                  <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 mb-5 flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" /> Controle de Ciclo de Vida</h3>
                  <div className="flex flex-col gap-2.5">
                    {['pendente', 'aceito', 'rejeitado', 'concluido'].map(s => {
                      const isActive = selectedRecord.status === s;
                      const style = getStatusStyle(s);
                      return (
                        <button 
                          key={s} 
                          onClick={() => updateStatus(selectedRecord.id, s)} 
                          className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border flex items-center justify-between group
                            ${isActive 
                              ? `${style.bg} ${style.border} ${style.text} shadow-md scale-[1.02]` 
                              : `bg-transparent opacity-50 hover:opacity-100 ${isDarkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-black/10 text-zinc-900 hover:bg-black/5'}`}`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isActive && <div className={`w-1.5 h-1.5 rounded-xl animate-pulse bg-current`} />}
                            {s}
                          </div>
                          {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-10 py-5 border-t flex justify-between items-center z-10 backdrop-blur-md ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-black/5'}`}>
              <Button onClick={(e) => handleCopyTicket(selectedRecord, e)} variant="ghost" className="rounded-xl px-5 h-10 font-black text-[9px] uppercase gap-2 opacity-50 hover:opacity-100"><Copy className="w-3.5 h-3.5" /> Copiar Dados</Button>
              <div className="flex gap-3">
                <Button onClick={() => setSelectedRecord(null)} className={`rounded-xl px-8 h-10 font-black text-[9px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-black'}`}>Fechar Painel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* DIÁLOGOS DE AÇÃO */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-[20px] transition-all duration-500 animate-in fade-in zoom-in-95">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))} />
          <Card className={`relative w-full max-w-lg rounded-[3rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] p-12 text-center space-y-8 ${isDarkMode ? 'bg-[#111] ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'}`}>
            <div className={`mx-auto w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-inner border 
              ${dialog.type === 'password' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 
                dialog.type === 'resolution' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
              {dialog.type === 'password' ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
            </div>
            
            <div className="space-y-3">
              <h3 className={`text-2xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{dialog.title}</h3>
              <p className="text-xs font-bold opacity-40 px-4 leading-relaxed">{dialog.message}</p>
            </div>
            
            {dialog.type === 'password' && (
              <Input type="password" placeholder="••••••••" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className={`h-14 text-center text-2xl tracking-[0.5em] font-black rounded-[1.5rem] border-none shadow-inner focus:ring-2 focus:ring-rose-500/50 ${isDarkMode ? 'bg-black/40 text-white' : 'bg-zinc-100 text-zinc-900'}`} autoFocus />
            )}
            {dialog.type === 'resolution' && (
              <textarea placeholder="Relatório de conclusão..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className={`w-full min-h-[120px] p-5 text-xs font-bold rounded-[1.5rem] border-none outline-none resize-none shadow-inner focus:ring-2 focus:ring-emerald-500/50 ${isDarkMode ? 'bg-black/40 text-white' : 'bg-zinc-100 text-zinc-900'}`} autoFocus />
            )}
            
            <div className="flex gap-4 pt-4">
              <Button variant="ghost" onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))} className="flex-1 h-12 rounded-xl font-black text-[9px] uppercase opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all">Cancelar</Button>
              <Button onClick={() => dialog.onConfirm?.(inputValue)} className={`flex-1 h-12 rounded-xl font-black text-[9px] uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95 
                ${dialog.type === 'password' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20' : 
                  dialog.type === 'resolution' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 
                  'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}>
                Confirmar
              </Button>
            </div>
          </Card>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128, 128, 128, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(128, 128, 128, 0.4); }
        .prose-content * { color: inherit !important; }
        .prose-content img { border-radius: 1rem; margin: 2rem 0; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
}

export default function TicketsDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase opacity-20 tracking-widest">Iniciando Dashboard...</div>}>
      <TicketsDashboardContent />
    </Suspense>
  );
}