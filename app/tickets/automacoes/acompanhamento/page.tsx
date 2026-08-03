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

const ITEMS_PER_PAGE = 10;

type Language = 'pt' | 'en' | 'ko';

const translations = {
  pt: {
    badge: "Gestão de Scripts",
    title: "Logs de",
    titleAccent: "Automação",
    subtitle: "Auditoria, status e versionamento do hub técnico.",
    searchPlaceholder: "Localizar script ou responsável...",
    filterCategoryAll: "Todas Categorias",
    filterCategoryErrors: "Erros",
    filterCategorySuggestions: "Sugestões",
    filterCategoryRequests: "Pedidos",
    filterStatusAll: "Todos Status",
    sortRecent: "Recentes",
    sortOldest: "Antigos",
    tableHeaderDetails: "Especificação Técnica",
    tableHeaderResolution: "Relatório de Conclusão",
    copyData: "Copiar Dados",
    closePanel: "Fechar Painel",
    dialogResolutionTitle: "Relatório",
    dialogResolutionMsg: "O que foi executado nesta automação?",
    dialogConfirmTitle: "Confirmar",
    dialogConfirmMsg: "Mudar status para",
    dialogBack: "Voltar",
    dialogConfirm: "Confirmar",
    loadingText: "Processando Logs...",
    suspenseLoading: "Carregando Módulo de Gestão..."
  },
  en: {
    badge: "Script Management",
    title: "Automation",
    titleAccent: "Logs",
    subtitle: "Auditing, status, and versioning of the technical hub.",
    searchPlaceholder: "Locate script or responsible...",
    filterCategoryAll: "All Categories",
    filterCategoryErrors: "Errors",
    filterCategorySuggestions: "Suggestions",
    filterCategoryRequests: "Requests",
    filterStatusAll: "All Status",
    sortRecent: "Recent",
    sortOldest: "Oldest",
    tableHeaderDetails: "Technical Specification",
    tableHeaderResolution: "Completion Report",
    copyData: "Copy Data",
    closePanel: "Close Panel",
    dialogResolutionTitle: "Report",
    dialogResolutionMsg: "What was executed in this automation?",
    dialogConfirmTitle: "Confirm",
    dialogConfirmMsg: "Change status to",
    dialogBack: "Back",
    dialogConfirm: "Confirm",
    loadingText: "Processing Logs...",
    suspenseLoading: "Loading Management Module..."
  },
  ko: {
    badge: "스크립트 관리",
    title: "자동화",
    titleAccent: "로그",
    subtitle: "기술 허브의 감사, 상태 및 버전 관리.",
    searchPlaceholder: "스크립트 또는 담당자 찾기...",
    filterCategoryAll: "모든 카테고리",
    filterCategoryErrors: "오류",
    filterCategorySuggestions: "제안",
    filterCategoryRequests: "요청",
    filterStatusAll: "모든 상태",
    sortRecent: "최근순",
    sortOldest: "오래된순",
    tableHeaderDetails: "기술 사양",
    tableHeaderResolution: "완료 보고서",
    copyData: "데이터 복사",
    closePanel: "패널 닫기",
    dialogResolutionTitle: "보고서",
    dialogResolutionMsg: "이 자동화에서 무엇이 실행되었습니까?",
    dialogConfirmTitle: "확인",
    dialogConfirmMsg: "상태를 다음으로 변경하시겠습니까:",
    dialogBack: "뒤로",
    dialogConfirm: "확인",
    loadingText: "로그 처리 중...",
    suspenseLoading: "관리 모듈 로드 중..."
  }
};

function AcompanhamentoAutomacoesContent() {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dialog, setDialog] = useState<{ isOpen: boolean; title: string; message: string; type: 'alert' | 'password' | 'resolution'; onConfirm?: (val?: string) => void }>({ isOpen: false, title: '', message: '', type: 'alert' });
  const [inputValue, setInputValue] = useState('');

  const API_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8001` : '';

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tickets`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.filter((r: any) => r.type === 'automation'));
      }
    } catch (error) {} finally { setIsLoading(false); }
  }, [API_URL]);

  useEffect(() => {
    setMounted(true);
    fetchTickets();
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_srmt');
      if (stored) setCurrentUser(JSON.parse(stored));
    }
  }, [fetchTickets]);

  const filteredRecords = useMemo(() => {
    let result = records;
    if (searchTerm) result = result.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterType !== 'all') result = result.filter(r => r.content.toUpperCase().includes(`[TIPO: ${filterType.toUpperCase()}]`));
    if (filterStatus !== 'all') result = result.filter(r => r.status === filterStatus);
    
    return result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [records, searchTerm, filterType, filterStatus, sortBy]);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);

  const showAlert = (title: string, message: string, type: any = 'alert', onConfirm?: any) => {
    setInputValue('');
    setDialog({ isOpen: true, title, message, type, onConfirm });
  };

  const updateStatus = async (id: number, newStatus: string) => {
    const action = async (text?: string) => {
      try {
        const res = await fetch(`${API_URL}/tickets/${id}/status`, { 
          method: 'PATCH', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ status: newStatus, resolution: text }) 
        });
        if (res.ok) {
          toast({ title: "Sucesso", description: "Status atualizado com sucesso." });
          fetchTickets();
          setDialog(prev => ({ ...prev, isOpen: false }));
          if (selectedRecord?.id === id) setSelectedRecord({ ...selectedRecord, status: newStatus, resolution: text });
        }
      } catch (e) {}
    };

    if (newStatus === 'concluido') showAlert(t.dialogResolutionTitle, t.dialogResolutionMsg, 'resolution', action);
    else showAlert(t.dialogConfirmTitle, `${t.dialogConfirmMsg} ${newStatus.toUpperCase()}?`, 'confirm', action);
  };

  const mainBgClass = isDarkMode ? "bg-[#050505] text-zinc-300" : "bg-[#f5f5f7] text-zinc-800";
  const cardClass = `relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`;

  const getStatusColor = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'pendente': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'aceito': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejeitado': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'concluido': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  if (!mounted) return null;

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

        {/* Header Unificado */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 border-b border-black/5 dark:border-white/5 pb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Terminal className="w-3.5 h-3.5" /> {t.badge}
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

        {/* Toolbar Liquid Glass */}
        <section className={`${cardClass} p-6 flex flex-col lg:flex-row gap-6 items-center justify-between shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700`}>
          <div className="relative w-full lg:w-[450px] group">
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-blue-500 transition-colors`} />
            <Input placeholder={t.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 h-12 rounded-full border-none font-black text-xs bg-black/5 dark:bg-white/5 shadow-inner" />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="h-11 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border border-transparent bg-black/5 dark:bg-white/5 cursor-pointer hover:bg-black/10 transition-all">
              <option value="all">{t.filterCategoryAll}</option>
              <option value="erro">{t.filterCategoryErrors}</option>
              <option value="sugestao">{t.filterCategorySuggestions}</option>
              <option value="solicitacao">{t.filterCategoryRequests}</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-11 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border border-transparent bg-black/5 dark:bg-white/5 cursor-pointer hover:bg-black/10 transition-all">
              <option value="all">{t.filterStatusAll}</option>
              <option value="pendente">Pendente</option>
              <option value="aceito">Aceito</option>
              <option value="rejeitado">Rejeitado</option>
              <option value="concluido">Concluído</option>
            </select>
            <button onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')} className="h-11 px-6 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-transparent bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-all">
              <ArrowDownUp className="w-4 h-4 opacity-40" /> {sortBy === 'newest' ? t.sortRecent : t.sortOldest}
            </button>
          </div>
        </section>

        {/* Listagem Premium */}
        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {paginatedRecords.map(r => (
            <Card key={r.id} onClick={() => setSelectedRecord(r)} className={`${cardClass} p-8 flex flex-col gap-6 hover:scale-[1.03] group shadow-2xl border-none`}>
              <div className="flex justify-between items-start">
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusColor(r.status)}`}>{r.status}</span>
                <div className="flex items-center gap-2 text-[10px] font-black opacity-20 group-hover:opacity-100 transition-opacity"><Clock className="w-3 h-3" /> {new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              <div className="space-y-2 flex-grow">
                <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-blue-500 transition-colors truncate">{r.title}</h3>
                <p className="text-xs font-medium opacity-40 line-clamp-3 leading-relaxed whitespace-pre-wrap">{r.content.replace(/\[TIME:.*?\] \[TIPO:.*?\]/, '').replace(/<[^>]+>/g, '').trim()}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-lg">{r.creators[0]?.name.charAt(0)}</div>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{r.creators[0]?.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-20 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
              </div>
            </Card>
          ))}
        </main>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-10">
            <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase opacity-40 hover:opacity-100">{lang === 'pt' ? 'Anterior' : lang === 'en' ? 'Previous' : '이전'}</Button>
            <div className="flex gap-2 p-1.5 rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 rounded-full text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-xl' : 'opacity-40 hover:opacity-100'}`}>{i + 1}</button>
              ))}
            </div>
            <Button variant="ghost" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase opacity-40 hover:opacity-100">{lang === 'pt' ? 'Próxima' : lang === 'en' ? 'Next' : '다음'}</Button>
          </div>
        )}
      </div>

      {/* Modal de Detalhes Premium */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl transition-all duration-700 animate-in fade-in scale-95">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedRecord(null)} />
          <Card className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col z-10 border-none shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[3rem] ${isDarkMode ? 'bg-[#0a0a0a]/95 text-white ring-1 ring-white/10' : 'bg-white/95 text-gray-900 ring-1 ring-black/5'}`}>
            <div className="p-10 border-b flex justify-between items-start relative z-10 bg-black/5 dark:bg-white/5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${getStatusColor(selectedRecord.status)}`}>{selectedRecord.status}</span>
                  <span className="text-[9px] font-black opacity-30 uppercase tracking-widest flex items-center gap-2"><Clock className="w-3 h-3" /> {new Date(selectedRecord.created_at).toLocaleString()}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">{selectedRecord.title}</h2>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="h-12 w-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-grow overflow-y-auto p-10 custom-scrollbar space-y-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">{t.tableHeaderDetails}</h3>
                <div className={`p-8 rounded-[2.5rem] border shadow-inner text-base font-medium leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'bg-black/40 border-white/5 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`} dangerouslySetInnerHTML={{ __html: selectedRecord.content }} />
              </div>
              {selectedRecord.resolution && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">{t.tableHeaderResolution}</h3>
                  <div className={`p-8 rounded-[2.5rem] border shadow-lg ${isDarkMode ? 'bg-emerald-900/10 border-emerald-500/20 text-emerald-100' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}><p className="text-lg font-bold leading-relaxed whitespace-pre-wrap">{selectedRecord.resolution}</p></div>
                </div>
              )}
            </div>
            <div className="p-8 border-t flex flex-col sm:flex-row justify-between items-center gap-6 bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-xl">{selectedRecord.creators[0]?.name.charAt(0)}</div>
                <div><p className="text-xs font-black uppercase tracking-tight">{selectedRecord.creators[0]?.name}</p><p className="text-[9px] font-bold opacity-30 uppercase">{selectedRecord.creators[0]?.team}</p></div>
              </div>
              <div className="flex gap-3">
                {['pendente', 'aceito', 'rejeitado', 'concluido'].map(s => (
                  <button key={s} onClick={() => updateStatus(selectedRecord.id, s)} className={`px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${selectedRecord.status === s ? getStatusColor(s) + ' scale-105 shadow-md border-current' : 'opacity-30 hover:opacity-100 border-transparent'}`}>{s}</button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Diálogos Premium */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-2xl animate-in fade-in">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))} />
          <Card className={`relative w-full max-w-md rounded-[3rem] border-none shadow-2xl p-12 text-center space-y-8 ${isDarkMode ? 'bg-[#111]' : 'bg-white'}`}>
            <div className={`mx-auto w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-inner border bg-blue-500/10 text-blue-500`}><AlertCircle className="w-8 h-8" /></div>
            <div className="space-y-3"><h3 className="text-2xl font-black tracking-tighter leading-none">{dialog.title}</h3><p className="text-xs font-bold opacity-40">{dialog.message}</p></div>
            {dialog.type === 'resolution' && <textarea value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-full min-h-[120px] p-5 text-sm font-bold rounded-[1.5rem] border-none bg-black/5 dark:bg-white/5 outline-none resize-none shadow-inner" autoFocus />}
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))} className="flex-1 h-12 rounded-2xl font-black text-[9px] uppercase opacity-40">{t.dialogBack}</Button>
              <Button onClick={() => dialog.onConfirm?.(inputValue)} className="flex-1 h-12 rounded-2xl font-black text-[9px] uppercase bg-blue-600 text-white shadow-xl shadow-blue-500/20">{t.dialogConfirm}</Button>
            </div>
          </Card>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .prose-content * { color: inherit !important; }
      `}</style>
    </div>
  );
}

export default function AcompanhamentoAutomacoesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase opacity-20 tracking-widest animate-pulse">Sincronizando Base de Dados...</div>}>
      <AcompanhamentoAutomacoesContent />
    </Suspense>
  );
}
