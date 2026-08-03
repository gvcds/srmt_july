'use client';

import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Trash2, 
  Pencil,
  Save, 
  Search, 
  Ticket as TicketIcon, 
  Lightbulb, 
  FolderPlus,
  Users,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  ChevronRight,
  X,
  User as UserIcon,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  SlidersHorizontal,
  ArrowDownUp,
  Copy,
  Clock,
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
  Zap,
  Code2,
  Activity,
  AlertCircle,
  History as HistoryIcon
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

type RecordType = 'ticket' | 'improvement' | 'project';

interface Creator {
  name: string;
  team: string;
}

interface TicketRecord {
  id: number;
  type: RecordType;
  priority: string;
  status: string;
  title: string;
  content: string;
  creators: Creator[];
  created_at: string;
  resolution?: string;
}

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
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-xl blur-[150px] opacity-20 animate-pulse 
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
    badge: "Central de Qualidade",
    title: "Gestão de",
    titleAccent: "Ocorrências",
    subtitle: "Registre melhorias, projetos ou issues técnicas com design premium.",
    formNew: "Novo",
    formEdit: "Editar Registro",
    formDocumentation: "Fluxo de documentação técnica SVP",
    formCancel: "Cancelar",
    formTitleLabel: "Título do Ticket",
    formTitlePlaceholder: "Título descritivo...",
    formTechDetailLabel: "Detalhamento Técnico",
    formAttachMedia: "Anexar Mídia",
    formTeamLabel: "Equipe de Responsáveis",
    formTeamSub: "Liste os integrantes envolvidos",
    formAddMember: "Adicionar",
    formFullName: "Nome Completo",
    formFullNamePlaceholder: "Nome do integrante...",
    formSquadLabel: "Time / Squad",
    formSquadPlaceholder: "Time ou Cargo...",
    formPriorityLabel: "Prioridade",
    formAuditNote: "O registro será auditado e sincronizado com a base central SVP.",
    formSave: "Salvar Alterações",
    formPublish: "Publicar Registro",
    dialogSecurity: "Segurança",
    dialogPasswordMsg: "Insira a senha mestra para excluir este registro.",
    dialogIncorrectPass: "Senha incorreta.",
    dialogBack: "Voltar",
    dialogConfirm: "Confirmar",
    loadingText: "Iniciando Tickets...",
    toastUpdated: "Registro Atualizado",
    toastPublished: "Ticket Publicado",
    toastSuccessMsg: "As informações foram salvas com sucesso no banco de dados.",
    toastRemoved: "Removido",
    toastRemovedMsg: "O registro foi excluído permanentemente.",
    alertFillFields: "Preencha título e descrição."
  },
  en: {
    badge: "Quality Center",
    title: "Issue",
    titleAccent: "Management",
    subtitle: "Register improvements, projects, or technical issues with premium design.",
    formNew: "New",
    formEdit: "Edit Record",
    formDocumentation: "SVP technical documentation flow",
    formCancel: "Cancel",
    formTitleLabel: "Ticket Title",
    formTitlePlaceholder: "Descriptive title...",
    formTechDetailLabel: "Technical Detailing",
    formAttachMedia: "Attach Media",
    formTeamLabel: "Team of Responsibles",
    formTeamSub: "List the members involved",
    formAddMember: "Add",
    formFullName: "Full Name",
    formFullNamePlaceholder: "Member name...",
    formSquadLabel: "Team / Squad",
    formSquadPlaceholder: "Team or Role...",
    formPriorityLabel: "Priority",
    formAuditNote: "The record will be audited and synchronized with the SVP central base.",
    formSave: "Save Changes",
    formPublish: "Publish Record",
    dialogSecurity: "Security",
    dialogPasswordMsg: "Enter the master password to delete this record.",
    dialogIncorrectPass: "Incorrect password.",
    dialogBack: "Back",
    dialogConfirm: "Confirm",
    loadingText: "Starting Tickets...",
    toastUpdated: "Record Updated",
    toastPublished: "Ticket Published",
    toastSuccessMsg: "Information has been successfully saved to the database.",
    toastRemoved: "Removed",
    toastRemovedMsg: "The record has been permanently deleted.",
    alertFillFields: "Fill in title and description."
  },
  ko: {
    badge: "품질 센터",
    title: "오류",
    titleAccent: "관리",
    subtitle: "프리미엄 디자인으로 개선 사항, 프로젝트 또는 기술 문제를 등록하십시오.",
    formNew: "새",
    formEdit: "기록 편집",
    formDocumentation: "SVP 기술 문서 흐름",
    formCancel: "취소",
    formTitleLabel: "티켓 제목",
    formTitlePlaceholder: "설명 제목...",
    formTechDetailLabel: "기술 세부 사항",
    formAttachMedia: "미디어 첨부",
    formTeamLabel: "책임 팀",
    formTeamSub: "참여 멤버 목록",
    formAddMember: "추가",
    formFullName: "성명",
    formFullNamePlaceholder: "멤버 이름...",
    formSquadLabel: "팀 / 스쿼드",
    formSquadPlaceholder: "팀 또는 역할...",
    formPriorityLabel: "우선순위",
    formAuditNote: "기록은 감사되며 SVP 중앙 데이터베이스와 동기화됩니다.",
    formSave: "변경 사항 저장",
    formPublish: "기록 게시",
    dialogSecurity: "보안",
    dialogPasswordMsg: "이 기록을 삭제하려면 마스터 비밀번호를 입력하십시오.",
    dialogIncorrectPass: "잘못된 비밀번호입니다.",
    dialogBack: "뒤로",
    dialogConfirm: "확인",
    loadingText: "티켓 시작 중...",
    toastUpdated: "기록 업데이트됨",
    toastPublished: "티켓 게시됨",
    toastSuccessMsg: "정보가 데이터베이스에 성공적으로 저장되었습니다.",
    toastRemoved: "제거됨",
    toastRemovedMsg: "기록이 영구적으로 삭제되었습니다.",
    alertFillFields: "제목과 설명을 입력하십시오."
  }
};

function TicketsContent() {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const { language: globalLang } = useLanguage();
  
  // Sincronizar idioma global com o formato local
  const lang = (globalLang === 'pt-BR' ? 'pt' : globalLang) as Language;
  const t = translations[lang];

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<RecordType>('ticket');
  const [priority, setPriority] = useState('Média');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [creators, setCreators] = useState<Creator[]>([{ name: '', team: '' }]);
  const [records, setRecords] = useState<TicketRecord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dialog, setDialog] = useState<{ isOpen: boolean; title: string; message: string; type: 'alert' | 'confirm' | 'password' | 'resolution'; onConfirm?: (val?: string) => void }>({ isOpen: false, title: '', message: '', type: 'alert' });
  const [deletePassword, setDeletePassword] = useState('');
  const [resolutionText, setResolutionText] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStyles, setActiveStyles] = useState({ bold: false, italic: false, ul: false, ol: false });
  const [editingImage, setEditingImage] = useState<HTMLImageElement | null>(null);

  const API_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8001` : '';

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertImage', false, dataUrl);
        // Pequeno delay para garantir que a imagem foi inserida antes de aplicar o estilo
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
          // Atualiza o estado do conteúdo
          if (editorRef.current) setContent(editorRef.current.innerHTML);
        }, 50);
      }
    };
    reader.readAsDataURL(file);
    // Limpa o valor para permitir anexar a mesma imagem novamente se necessário
    e.target.value = '';
  };

  const fetchTickets = useCallback(async () => {
    if (!API_URL) return;
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
        setCurrentUser(parsed);
        setCreators([{ name: parsed.name, team: parsed.team || parsed.role || 'SVP Team' }]);
      }
    }
  }, [fetchTickets, API_URL]);

  const resetForm = () => {
    setEditingId(null); setTitle(''); setContent(''); setPriority('Média');
    if (editorRef.current) editorRef.current.innerHTML = '';
    if (currentUser) setCreators([{ name: currentUser.name, team: currentUser.team || currentUser.role || 'SVP Team' }]);
  };

  const handleSave = async () => {
    const finalContent = editorRef.current?.innerHTML || content;
    if (!title.trim() || !finalContent.trim()) return alert(t.alertFillFields);
    
    const url = editingId ? `${API_URL}/tickets/${editingId}` : `${API_URL}/tickets`;
    const payload = { type: activeTab, priority, title, content: finalContent, creators: creators.filter(c => c.name.trim()) };

    try {
      const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { 
        resetForm(); fetchTickets(); 
        toast({ title: editingId ? t.toastUpdated : t.toastPublished, description: t.toastSuccessMsg });
      }
    } catch (e) {}
  };

  const handleEdit = (record: TicketRecord) => {
    setEditingId(record.id); setActiveTab(record.type); setPriority(record.priority); setTitle(record.title); setContent(record.content); setCreators(record.creators);
    if (editorRef.current) editorRef.current.innerHTML = record.content;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    setDeletePassword('');
    setDialog({ isOpen: true, title: t.dialogSecurity, message: t.dialogPasswordMsg, type: 'password', onConfirm: async (pass) => {
      if (pass === 'svp123') {
        const res = await fetch(`${API_URL}/tickets/${id}`, { method: 'DELETE' });
        if (res.ok) { fetchTickets(); setDialog(prev => ({ ...prev, isOpen: false })); toast({ title: t.toastRemoved, description: t.toastRemovedMsg }); }
      } else { alert(t.dialogIncorrectPass); }
    }});
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.creators.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [records, searchTerm]);

  // --- EDITOR HELPERS ---
  const execCommand = (cmd: string) => { document.execCommand(cmd, false); checkActiveStyles(); };
  const checkActiveStyles = () => {
    setActiveStyles({ bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'), ul: document.queryCommandState('insertUnorderedList'), ol: document.queryCommandState('insertOrderedList') });
  };

  const mainBgClass = isDarkMode ? "bg-[#050505] text-zinc-300" : "bg-[#f5f5f7] text-zinc-800";
  const cardClass = `relative overflow-hidden rounded-xl border transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`;
  const inputStyle = `rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-white/10 border-white/20 text-white focus:bg-white/15 focus:ring-2 focus:ring-blue-500/30' : 'bg-white border-black/10 text-black focus:bg-white focus:ring-2 focus:ring-blue-500/10'}`;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendente': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'aceito': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejeitado': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'concluido': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-10 transition-colors duration-1000 ${mainBgClass} overflow-x-hidden pb-20`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />

      <div className="w-full max-w-7xl relative z-10 space-y-12 px-4 pt-10">

        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 border-b border-black/5 dark:border-white/5 pb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3" /> {t.badge}
            </div>
            <h1 className={`text-4xl md:text-6xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{t.titleAccent}</span>
            </h1>
            <p className="text-base font-bold opacity-40 max-w-md">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <TicketNavigation activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); resetForm(); }} />
          </div>
        </header>

        <main className="space-y-12">
          {/* FORMULÁRIO LIQUID GLASS */}
          <Card className={`${cardClass} p-8 md:p-12 border-none shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700`}>
            <div className="flex flex-col gap-10">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                    {editingId ? <Pencil className="w-6 h-6 text-orange-500" /> : <Plus className="w-6 h-6 text-blue-500" />}
                    {editingId ? t.formEdit : `${t.formNew} ${activeTab}`}
                  </h2>
                  <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">{t.formDocumentation}</p>
                </div>
                {editingId && <Button variant="ghost" onClick={resetForm} className="h-10 px-6 rounded-xl text-[10px] font-black uppercase bg-black/5 dark:bg-white/5">{t.formCancel}</Button>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">{t.formTitleLabel}</Label>
                    <Input placeholder={t.formTitlePlaceholder} value={title} onChange={e => setTitle(e.target.value)} className={`${inputStyle} h-14 text-lg font-black px-6`} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.formTechDetailLabel}</Label>
                      <button onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black uppercase text-blue-500 hover:underline">{t.formAttachMedia}</button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileAttach} />
                    </div>
                    <div className={`rounded-xl border overflow-hidden flex flex-col transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-inner'}`}>
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
                      <div ref={editorRef} contentEditable onInput={e => setContent(e.currentTarget.innerHTML)} className={`min-h-[300px] p-8 outline-none text-base font-medium prose-content ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`} />
                    </div>
                  </div>

                  {/* SEÇÃO DE RESPONSÁVEIS REESTRUTURADA EM LINHAS */}
                  <div className="space-y-6 pt-10 border-t border-black/5 dark:border-white/5">
                    <div className="flex justify-between items-center px-1">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {t.formTeamLabel}</Label>
                        <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{t.formTeamSub}</p>
                      </div>
                      <button onClick={() => setCreators([...creators, { name: '', team: '' }])} className="h-9 px-5 rounded-xl bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
                        <Plus className="w-3 h-3" /> {t.formAddMember}
                      </button>
                    </div>
                    
                    <div className="flex flex-col">
                      {creators.map((c, i) => (
                        <div key={i} className={`flex flex-col md:flex-row items-end gap-4 py-6 border-b border-black/5 dark:border-white/5 group animate-in slide-in-from-left-4 duration-300`}>
                          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="space-y-1.5 relative">
                              <Label className="text-[8px] font-black uppercase opacity-30 ml-1">{t.formFullName}</Label>
                              <Input 
                                placeholder={t.formFullNamePlaceholder} 
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
                              <Label className="text-[8px] font-black uppercase opacity-30 ml-1">{t.formSquadLabel}</Label>
                              <Input placeholder={t.formSquadPlaceholder} value={c.team} onChange={e => { const n = [...creators]; n[i].team = e.target.value; setCreators(n); }} className={`h-11 px-4 border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'} text-[9px] font-bold opacity-60 focus:ring-2 focus:ring-blue-500/30 uppercase tracking-widest rounded-xl`} />
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
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.formPriorityLabel}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Baixa', 'Média', 'Alta', 'Urgente'].map(p => (
                        <button key={p} onClick={() => setPriority(p)} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${priority === p ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-[1.05]' : 'bg-black/10 dark:bg-white/5 border-transparent opacity-40 hover:opacity-100'}`}>{p}</button>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-xl bg-blue-500/5 border border-blue-500/10 flex flex-col items-center text-center gap-4">
                    <ShieldCheck className="w-10 h-10 text-blue-500 opacity-40" />
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{t.formAuditNote}</p>
                  </div>

                  <Button onClick={handleSave} className="w-full h-16 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                    <Save className="w-4 h-4 mr-3" /> {editingId ? t.formSave : t.formPublish}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>

      {/* Diálogos Premium */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))} />
          <Card className={`relative w-full max-w-sm rounded-xl border-none shadow-2xl p-10 text-center space-y-6 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <div className={`mx-auto w-20 h-24 rounded-[1.5rem] flex items-center justify-center shadow-inner border bg-blue-500/10 text-blue-500`}><AlertCircle className="w-8 h-8" /></div>
            <div className="space-y-2"><h3 className="text-2xl font-black tracking-tighter leading-none">{dialog.title}</h3><p className="text-xs font-medium opacity-50 px-4">{dialog.message}</p></div>
            {dialog.type === 'password' && <Input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} className="h-14 text-center text-2xl tracking-[0.5em] font-black rounded-xl bg-black/5" autoFocus />}
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))} className="flex-1 h-12 rounded-xl font-black text-[9px] uppercase opacity-40">Voltar</Button>
              <Button onClick={() => dialog.onConfirm?.(deletePassword)} className="flex-1 h-12 rounded-xl font-black text-[9px] uppercase bg-blue-600 text-white shadow-xl">Confirmar</Button>
            </div>
          </Card>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128, 128, 128, 0.2); border-radius: 10px; }
        .prose-content * { color: inherit !important; }
      `}</style>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase opacity-20 tracking-widest animate-pulse">Sincronizando Base de Dados...</div>}>
      <TicketsContent />
    </Suspense>
  );
}