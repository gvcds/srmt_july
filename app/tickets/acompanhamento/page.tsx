'use client';

import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Plus, 
  ArrowLeft, 
  Save, 
  Users, 
  Cpu, 
  Zap, 
  Lightbulb, 
  History, 
  Smartphone, 
  Watch, 
  ShieldCheck, 
  ChevronRight, 
  Monitor, 
  Wrench,
  Activity,
  Box,
  Layout,
  Sparkles,
  Ticket as TicketIcon,
  FolderPlus,
  BarChart3,
  ListOrdered,
  Search,
  X,
  Clock,
  Copy,
  Trash2,
  User as UserIcon,
  Filter,
  ArrowDownUp,
  SlidersHorizontal,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  LayoutGrid,
  List as ListIcon,
  MoreVertical,
  CheckCircle,
  Pencil,
  ChevronLeft,
  FileText,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { TicketNavigation } from "@/components/ticket-navigation";
import { useTheme } from '@/components/theme-provider';
import { useToast } from "@/components/ui/use-toast";

// --- COMPONENTE DE FUNDO ANIMADO ---
const AIBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [stars, setStars] = useState<{ top: string; left: string; delay: string; duration: string; opacity: number; scale: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 40 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 10}s`,
      opacity: 0.1 + Math.random() * 0.4,
      scale: 0.5 + Math.random()
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-xl blur-[150px] opacity-20 animate-pulse ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-xl blur-[150px] opacity-20 animate-pulse ${isDarkMode ? 'bg-purple-600' : 'bg-blue-400'}`} style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)' }}>
        <div className="stars-container w-full h-full relative">
          {stars.map((star, i) => (
            <div key={i} className={`star absolute w-0.5 h-0.5 rounded-xl animate-pulse ${isDarkMode ? 'bg-white' : 'bg-blue-500'}`} style={{ top: star.top, left: star.left, animationDelay: star.delay, animationDuration: star.duration, opacity: star.opacity, transform: `scale(${star.scale})` }} />
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

const ITEMS_PER_PAGE = 10;

type Language = 'pt' | 'en' | 'ko';

const translations = {
  pt: {
    badge: "SVP Controle",
    title: "Gestão de",
    titleAccent: "Tickets",
    subtitle: "Acompanhamento avançado, auditoria e fluxo de vida útil.",
    searchPlaceholder: "Buscar por ID, Título, Squad ou Responsável...",
    sortRecent: "Recentes",
    sortOldest: "Antigos",
    filterAreaAll: "Todas as Áreas",
    filterAreaTickets: "Tickets Gerais",
    filterAreaImprovements: "Melhorias",
    filterAreaProjects: "Projetos",
    filterAreaAutomations: "Automações",
    filterStatusAll: "Todos os Status",
    filterPriorityAll: "Toda Prioridade",
    loadingBase: "Sincronizando Base de Dados...",
    noRecords: "Nenhum registro encontrado",
    noRecordsSub: "Tente ajustar os filtros ou os termos de busca.",
    copySuccess: "Copiado para a área de transferência!",
    detailsTitle: "Especificação Técnica",
    resolutionTitle: "Despacho Final de Resolução",
    teamTitle: "Equipe Alocada",
    lifecycleTitle: "Controle de Ciclo de Vida",
    closePanel: "Fechar Painel",
    copyData: "Copiar Dados",
    dialogResolution: "Resolução",
    dialogResolutionMsg: "Descreva brevemente o que foi realizado para concluir este ticket.",
    dialogResolutionPlaceholder: "Relatório de conclusão...",
    dialogConfirmTitle: "Confirmar Alteração",
    dialogConfirmMsg: "Deseja realmente alterar o status para",
    dialogDeleteTitle: "Exclusão Protegida",
    dialogDeleteMsg: "Insira a senha mestra para deletar este registro permanentemente.",
    dialogCancel: "Cancelar",
    dialogConfirm: "Confirmar",
    dialogBack: "Voltar",
    toastSaveSuccess: "Salvamento Concluído",
    toastSaveSuccessMsg: "Status e resolução foram salvas no banco de dados.",
    toastStatusUpdated: "Alteração Salva",
    toastStatusUpdatedMsg: "O status foi atualizado com sucesso.",
    alertResolutionRequired: "A descrição da resolução é obrigatória.",
    alertIncorrectPass: "Senha incorreta.",
    timeToday: "Hoje",
    timeYesterday: "Ontem",
    timeDaysAgo: "Há {days} dias",
    openDetails: "Abrir Detalhes"
  },
  en: {
    badge: "SVP Control",
    title: "Ticket",
    titleAccent: "Management",
    subtitle: "Advanced tracking, auditing, and lifecycle flow.",
    searchPlaceholder: "Search by ID, Title, Squad, or Responsible...",
    sortRecent: "Recent",
    sortOldest: "Oldest",
    filterAreaAll: "All Areas",
    filterAreaTickets: "General Tickets",
    filterAreaImprovements: "Improvements",
    filterAreaProjects: "Projects",
    filterAreaAutomations: "Automations",
    filterStatusAll: "All Status",
    filterPriorityAll: "All Priority",
    loadingBase: "Synchronizing Database...",
    noRecords: "No records found",
    noRecordsSub: "Try adjusting the filters or search terms.",
    copySuccess: "Copied to clipboard!",
    detailsTitle: "Technical Specification",
    resolutionTitle: "Final Resolution Dispatch",
    teamTitle: "Allocated Team",
    lifecycleTitle: "Lifecycle Control",
    closePanel: "Close Panel",
    copyData: "Copy Data",
    dialogResolution: "Resolution",
    dialogResolutionMsg: "Briefly describe what was done to complete this ticket.",
    dialogResolutionPlaceholder: "Completion report...",
    dialogConfirmTitle: "Confirm Change",
    dialogConfirmMsg: "Do you really want to change the status to",
    dialogDeleteTitle: "Protected Deletion",
    dialogDeleteMsg: "Enter the master password to permanently delete this record.",
    dialogCancel: "Cancel",
    dialogConfirm: "Confirm",
    dialogBack: "Back",
    toastSaveSuccess: "Save Completed",
    toastSaveSuccessMsg: "Status and resolution have been saved to the database.",
    toastStatusUpdated: "Change Saved",
    toastStatusUpdatedMsg: "The status has been successfully updated.",
    alertResolutionRequired: "Resolution description is required.",
    alertIncorrectPass: "Incorrect password.",
    timeToday: "Today",
    timeYesterday: "Yesterday",
    timeDaysAgo: "{days} days ago",
    openDetails: "Open Details"
  },
  ko: {
    badge: "SVP 제어",
    title: "티켓",
    titleAccent: "관리",
    subtitle: "고급 추적, 감사 및 라이프사이클 흐름.",
    searchPlaceholder: "ID, 제목, 스쿼드 또는 담당자로 검색...",
    sortRecent: "최근순",
    sortOldest: "오래된순",
    filterAreaAll: "모든 영역",
    filterAreaTickets: "일반 티켓",
    filterAreaImprovements: "개선 사항",
    filterAreaProjects: "프로젝트",
    filterAreaAutomations: "자동화",
    filterStatusAll: "모든 상태",
    filterPriorityAll: "모든 우선순위",
    loadingBase: "데이터베이스 동기화 중...",
    noRecords: "기록을 찾을 수 없습니다",
    noRecordsSub: "필터 또는 검색어를 조정해 보십시오.",
    copySuccess: "클립보드에 복사되었습니다!",
    detailsTitle: "기술 사양",
    resolutionTitle: "최종 해결 발송",
    teamTitle: "할당된 팀",
    lifecycleTitle: "라이프사이클 제어",
    closePanel: "패널 닫기",
    copyData: "데이터 복사",
    dialogResolution: "해결",
    dialogResolutionMsg: "이 티켓을 완료하기 위해 수행된 작업을 간략하게 설명하십시오.",
    dialogResolutionPlaceholder: "완료 보고서...",
    dialogConfirmTitle: "변경 확인",
    dialogConfirmMsg: "정말로 상태를 다음으로 변경하시겠습니까:",
    dialogDeleteTitle: "보호된 삭제",
    dialogDeleteMsg: "이 기록을 영구적으로 삭제하려면 마스터 비밀번호를 입력하십시오.",
    dialogCancel: "취소",
    dialogConfirm: "확인",
    dialogBack: "뒤로",
    toastSaveSuccess: "저장 완료",
    toastSaveSuccessMsg: "상태 및 해결 방법이 데이터베이스에 저장되었습니다.",
    toastStatusUpdated: "변경 사항 저장됨",
    toastStatusUpdatedMsg: "상태가 성공적으로 업데이트되었습니다.",
    alertResolutionRequired: "해결 방법 설명은 필수입니다.",
    alertIncorrectPass: "잘못된 비밀번호입니다.",
    timeToday: "오늘",
    timeYesterday: "어제",
    timeDaysAgo: "{days}일 전",
    openDetails: "세부 정보 열기"
  }
};

function AcompanhamentoContent() {
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

  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtros & Visualização
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal de Detalhes
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dialog, setDialog] = useState<{ isOpen: boolean; title: string; message: string; type: 'alert' | 'password' | 'resolution'; onConfirm?: (val?: string) => void }>({ isOpen: false, title: '', message: '', type: 'alert' });
  const [inputValue, setInputValue] = useState('');

  const API_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8001` : '';

  const { toast } = useToast();

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tickets`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (error) {} finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    setMounted(true);
    fetchTickets();
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user_srmt');
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    }
  }, [fetchTickets]);

  // Resetar página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus, filterPriority, sortBy]);

  const filteredRecords = useMemo(() => {
    const allowedTypes = ['ticket', 'improvement', 'project'];
    let result = records.filter(r => allowedTypes.includes(r.type));
    
    if (searchTerm) result = result.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.creators.some((c: any) => c.name.toLowerCase().includes(searchTerm.toLowerCase())));
    if (filterType !== 'all') result = result.filter(r => r.type === filterType);
    if (filterStatus !== 'all') result = result.filter(r => r.status === filterStatus);
    if (filterPriority !== 'all') result = result.filter(r => r.priority === filterPriority);
    
    return result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return 0;
    });
  }, [records, searchTerm, filterType, filterStatus, filterPriority, sortBy]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);

  const showAlert = (title: string, message: string, type: any = 'alert', onConfirm?: any) => {
    setInputValue('');
    setDialog({ isOpen: true, title, message, type, onConfirm });
  };

  const updateStatus = async (id: number, newStatus: string) => {
    if (newStatus === 'concluido') {
      showAlert(t.dialogResolution, t.dialogResolutionMsg, 'resolution', async (text: string) => {
        if (!text?.trim()) return alert(t.alertResolutionRequired);
        try {
          const res = await fetch(`${API_URL}/tickets/${id}/status`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ status: newStatus, resolution: text }) 
          });
          if (res.ok) {
            toast({
              title: t.toastSaveSuccess,
              description: t.toastSaveSuccessMsg,
            });
            fetchTickets();
            setDialog(prev => ({ ...prev, isOpen: false }));
            if (selectedRecord?.id === id) setSelectedRecord({ ...selectedRecord, status: newStatus, resolution: text });
          } else {
            const err = await res.json();
            throw new Error(err.detail || 'Erro ao salvar');
          }
        } catch (e: any) {
          toast({
            title: "Erro ao salvar",
            description: e.message || "Não foi possível atualizar o banco de dados.",
            variant: "destructive",
          });
        }
      });
    } else {
      // Pop-up de confirmação para outros status
      showAlert(t.dialogConfirmTitle, `${t.dialogConfirmMsg} ${newStatus.toUpperCase()}?`, 'alert', async () => {
        try {
          const res = await fetch(`${API_URL}/tickets/${id}/status`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ status: newStatus }) 
          });
          if (res.ok) {
            toast({
              title: t.toastStatusUpdated,
              description: t.toastStatusUpdatedMsg,
            });
            fetchTickets();
            setDialog(prev => ({ ...prev, isOpen: false }));
            if (selectedRecord?.id === id) setSelectedRecord({ ...selectedRecord, status: newStatus });
          } else {
            const err = await res.json();
            throw new Error(err.detail || 'Erro ao salvar');
          }
        } catch (e: any) {
          toast({
            title: "Erro ao salvar",
            description: e.message || "Não foi possível atualizar o banco de dados.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    showAlert(t.dialogDeleteTitle, t.dialogDeleteMsg, 'password', async (pass: string) => {
      if (pass === 'svp123') {
        try {
          const res = await fetch(`${API_URL}/tickets/${id}`, { method: 'DELETE' });
          if (res.ok) { fetchTickets(); setDialog(prev => ({ ...prev, isOpen: false })); }
        } catch (e) {}
      } else alert(t.alertIncorrectPass);
    });
  };

  const handleCopyTicket = async (r: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `*${r.type.toUpperCase()}* - ${r.title}\nPrioridade: ${r.priority}\nStatus: ${r.status}\nResponsável: ${r.creators[0]?.name}`;
    
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        alert(t.copySuccess);
      } else {
        throw new Error('Clipboard API indisponível');
      }
    } catch (err) {
      // Fallback seguro usando execCommand
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert(t.copySuccess);
      } catch (fallbackErr) {
        console.error('Falha no fallback de cópia', fallbackErr);
      }
      textArea.remove();
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendente': return { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500', glow: 'shadow-orange-500/20' };
      case 'aceito': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500', glow: 'shadow-emerald-500/20' };
      case 'rejeitado': return { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-500', glow: 'shadow-rose-500/20' };
      case 'concluido': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', glow: 'shadow-blue-500/20' };
      default: return { bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', text: 'text-zinc-500', glow: '' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgente': return 'bg-rose-500';
      case 'Alta': return 'bg-amber-500';
      case 'Média': return 'bg-blue-500';
      case 'Baixa': return 'bg-emerald-500';
      default: return 'bg-zinc-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ticket': return <TicketIcon className="w-3.5 h-3.5" />;
      case 'improvement': return <Lightbulb className="w-3.5 h-3.5" />;
      case 'project': return <FolderPlus className="w-3.5 h-3.5" />;
      case 'automation': return <Terminal className="w-3.5 h-3.5" />;
      default: return <Box className="w-3.5 h-3.5" />;
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return t.timeToday;
    if (days === 1) return t.timeYesterday;
    return t.timeDaysAgo.replace('{days}', days.toString());
  };

  const mainBgClass = isDarkMode ? "bg-[#050505] text-zinc-300" : "bg-[#f8f9fa] text-zinc-700";
  
  // PADRÃO LIQUID GLASS ALINHADO COM NAVBAR (MAIS OPACO)
  const liquidGlassClass = `relative overflow-hidden rounded-xl border transition-all duration-500 backdrop-blur-2xl 
    ${isDarkMode 
      ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10 hover:scale-[1.015]' 
      : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200 hover:scale-[1.015]'}`;

  if (!mounted) return null;

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 transition-colors duration-1000 ${mainBgClass} overflow-x-hidden pb-20`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />

      <div className="w-full max-w-7xl relative z-10 space-y-8 px-4">
        
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
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${lang === l.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'}`}
            >
              <span>{l.icon}</span> {l.label}
            </button>
          ))}
        </div>

        {/* CABEÇALHO UNIFICADO */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border-b border-zinc-200 dark:border-white/5 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> {t.badge}
            </div>
            <h1 className={`text-4xl lg:text-5xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{t.titleAccent}</span>
            </h1>
            <p className="text-sm font-bold opacity-50 max-w-sm">{t.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4 mt-4 md:mt-0">
            <TicketNavigation />
          </div>
        </header>

        {/* TOOLBAR AVANÇADA (PADRÃO LIQUID GLASS) */}
        <section className={`p-4 md:p-6 rounded-xl border backdrop-blur-2xl flex flex-col lg:flex-row gap-4 lg:gap-8 items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-700
          ${isDarkMode 
            ? 'bg-black/30 border-white/10 shadow-2xl shadow-black/40' 
            : 'bg-white/40 border-white/60 shadow-xl shadow-black/5'}`}>
          
          <div className="relative w-full lg:w-[400px] group">
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors z-10 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`} />
            <Input 
              placeholder={t.searchPlaceholder} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className={`w-full pl-12 h-12 rounded-xl border-none font-bold text-xs transition-all focus:ring-2 focus:ring-blue-500/20 ${isDarkMode ? 'bg-white/5 text-white placeholder:text-zinc-600' : 'bg-black/5 text-zinc-900 placeholder:text-zinc-500'}`} 
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}><ListIcon className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}><LayoutGrid className="w-4 h-4" /></button>
            </div>

            <div className={`w-px h-8 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />

            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={`h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10' : 'bg-black/5 border-black/10 text-zinc-700 hover:bg-black/10'}`}>
              <option value="all">{t.filterAreaAll}</option>
              <option value="ticket">{t.filterAreaTickets}</option>
              <option value="improvement">{t.filterAreaImprovements}</option>
              <option value="project">{t.filterAreaProjects}</option>
              <option value="automation">{t.filterAreaAutomations}</option>
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10' : 'bg-black/5 border-black/10 text-zinc-700 hover:bg-black/10'}`}>
              <option value="all">{t.filterStatusAll}</option>
              <option value="pendente">Pendente</option>
              <option value="aceito">Aceito</option>
              <option value="rejeitado">Rejeitado</option>
              <option value="concluido">Concluído</option>
            </select>
            
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className={`h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10' : 'bg-black/5 border-black/10 text-zinc-700 hover:bg-black/10'}`}>
              <option value="all">{t.filterPriorityAll}</option>
              <option value="Urgente">Urgente</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>

            <button onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')} className={`h-11 px-5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10' : 'bg-black/5 border-black/10 text-zinc-700 hover:bg-black/10'}`}>
              <ArrowDownUp className="w-4 h-4 opacity-50" /> {sortBy === 'newest' ? t.sortRecent : t.sortOldest}
            </button>
          </div>
        </section>

        {/* CONTEÚDO PRINCIPAL (LISTA/GRADE) COM PAGINAÇÃO */}
        <main className="animate-in fade-in slide-in-from-bottom-6 duration-1000 flex flex-col min-h-[500px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 opacity-50 flex-grow">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-xl animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">{t.loadingBase}</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-40 rounded-[3rem] border border-dashed flex-grow ${isDarkMode ? 'border-white/10 bg-white/[0.02]' : 'border-black/10 bg-black/[0.02]'}`}>
              <div className="w-20 h-20 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6"><Search className="w-8 h-8" /></div>
              <p className={`text-xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{t.noRecords}</p>
              <p className="text-xs font-bold opacity-40">{t.noRecordsSub}</p>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-grow" : "flex flex-col gap-4 flex-grow"}>
                {paginatedRecords.map((r) => {
                  const sStyle = getStatusStyle(r.status);
                  const pColor = getPriorityColor(r.priority);
                  
                  return (
                    <Card key={r.id} onClick={() => setSelectedRecord(r)} className={`${liquidGlassClass} cursor-pointer group flex flex-col p-0`}>
                      {/* Indicador de Prioridade no Topo */}
                      <div className={`h-1 w-full ${pColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
                      
                      <div className={`p-5 sm:p-6 flex-grow flex ${viewMode === 'grid' ? 'flex-col gap-5' : 'flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center'}`}>
                        
                        {/* Info Principal */}
                        <div className="flex-grow space-y-3 w-full">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black opacity-30 tracking-widest">#{r.id}</span>
                              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-black/5 border-black/10 text-zinc-600'}`}>
                                {getTypeIcon(r.type)} {r.type}
                              </div>
                              {r.type === 'automation' && r.content.match(/\[TIME: (.*?)\]/) && (
                                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-500/20 bg-blue-500/10 text-blue-500`}>
                                  {r.content.match(/\[TIME: (.*?)\]/)?.[1]}
                                </span>
                              )}
                            </div>
                            
                            {/* Ações Rápidas (Aparecem no Hover) */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-1 group-hover:translate-y-0">
                              <button onClick={(e) => handleCopyTicket(r, e)} className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'hover:bg-blue-500 text-zinc-400 hover:text-white' : 'hover:bg-blue-600 text-zinc-500 hover:text-white'}`} title="Copiar Resumo"><Copy className="w-3.5 h-3.5" /></button>
                              <button onClick={(e) => handleDelete(r.id, e)} className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'hover:bg-rose-500 text-zinc-400 hover:text-white' : 'hover:bg-rose-600 text-zinc-500 hover:text-white'}`} title="Excluir Definitivamente"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <h3 className={`text-base font-bold tracking-tight leading-snug group-hover:text-blue-500 transition-colors uppercase ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{r.title}</h3>
                            <p className="text-xs font-medium opacity-40 leading-relaxed whitespace-pre-wrap">
                              {r.content.replace(/\[TIME:.*?\] \[TIPO:.*?\]/, '').replace(/<[^>]+>/g, '').trim() || "Sem descrição adicional fornecida."}
                            </p>
                          </div>
                        </div>

                        {/* Meta & Ações (Direita no List / Baixo no Grid) */}
                        <div className={`flex flex-col gap-4 ${viewMode === 'list' ? 'md:w-64 md:border-l md:pl-6' : 'w-full pt-4 border-t'} ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
                          
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center -space-x-2">
                              {r.creators.slice(0, 3).map((c: any, i: number) => (
                                <div key={i} className={`w-7 h-7 rounded-xl flex items-center justify-center text-[8px] font-black text-white border-[1.5px] shadow-sm z-${30-i} ${isDarkMode ? 'border-[#111]' : 'border-white'} ${['bg-blue-500', 'bg-indigo-500', 'bg-purple-500'][i%3]}`} title={`${c.name} - ${c.team}`}>
                                  {c.name.charAt(0)}
                                </div>
                              ))}
                              {r.creators.length > 3 && (
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[8px] font-black border-[1.5px] z-0 ${isDarkMode ? 'bg-zinc-800 border-[#111] text-zinc-400' : 'bg-zinc-100 border-white text-zinc-500'}`}>
                                  +{r.creators.length - 3}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {['pendente', 'aceito', 'rejeitado', 'concluido'].map((s) => (
                                <button
                                  key={s}
                                  onClick={(e) => { e.stopPropagation(); updateStatus(r.id, s); }}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border
                                    ${r.status === s 
                                      ? (s === 'concluido' ? 'bg-blue-500 border-blue-400 text-white' : s === 'aceito' ? 'bg-emerald-500 border-emerald-400 text-white' : s === 'rejeitado' ? 'bg-rose-500 border-rose-400 text-white' : 'bg-orange-500 border-orange-400 text-white')
                                      : (isDarkMode ? 'bg-white/5 border-white/10 text-zinc-500 hover:text-white' : 'bg-black/5 border-black/10 text-zinc-400 hover:text-zinc-900')
                                    }`}
                                  title={`Mudar para ${s}`}
                                >
                                  {s === 'concluido' ? <CheckCircle2 className="w-3 h-3" /> : s === 'aceito' ? <CheckCircle className="w-3 h-3" /> : s === 'rejeitado' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[9px] font-bold opacity-40 uppercase tracking-widest">
                            <span>{timeAgo(r.created_at)}</span>
                            <span className="flex items-center gap-1 group-hover:text-blue-500 transition-colors">Abrir Detalhes <ChevronRight className="w-3 h-3" /></span>
                          </div>
                          
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* CONTROLES DE PAGINAÇÃO */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10 pt-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    className={`h-10 w-10 rounded-xl p-0 border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/10' : 'border-black/10 hover:bg-black/5'}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'}`}>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const p = idx + 1;
                      // Mostrar apenas páginas próximas ou extremidades (lógica simples)
                      if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                        return (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`w-7 h-7 rounded-xl text-[10px] font-black transition-all ${currentPage === p ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-500/20'}`}
                          >
                            {p}
                          </button>
                        );
                      }
                      if (p === currentPage - 2 || p === currentPage + 2) return <span key={p} className="text-zinc-500 text-xs px-1">...</span>;
                      return null;
                    })}
                  </div>

                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    className={`h-10 w-10 rounded-xl p-0 border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/10' : 'border-black/10 hover:bg-black/5'}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL DE DETALHES DE ALTA FIDELIDADE (MANTIDO E REFINADO) */}
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
                    Prio: {selectedRecord.priority}
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
                    {selectedRecord.creators.map((c: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-base font-black text-white shadow-md ${['bg-blue-500', 'bg-indigo-500', 'bg-purple-500'][i%3]}`}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{c.name}</p>
                          <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{c.team}</p>
                        </div>
                      </div>
                    ))}
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

      {/* DIÁLOGOS DE AÇÃO (PREMIUM) */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-[20px] transition-all duration-500 animate-in fade-in zoom-in-95">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))} />
          <Card className={`relative w-full max-w-lg rounded-[3rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] p-12 text-center space-y-8 ${isDarkMode ? 'bg-[#111] ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'}`}>
            <div className={`mx-auto w-20 h-20 rounded-xl flex items-center justify-center shadow-inner border 
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
              <Input type="password" placeholder="••••••••" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className={`h-14 text-center text-2xl tracking-[0.5em] font-black rounded-xl border-none shadow-inner focus:ring-2 focus:ring-rose-500/50 ${isDarkMode ? 'bg-black/40 text-white' : 'bg-zinc-100 text-zinc-900'}`} autoFocus />
            )}
            {dialog.type === 'resolution' && (
              <textarea placeholder="Relatório de conclusão..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className={`w-full min-h-[120px] p-5 text-xs font-bold rounded-xl border-none outline-none resize-none shadow-inner focus:ring-2 focus:ring-emerald-500/50 ${isDarkMode ? 'bg-black/40 text-white' : 'bg-zinc-100 text-zinc-900'}`} autoFocus />
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

export default function AcompanhamentoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase opacity-20 tracking-widest animate-pulse">Carregando Módulo de Gestão...</div>}>
      <AcompanhamentoContent />
    </Suspense>
  );
}
