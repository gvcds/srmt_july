'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Zap,
  Lightbulb,
  Cpu,
  Sparkles,
  FileText,
  Monitor,
  Watch,
  ShieldCheck,
  Smartphone,
  Wrench,
  Activity,
  FolderPlus,
  Layout,
  Ticket as TicketIcon,
  ListOrdered,
  Search,
  X,
  User as UserIcon,
  Copy,
  Trash2,
  History
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { TicketNavigation } from "@/components/ticket-navigation";
import { useTheme } from '@/components/theme-provider';

const COLORS = {
  erro: '#f43f5e',
  sugestao: '#f59e0b',
  solicitacao: '#3b82f6',
  concluido: '#10b981',
  pendente: '#f97316'
};

// --- COMPONENTE DE FUNDO ANIMADO ---
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
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-20 animate-pulse 
        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '8s' }} 
      />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-20 animate-pulse
        ${isDarkMode ? 'bg-purple-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '12s', animationDelay: '2s' }} 
      />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)' }}>
        <div className="stars-container">
          {stars.map((star, i) => (
            <div key={i} className={`star ${isDarkMode ? 'bg-white' : 'bg-blue-500'}`} style={{ top: star.top, left: star.left, animationDelay: star.delay, animationDuration: star.duration, opacity: star.opacity, transform: `scale(${star.scale})` }} />
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
    badge: "Dashboard Automação",
    title: "Métricas de",
    titleAccent: "Engenharia",
    subtitle: "Análise técnica de scripts e performance das squads de automação.",
    kpiTotal: "Total Scripts",
    kpiActiveErrors: "Erros Ativos",
    kpiCompleted: "Concluídos",
    kpiEfficiency: "Taxa Eficiência",
    chartSquadDistribution: "Distribuição por Squad",
    chartCategoryLoad: "Carga por Categoria",
    chartTopWorkload: "Top Workload",
    totalLabel: "Total",
    loadingLogs: "Processando Logs...",
    suspenseLoading: "Iniciando Dashboard...",
    typeErrors: "Erros",
    typeSuggestions: "Sugestões",
    typeRequests: "Pedidos"
  },
  en: {
    badge: "Automation Dashboard",
    title: "Engineering",
    titleAccent: "Metrics",
    subtitle: "Technical analysis of scripts and automation squad performance.",
    kpiTotal: "Total Scripts",
    kpiActiveErrors: "Active Errors",
    kpiCompleted: "Completed",
    kpiEfficiency: "Efficiency Rate",
    chartSquadDistribution: "Squad Distribution",
    chartCategoryLoad: "Category Load",
    chartTopWorkload: "Top Workload",
    totalLabel: "Total",
    loadingLogs: "Processing Logs...",
    suspenseLoading: "Starting Dashboard...",
    typeErrors: "Errors",
    typeSuggestions: "Suggestions",
    typeRequests: "Requests"
  },
  ko: {
    badge: "자동화 대시보드",
    title: "엔지니어링",
    titleAccent: "지표",
    subtitle: "스크립트 및 자동화 스쿼드 성능의 기술적 분석.",
    kpiTotal: "총 스크립트",
    kpiActiveErrors: "활성 오류",
    kpiCompleted: "완료됨",
    kpiEfficiency: "효율성 비율",
    chartSquadDistribution: "스쿼드별 분포",
    chartCategoryLoad: "범주별 부하",
    chartTopWorkload: "최고 부하",
    totalLabel: "합계",
    loadingLogs: "로그 처리 중...",
    suspenseLoading: "대시보드 시작 중...",
    typeErrors: "오류",
    typeSuggestions: "제안",
    typeRequests: "요청"
  }
};

function AutomacoesDashboardContent() {
  const { isDarkMode } = useTheme();
  const [lang, setLanguage] = useState<Language>('pt');
  const t = translations[lang];

  useEffect(() => {
    const savedLang = localStorage.getItem('srmt_lang') as Language;
    if (savedLang && ['pt', 'en', 'ko'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (l: Language) => {
    setLanguage(l);
    localStorage.setItem('srmt_lang', l);
  };

  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8001` : '';

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tickets`);
      if (res.ok) setRecords(await res.json());
    } catch (error) {} finally { setIsLoading(false); }
  }, [API_URL]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const automations = useMemo(() => records.filter(r => r.type === 'automation'), [records]);

  const stats = useMemo(() => {
    if (automations.length === 0) return null;

    const byType = {
      erro: automations.filter(r => r.content.includes('ERRO')).length,
      sugestao: automations.filter(r => r.content.includes('SUGESTAO')).length,
      solicitacao: automations.filter(r => r.content.includes('SOLICITACAO')).length,
    };

    const byTeam = {
      Multimidia: automations.filter(r => r.content.includes('TIME: Multimidia')).length,
      Wearables: automations.filter(r => r.content.includes('TIME: Wearables')).length,
      Sanity: automations.filter(r => r.content.includes('TIME: Sanity')).length,
      Apps1: automations.filter(r => r.content.includes('TIME: Apps1')).length,
      Apps2: automations.filter(r => r.content.includes('TIME: Apps2')).length,
      PhoneSettings: automations.filter(r => r.content.includes('TIME: PhoneSettings')).length,
    };

    const typeData = [
      { name: t.typeErrors, value: byType.erro, color: COLORS.erro },
      { name: t.typeSuggestions, value: byType.sugestao, color: COLORS.sugestao },
      { name: t.typeRequests, value: byType.solicitacao, color: COLORS.solicitacao },
    ];

    const teamData = Object.entries(byTeam).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);

    return {
      total: automations.length,
      byType,
      byTeam,
      typeData,
      teamData,
      concluidos: automations.filter(r => r.status === 'concluido').length,
      concluidosRate: automations.length ? Math.round((automations.filter(r => r.status === 'concluido').length / automations.length) * 100) : 0
    };
  }, [automations, t]);

  const mainBgClass = isDarkMode ? "bg-[#050505] text-zinc-300" : "bg-[#f5f5f7] text-zinc-800";
  const cardClass = `relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`;

  if (isLoading) return <div className={`min-h-screen flex items-center justify-center ${mainBgClass}`}><div className="animate-pulse flex flex-col items-center gap-4"><div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" /><p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">{t.loadingLogs}</p></div></div>;

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-10 transition-colors duration-1000 ${mainBgClass} overflow-x-hidden pb-20`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />

      <div className="w-full max-w-7xl relative z-10 space-y-12 px-4">
        
        {/* Seletor de Idioma */}
        <div className="flex justify-center mb-4 gap-2">
          {[
            { id: 'pt', label: 'Português', icon: '🇧🇷' },
            { id: 'en', label: 'English', icon: '🇺🇸' },
            { id: 'ko', label: '한국어', icon: '🇰🇷' }
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => changeLanguage(l.id as Language)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${lang === l.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'}`}
            >
              <span>{l.icon}</span> {l.label}
            </button>
          ))}
        </div>

        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 border-b border-black/5 dark:border-white/5 pb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3" /> {t.badge}
            </div>
            <h1 className={`text-4xl md:text-6xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{t.titleAccent}</span>
            </h1>
            <p className="text-base font-bold opacity-40 max-w-md">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <TicketNavigation />
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t.kpiTotal, val: stats?.total, icon: FileText, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
            { label: t.kpiActiveErrors, val: stats?.byType.erro, icon: Zap, gradient: 'from-rose-400 to-red-600', shadow: 'shadow-rose-500/20' },
            { label: t.kpiCompleted, val: stats?.concluidos, icon: CheckCircle2, gradient: 'from-emerald-400 to-teal-600', shadow: 'shadow-emerald-500/20' },
            { label: t.kpiEfficiency, val: `${stats?.concluidosRate}%`, icon: TrendingUp, gradient: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20' }
          ].map((kpi, i) => (
            <Card key={i} className={`${cardClass} p-6 flex items-center justify-between group hover:scale-[1.02]`}>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">{kpi.label}</p>
                <p className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{kpi.val || 0}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${kpi.gradient} shadow-lg ${kpi.shadow} transition-all duration-500 group-hover:rotate-3 group-hover:scale-110`}>
                <kpi.icon className="w-6 h-6"/>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className={`${cardClass} lg:col-span-8 p-8 md:p-10 flex flex-col gap-8`}>
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2"><Monitor className="w-3.5 h-3.5 text-blue-500" /> {t.chartSquadDistribution}</h3>
              <span className="text-[8px] font-black uppercase bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md">{t.chartTopWorkload}</span>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.teamData || []} layout="vertical" margin={{ left: 40, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'black', fill: '#71717a' }} />
                  <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: isDarkMode ? '#111' : '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={30} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className={`${cardClass} lg:col-span-4 p-8 md:p-10 flex flex-col gap-8`}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2"><Layout className="w-3.5 h-3.5 text-purple-500" /> {t.chartCategoryLoad}</h3>
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats?.typeData || []} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={10} dataKey="value" stroke="none" cornerRadius={8}>
                      {(stats?.typeData || []).map((entry: any, index: number) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black tracking-tighter">{stats?.total}</span>
                  <span className="text-[8px] font-black uppercase opacity-30">{t.totalLabel}</span>
                </div>
              </div>
              <div className="w-full space-y-2 mt-6">
                {stats?.typeData.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-black">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AutomacoesDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase opacity-20 tracking-widest">{translations.pt.suspenseLoading}</div>}>
      <AutomacoesDashboardContent />
    </Suspense>
  );
}
