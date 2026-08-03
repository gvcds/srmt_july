'use client';

import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
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
  History as HistoryIcon, 
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
  RefreshCw,
  User as UserIcon,
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { TicketNavigation } from "@/components/ticket-navigation";
import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/components/language-provider';
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

type Language = 'pt' | 'en' | 'ko';

const translations = {
  pt: {
    badge: "SVP Automação",
    title: "Hub de",
    titleAccent: "Scripts",
    subtitle: "Controle de versionamento, logs e solicitações técnicas.",
    actionTitle: "Registrar Ação",
    actionSubtitle: "Engenharia de Software & QA",
    typeError: "Erro",
    typeSuggestion: "Sugestão",
    typeRequest: "Pedido",
    historyBtn: "Histórico",
    fieldObjectName: "Identificação do Objeto",
    placeholderObjectName: "NOME_DO_SCRIPT_OU_TEST_CASE",
    fieldTechSpec: "Especificação Técnica",
    attachMedia: "Anexar Mídia",
    fieldSquad: "Squad Destino",
    syncNote: "Sincronização imediata com o dashboard analítico.",
    registerBtn: "Registrar no Hub",
    historyTitle: "Logs Hub",
    searchPlaceholder: "Localizar registro...",
    loadingHub: "Loading Hub...",
    alertFillFields: "Preencha nome e especificação.",
    toastSynced: "Sincronizado",
    toastSyncedMsg: "O log de automação foi registrado no hub central."
  },
  en: {
    badge: "SVP Automation",
    title: "Scripts",
    titleAccent: "Hub",
    subtitle: "Version control, logs, and technical requests.",
    actionTitle: "Register Action",
    actionSubtitle: "Software Engineering & QA",
    typeError: "Error",
    typeSuggestion: "Suggestion",
    typeRequest: "Request",
    historyBtn: "History",
    fieldObjectName: "Object Identification",
    placeholderObjectName: "SCRIPT_OR_TEST_CASE_NAME",
    fieldTechSpec: "Technical Specification",
    attachMedia: "Attach Media",
    fieldSquad: "Destination Squad",
    syncNote: "Immediate synchronization with the analytical dashboard.",
    registerBtn: "Register in Hub",
    historyTitle: "Logs Hub",
    searchPlaceholder: "Locate record...",
    loadingHub: "Loading Hub...",
    alertFillFields: "Fill in name and specification.",
    toastSynced: "Synchronized",
    toastSyncedMsg: "The automation log has been registered in the central hub."
  },
  ko: {
    badge: "SVP 자동화",
    title: "스크립트",
    titleAccent: "허브",
    subtitle: "버전 관리, 로그 및 기술 요청 제어.",
    actionTitle: "작업 등록",
    actionSubtitle: "소프트웨어 엔지니어링 및 QA",
    typeError: "오류",
    typeSuggestion: "제안",
    typeRequest: "요청",
    historyBtn: "히스토리",
    fieldObjectName: "객체 식별",
    placeholderObjectName: "스크립트_또는_테스트_케이스_이름",
    fieldTechSpec: "기술 사양",
    attachMedia: "미디어 첨부",
    fieldSquad: "대상 스쿼드",
    syncNote: "분석 대시보드와 즉시 동기화됩니다.",
    registerBtn: "허브에 등록",
    historyTitle: "로그 허브",
    searchPlaceholder: "기록 찾기...",
    loadingHub: "허브 로딩 중...",
    alertFillFields: "이름과 사양을 입력하십시오.",
    toastSynced: "동기화됨",
    toastSyncedMsg: "자동화 로그가 중앙 허브에 등록되었습니다."
  }
};

function AutomacoesContent() {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const { language: globalLang } = useLanguage();
  const lang = (globalLang === 'pt-BR' ? 'pt' : globalLang) as Language;
  const t = translations[lang];

  const [mounted, setMounted] = useState(false);
  const [scriptName, setScriptName] = useState('');
  const [explanation, setExplanation] = useState('');
  const [creators, setCreators] = useState<{name: string, team: string}[]>([{ name: '', team: '' }]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStyles, setActiveStyles] = useState({ bold: false, italic: false, ul: false, ol: false });
  const [editingImage, setEditingImage] = useState<HTMLImageElement | null>(null);

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertImage', false, dataUrl);
        setTimeout(() => {
          const imgs = editorRef.current?.getElementsByTagName('img');
          if (imgs && imgs.length > 0) {
            const lastImg = imgs[imgs.length - 1];
            lastImg.style.maxWidth = '100%';
            lastImg.style.borderRadius = '1rem';
            lastImg.style.marginTop = '1rem';
            lastImg.style.marginBottom = '1rem';
            lastImg.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            lastImg.style.display = 'block';
          }
          if (editorRef.current) setExplanation(editorRef.current.innerHTML);
        }, 50);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const [team, setTeam] = useState('Multimidia');
  const [type, setType] = useState<'erro' | 'sugestao' | 'solicitacao'>('erro');
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8001` : '';

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tickets`);
      if (res.ok) setRecords(await res.json());
    } catch (e) {}
  }, [API_URL]);

  useEffect(() => {
    setMounted(true);
    fetchTickets();
    if (API_URL) {
      fetch(`${API_URL}/users`).then(res => res.json()).then(data => setAllUsers(data)).catch(() => {});
    }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_srmt');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCreators([{ name: parsed.name, team: parsed.team || parsed.role || 'SVP Team' }]);
      }
    }
  }, [fetchTickets, API_URL]);

  const automations = useMemo(() => records.filter(r => r.type === 'automation'), [records]);

  const filteredAutomations = useMemo(() => {
    return automations.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [automations, searchTerm]);

  const execCommand = (cmd: string) => {
    document.execCommand(cmd, false);
    checkActiveStyles();
  };

  const checkActiveStyles = () => {
    setActiveStyles({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      ul: document.queryCommandState('insertUnorderedList'),
      ol: document.queryCommandState('insertOrderedList'),
    });
  };

  const handleSave = async () => {
    const contentToSave = editorRef.current?.innerHTML || explanation;
    if (!scriptName.trim() || !contentToSave.trim()) return alert(t.alertFillFields);
    
    setIsLoading(true);
    const payload = {
      type: 'automation',
      priority: 'Média',
      title: scriptName,
      content: `[TIME: ${team}] [TIPO: ${type.toUpperCase()}]\n\n${contentToSave}`,
      creators: creators.filter(c => c.name.trim())
    };

    try {
      const res = await fetch(`${API_URL}/tickets`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { 
        setScriptName(''); 
        if (editorRef.current) editorRef.current.innerHTML = '';
        fetchTickets(); 
        toast({ title: t.toastSynced, description: t.toastSyncedMsg });
      }
    } catch (e) {} finally { setIsLoading(false); }
  };

  const teams = ['Multimidia', 'Wearables', 'Sanity', 'Apps1', 'Apps2', 'PhoneSettings'];

  const mainBgClass = isDarkMode ? "bg-[#050505] text-zinc-300" : "bg-[#f5f5f7] text-zinc-800";
  const cardClass = `relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`;
  const inputStyle = `rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-white/10 border-white/20 text-white focus:bg-white/15 focus:ring-2 focus:ring-blue-500/30' : 'bg-white border-zinc-200 text-zinc-900 focus:bg-zinc-50 focus:ring-2 focus:ring-blue-500/10'}`;

  if (!mounted) return null;

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-10 transition-colors duration-1000 ${mainBgClass} overflow-x-hidden pb-20`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />

      <div className="w-full max-w-7xl relative z-10 space-y-12 px-4 pt-10">
        
        {/* Header Padrão */}
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

        <main className="w-full">
          {/* PAINEL DE CONTROLE LIQUID GLASS */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className={`${cardClass} p-8 md:p-12 border-none shadow-2xl flex flex-col gap-10`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-black/5 dark:border-white/5 pb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                    <Activity className="w-6 h-6 text-blue-500" /> {t.actionTitle}
                  </h2>
                  <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">{t.actionSubtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className={`flex p-1 rounded-full border backdrop-blur-xl ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    {['erro', 'sugestao', 'solicitacao'].map((typeKey) => (
                      <button key={typeKey} onClick={() => setType(typeKey as any)} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${type === typeKey ? 'bg-blue-600 text-white shadow-xl' : 'opacity-40 hover:opacity-100'}`}>
                        {typeKey === 'erro' ? t.typeError : typeKey === 'sugestao' ? t.typeSuggestion : t.typeRequest}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setIsHistoryOpen(true)} className="h-12 px-6 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center gap-3 shadow-lg">
                    <HistoryIcon className="w-4 h-4" /> {t.historyBtn} <span className="bg-blue-500/20 px-2 py-0.5 rounded-lg text-current">{automations.length}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">{t.fieldObjectName}</Label>
                    <Input placeholder={t.placeholderObjectName} value={scriptName} onChange={e => setScriptName(e.target.value)} className={`${inputStyle} h-14 text-lg font-black px-6 tracking-tight uppercase`} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.fieldTechSpec}</Label>
                      <button onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black uppercase text-blue-500 hover:underline">{t.attachMedia}</button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileAttach} />
                    </div>
                    <div className={`rounded-[2rem] border overflow-hidden flex flex-col transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200 shadow-inner'}`}>
                      <div className={`flex items-center gap-3 p-4 border-b border-black/5 dark:border-white/5 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => execCommand('bold')} className={`h-9 w-9 p-0 rounded-xl ${activeStyles.bold ? 'bg-blue-600 text-white' : ''}`}><Bold className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => execCommand('italic')} className={`h-9 w-9 p-0 rounded-xl ${activeStyles.italic ? 'bg-blue-600 text-white' : ''}`}><Italic className="w-4 h-4" /></Button>
                        </div>
                        <div className="w-px h-4 bg-white/10 mx-2" />
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => execCommand('insertUnorderedList')} className={`h-9 w-9 p-0 rounded-xl ${activeStyles.ul ? 'bg-blue-600 text-white' : ''}`}><List className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => execCommand('insertOrderedList')} className={`h-9 w-9 p-0 rounded-xl ${activeStyles.ol ? 'bg-blue-600 text-white' : ''}`}><ListOrdered className="w-4 h-4" /></Button>
                        </div>
                      </div>
                      <div ref={editorRef} contentEditable onInput={e => setExplanation(e.currentTarget.innerHTML)} className={`min-h-[350px] p-8 outline-none text-sm font-medium prose-content ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`} />
                    </div>
                  </div>

                  {/* SEÇÃO DE RESPONSÁVEIS */}
                  <div className="space-y-6 pt-10 border-t border-black/5 dark:border-white/5">
                    <div className="flex justify-between items-center px-1">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Equipe de Responsáveis</Label>
                        <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Liste os integrantes envolvidos</p>
                      </div>
                      <button onClick={() => setCreators([...creators, { name: '', team: '' }])} className="h-9 px-5 rounded-xl bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
                        <Plus className="w-3 h-3" /> Adicionar
                      </button>
                    </div>
                    
                    <div className="flex flex-col">
                      {creators.map((c, i) => (
                        <div key={i} className={`flex flex-col md:flex-row items-end gap-4 py-6 border-b border-black/5 dark:border-white/5 group animate-in slide-in-from-left-4 duration-300`}>
                          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="space-y-1.5 relative">
                              <Label className="text-[8px] font-black uppercase opacity-30 ml-1">Nome Completo</Label>
                              <Input 
                                placeholder="Nome do integrante..." 
                                value={c.name} 
                                onChange={e => { const n = [...creators]; n[i].name = e.target.value; setCreators(n); setActiveDropdown(i); }} 
                                onFocus={() => setActiveDropdown(i)}
                                onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                                className={`h-11 px-4 border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'} font-black uppercase text-[10px] focus:ring-2 focus:ring-blue-500/30 rounded-xl`} 
                              />
                              {activeDropdown === i && (
                                <div className={`absolute z-50 w-full mt-1 border rounded-xl shadow-2xl max-h-48 overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-black/10'}`}>
                                  {allUsers.filter(u => u.name.toLowerCase().includes(c.name.toLowerCase())).length === 0 ? (
                                    <div className="p-3 text-[10px] opacity-40 font-bold">Nenhum usuário encontrado</div>
                                  ) : (
                                    allUsers.filter(u => u.name.toLowerCase().includes(c.name.toLowerCase())).map(u => (
                                      <div 
                                        key={u.id} 
                                        className={`p-3 cursor-pointer flex items-center gap-2 transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                                        onClick={() => {
                                          const n = [...creators];
                                          n[i].name = u.name;
                                          n[i].team = u.cell || u.area || u.team || u.role || '';
                                          setCreators(n);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        {u.avatar ? <img src={u.avatar} className="w-5 h-5 rounded-full object-cover" /> : <UserIcon className="w-4 h-4 opacity-40" />}
                                        <span className="text-[10px] font-black">{u.name}</span>
                                        <span className="text-[8px] font-bold opacity-40 ml-auto uppercase">{u.cell || u.area || u.team || u.role}</span>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[8px] font-black uppercase opacity-30 ml-1">Time / Squad</Label>
                              <Input placeholder="Time ou Cargo..." value={c.team} onChange={e => { const n = [...creators]; n[i].team = e.target.value; setCreators(n); }} className={`h-11 px-4 border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'} text-[9px] font-bold opacity-60 focus:ring-2 focus:ring-blue-500/30 uppercase tracking-widest rounded-xl`} />
                            </div>
                          </div>
                          <button onClick={() => setCreators(creators.filter((_, idx) => idx !== i))} className="h-11 w-11 flex items-center justify-center rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all opacity-40 hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">{t.fieldSquad}</Label>
                    <select value={team} onChange={e => setTeam(e.target.value)} className={`${inputStyle} w-full h-14 px-6 text-xs font-black uppercase tracking-widest appearance-none bg-transparent outline-none cursor-pointer`}>
                      {teams.map(t => <option key={t} value={t} className="bg-zinc-900 text-white">{t}</option>)}
                    </select>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 flex flex-col items-center text-center gap-4">
                    <Zap className="w-10 h-10 text-blue-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.syncNote}</p>
                  </div>

                  <Button onClick={handleSave} disabled={isLoading} className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                    {isLoading ? <RefreshCw className="animate-spin w-5 h-5" /> : <><Save className="w-4 h-4 mr-3" /> {t.registerBtn}</>}
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>

      {/* GAVETA HISTÓRICO PREMIUM */}
      <aside className={`fixed inset-y-0 right-0 w-full sm:w-[500px] z-[160] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isHistoryOpen ? 'opacity-100' : 'opacity-0'} bg-black/60 backdrop-blur-sm`} onClick={() => setIsHistoryOpen(false)} />
        <Card className={`relative h-full border-none flex flex-col overflow-hidden backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-l-[3.5rem] ${isDarkMode ? 'bg-zinc-950/95 border-l border-white/5' : 'bg-white/95 border-l border-black/5'}`}>
          <div className="p-10 border-b relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20"><HistoryIcon className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{t.historyTitle}</h3>
                </div>
                <button onClick={() => setIsHistoryOpen(false)} className="h-10 w-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-all flex items-center justify-center"><X className="w-6 h-6" /></button>
              </div>
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                <Input placeholder={t.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full pl-12 h-12 text-sm rounded-full border-none font-bold ${isDarkMode ? 'bg-black/40 text-white' : 'bg-zinc-100 text-zinc-900 shadow-inner'}`} />
              </div>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {filteredAutomations.map(r => {
              const rType = r.content.includes('ERRO') ? 'erro' : r.content.includes('SUGESTAO') ? 'sugestao' : 'pedido';
              return (
                <Card key={r.id} className={`${cardClass} p-6 border-white/5 group cursor-default hover:border-blue-500/20`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[7px] font-black uppercase px-2.5 py-1 rounded-md border ${rType === 'erro' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5'}`}>{rType}</span>
                    <span className="text-[8px] font-black opacity-20">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-base font-black tracking-tight mb-1 group-hover:text-blue-500 transition-colors uppercase truncate">{r.title}</h4>
                  <p className="text-[11px] font-medium opacity-40 line-clamp-2">{r.content.replace(/\[TIME:.*?\] \[TIPO:.*?\]/, '').trim().replace(/<[^>]+>/g, '')}</p>
                </Card>
              );
            })}
          </div>
        </Card>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .prose-content * { color: inherit !important; }
        .editor-img { display: block; max-width: 100%; border-radius: 1.5rem; margin: 2rem 0; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
}

export default function AutomacoesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold uppercase opacity-20 tracking-widest">Loading Hub...</div>}>
      <AutomacoesContent />
    </Suspense>
  );
}