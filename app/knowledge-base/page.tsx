'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Database, 
  Save, 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Brain,
  Sparkles,
  Filter,
  X,
  StopCircle,
  Eye,
  ChevronDown,
  ChevronRight,
  User,
  Beaker,
  Mail,
  Smartphone,
  Signal,
  Box,
  Monitor,
  MessageSquare
} from 'lucide-react';
import { Navbar } from "@/components/navbar";
import { useTheme } from '@/components/theme-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';

interface GlossaryItem {
  id?: string;
  english: string;
  translation: string;
  description: string;
  dnt: string;
  app_name: string;
}

interface TextSection {
  id: string;
  title: string;
  content: string;
  isExpanded?: boolean;
}

const getBaseInputStyle = (isDark: boolean) => 
    `w-full p-3 text-sm transition-all duration-300 rounded-xl outline-none backdrop-blur-md shadow-sm
    ${isDark 
        ? 'bg-black/40 border border-white/10 text-gray-100 placeholder-gray-500 focus:bg-black focus:ring-2 focus:ring-blue-500/20' 
        : 'bg-white/60 border border-white/50 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10'
    }`;

const getSectionStyle = (isDark: boolean) =>
    `mb-8 p-6 rounded-[2.5rem] transition-all duration-500 relative backdrop-blur-3xl border
    ${isDark 
        ? 'bg-black/30 border-white/10 shadow-2xl shadow-black/40' 
        : 'bg-white/40 border-white/60 shadow-xl shadow-black/5'
    }`;

const KnowledgeBaseManager = ({ isDarkMode, API_URL }: any) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [newValue, setNewValue] = useState('');
  const [newField, setNewField] = useState('testerId');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const sections = [
    { id: 'testerId', label: 'Testador', icon: <User className="w-4 h-4" />, color: 'blue' },
    { id: 'sampleId', label: 'Sample ID', icon: <Beaker className="w-4 h-4" />, color: 'indigo' },
    { id: 'account', label: 'Google', icon: <Mail className="w-4 h-4" />, color: 'emerald' },
    { id: 'samsungAccount', label: 'Samsung', icon: <Smartphone className="w-4 h-4" />, color: 'sky' },
    { id: 'simCard', label: 'SIM Card', icon: <Signal className="w-4 h-4" />, color: 'amber' },
    { id: 'appName', label: 'App', icon: <Box className="w-4 h-4" />, color: 'purple' },
    { id: 'deviceId', label: 'Device ID', icon: <Monitor className="w-4 h-4" />, color: 'rose' }
  ];

  const sectionMap = Object.fromEntries(sections.map(s => [s.id, s]));

  const fetchKB = async () => {
    try {
      const res = await fetch(`${API_URL}/knowledge-base/remarks`);
      if (res.ok) setData(await res.json());
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchKB(); }, []);

  const handleAdd = async () => {
    if (!newValue.trim()) return;
    try {
      await fetch(`${API_URL}/knowledge-base/remarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: newField, value: newValue.trim() })
      });
      setNewValue('');
      fetchKB();
    } catch (e) {}
  };

  const handleDelete = async (field: string, value: string) => {
    try {
      await fetch(`${API_URL}/knowledge-base/remarks?field=${field}&value=${encodeURIComponent(value)}`, {
        method: 'DELETE'
      });
      fetchKB();
    } catch (e) {}
  };

  // Flatten all data into a unified list
  const allRows = sections.flatMap(sec =>
    (data[sec.id] || []).map((val: string) => ({ field: sec.id, value: val, label: sec.label, icon: sec.icon, color: sec.color }))
  );

  // Filter
  const filtered = allRows.filter(row => {
    const matchesSearch = !searchTerm || row.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || row.field === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterCategory]);

  const totalRecords = allRows.length;

  const getCategoryBadgeClass = (color: string) => {
    const map: Record<string, string> = {
      blue: isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200',
      indigo: isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
      emerald: isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      sky: isDarkMode ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-sky-50 text-sky-700 border-sky-200',
      amber: isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200',
      purple: isDarkMode ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200',
      rose: isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return map[color] || map.blue;
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500 opacity-30" />
    </div>
  );

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3">
        <div className={`col-span-2 sm:col-span-4 lg:col-span-1 p-4 rounded-2xl border text-center transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-sm'}`}>
          <p className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40">Total</p>
          <p className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalRecords}</p>
        </div>
        {sections.map(sec => (
          <button
            key={sec.id}
            onClick={() => setFilterCategory(filterCategory === sec.id ? 'ALL' : sec.id)}
            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              filterCategory === sec.id
                ? (isDarkMode ? 'bg-blue-600/20 border-blue-500/30 ring-1 ring-blue-500/30' : 'bg-blue-50 border-blue-200 ring-1 ring-blue-300')
                : (isDarkMode ? 'bg-white/[0.02] border-white/5 hover:bg-white/5' : 'bg-white border-black/5 hover:bg-gray-50 shadow-sm')
            }`}
          >
            <p className="text-sm mb-0.5">{sec.icon}</p>
            <p className="text-[7px] font-black uppercase tracking-wider opacity-50 truncate">{sec.label}</p>
            <p className={`text-lg font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{(data[sec.id] || []).length}</p>
          </button>
        ))}
      </div>

      {/* Main Card */}
      <Card className={`rounded-[2.5rem] border shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#111]/80 border-white/10 backdrop-blur-3xl' : 'bg-white border-black/5'}`}>

        {/* Add New Entry */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.01]'}`}>
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
              className={`h-12 px-5 rounded-2xl border-none font-bold text-xs outline-none appearance-none cursor-pointer min-w-[180px] ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <div className="relative flex-1">
              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
              <input
                type="text"
                placeholder={`Adicionar novo registro em "${sectionMap[newField]?.label}"...`}
                className={`w-full h-12 pl-12 pr-4 rounded-2xl border-none font-medium text-sm outline-none ${isDarkMode ? 'bg-white/10 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <Button onClick={handleAdd} disabled={!newValue.trim()} className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-30">
              <Plus className="w-4 h-4 mr-2" /> Inserir
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className={`p-6 border-b flex flex-col md:flex-row gap-3 items-center ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Pesquisar em todos os registros..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`pl-12 rounded-2xl border-none h-12 font-medium ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}
            />
          </div>
          <div className="relative w-full md:w-56">
            <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className={`w-full pl-11 pr-4 h-12 rounded-2xl border-none font-bold text-xs outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              <option value="ALL">Todas as Categorias</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.label} ({(data[s.id] || []).length})</option>
              ))}
            </select>
          </div>
          <div className="text-[9px] font-black uppercase tracking-widest opacity-40 whitespace-nowrap">
            {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={isDarkMode ? 'bg-white/[0.03]' : 'bg-gray-50/80'}>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest opacity-40 w-[5%]">#</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest opacity-40 w-[20%]">Categoria</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest opacity-40 w-[65%]">Valor</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest opacity-40 w-[10%] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-black/5'}`}>
              {paginated.map((row, idx) => (
                <tr key={`${row.field}-${idx}`} className={`group transition-colors ${isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-blue-500/[0.02]'}`}>
                  <td className="p-5 text-[10px] font-black opacity-20 tabular-nums">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider ${getCategoryBadgeClass(row.color)}`}>
                      <span>{row.icon}</span> {row.label}
                    </span>
                  </td>
                  <td className={`p-5 font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {row.value}
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => handleDelete(row.field, row.value)}
                      className={`p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 ${isDarkMode ? 'hover:bg-rose-500/10 text-rose-400' : 'hover:bg-rose-50 text-rose-500'}`}
                      title="Remover registro"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Database size={48} className="mx-auto mb-4 opacity-10" />
              <p className="text-sm font-bold opacity-30">
                {searchTerm || filterCategory !== 'ALL' ? 'Nenhum registro encontrado com os filtros aplicados.' : 'Base de dados vazia. Adicione registros acima.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`p-6 border-t flex items-center justify-between ${isDarkMode ? 'border-white/5 bg-white/[0.01]' : 'border-black/5 bg-black/[0.01]'}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-10 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-10 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest"
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </Card>

    </div>
  );
};

type TabType = 'bug_review' | 'general_info' | 'tone_of_voice' | 'glossary' | 'remarks' | 'system_notices' | 'tone_of_voice_es' | 'glossary_es' | 'feedback_pt' | 'feedback_es';

export default function KnowledgeBasePage() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('bug_review');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Estados para Manuais (Tabela de Seções)
  const [textSections, setTextSections] = useState<TextSection[]>([]);
  const [searchSection, setSearchSection] = useState('');
  const [editingSection, setEditingSection] = useState<TextSection | null>(null);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [sectionCurrentPage, setSectionCurrentPage] = useState(1);

  // Estados para Feedbacks (Interface tipo Glossário)
  const [feedbacks, setFeedbacks] = useState<{ id: string, text: string }[]>([]);
  const [feedbackRawHeaders, setFeedbackRawHeaders] = useState<string[]>([]);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [editingFeedback, setEditingFeedback] = useState<{ id?: string, text: string }>({ text: '' });
  const [feedbackCurrentPage, setFeedbackCurrentPage] = useState(1);

  // Estados para Glossário
  const [glossaryItems, setGlossaryItems] = useState<GlossaryItem[]>([]);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryAppFilter, setGlossaryAppFilter] = useState('ALL');
  const [glossaryDntFilter, setGlossaryDntFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [isEditingGlossary, setIsEditingGlossary] = useState(false);
  const [editingItem, setEditingItem] = useState<GlossaryItem>({
    english: '', translation: '', description: '', dnt: 'No', app_name: ''
  });

  // Estados da IA em Lote
  const [aiState, setAiState] = useState({
    active: false,
    currentIndex: 0,
    totalItems: 0,
    results: [] as string[],
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  // Estados para Modal de Seleção de IA (Glossário)
  const [isAiSelectionModalOpen, setIsAiSelectionModalOpen] = useState(false);
  const [aiSelectionSearch, setAiSelectionSearch] = useState('');
  const [aiSelectionAppFilter, setAiSelectionAppFilter] = useState('ALL');
  const [aiSelectionSort, setAiSelectionSort] = useState<'english_asc' | 'english_desc' | 'app_asc' | 'app_desc'>('english_asc');
  const [selectedForAi, setSelectedForAi] = useState<Set<string>>(new Set());

  // Estados para Avisos do Sistema
  const [systemNotices, setSystemNotices] = useState<any[]>([]);
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>({ title: '', description: '', is_active: false });

  const API_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8001` : '';

  useEffect(() => {
    loadData();
    resetAiState();
  }, [activeTab]);

  const resetAiState = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setAiState({ active: false, currentIndex: 0, totalItems: 0, results: [] });
  };

  // Parsers de Texto -> Seções
  const parseMarkdownToSections = (text: string): TextSection[] => {
    const lines = text.split('\n');
    const sections: TextSection[] = [];
    let currentSection: TextSection = { id: (Date.now().toString(36) + Math.random().toString(36).substring(2, 9)), title: 'Introdução / Geral', content: '', isExpanded: false };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(/^#{1,4}\s/)) {
        if (currentSection.content.trim() || currentSection.title !== 'Introdução / Geral') {
           sections.push({...currentSection, content: currentSection.content.trim()});
        }
        currentSection = { id: (Date.now().toString(36) + Math.random().toString(36).substring(2, 9)), title: line.trim(), content: '', isExpanded: false };
      } else {
        currentSection.content += line + '\n';
      }
    }
    if (currentSection.content.trim() || currentSection.title !== 'Introdução / Geral') {
      sections.push({...currentSection, content: currentSection.content.trim()});
    }
    return sections;
  };

  const buildMarkdownFromSections = (sections: TextSection[]): string => {
    return sections.map(s => {
      const titleLine = s.title.startsWith('#') ? s.title : `## ${s.title}`;
      return s.title === 'Introdução / Geral' ? s.content.trim() : `${titleLine}\n${s.content.trim()}`;
    }).join('\n\n');
  };

  const loadData = async () => {
    setLoading(true);
    setSearchSection('');
    setGlossarySearch('');
    setFeedbackSearch('');
    try {
      if (activeTab === 'system_notices') {
        const res = await fetch(`${API_URL}/system-notices`);
        if (res.ok) setSystemNotices(await res.json());
      } else if (activeTab === 'glossary' || activeTab === 'glossary_es') {
        const endpoint = activeTab === 'glossary_es' ? 'glossary_es' : 'glossary';
        const res = await fetch(`${API_URL}/${endpoint}`);
        if (res.ok) {
          const data = await res.json();
          setGlossaryItems(data);
        }
      } else if (activeTab === 'feedback_pt' || activeTab === 'feedback_es') {
        const lang = activeTab === 'feedback_pt' ? 'pt' : 'es';
        const res = await fetch(`${API_URL}/knowledge-base/feedback/${lang}`);
        if (res.ok) {
          const { content } = await res.json();
          const lines = content.split('\n');
          const headers = lines.filter((l: string) => l.trim().startsWith('#'));
          const parsed = lines
            .filter((l: string) => l.trim() && !l.trim().startsWith('#'))
            .map((text: string) => ({ id: (Date.now() + Math.random()).toString(), text }));
          setFeedbackRawHeaders(headers);
          setFeedbacks(parsed);
        }
      } else {
        const filename = `${activeTab}.txt`;
        const res = await fetch(`${API_URL}/knowledge/${filename}`);
        if (res.ok) {
          const data = await res.json();
          setTextSections(parseMarkdownToSections(data.content));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTextFile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const filename = `${activeTab}.txt`;
      const content = buildMarkdownFromSections(textSections);
      const res = await fetch(`${API_URL}/knowledge/${filename}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Documento atualizado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar documento.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro crítico de conexão.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSaveSection = () => {
    if (!editingSection) return;
    if (editingSection.id.startsWith('new_')) {
      setTextSections([...textSections, { ...editingSection, id: (Date.now().toString(36) + Math.random().toString(36).substring(2, 9)) }]);
    } else {
      setTextSections(textSections.map(s => s.id === editingSection.id ? editingSection : s));
    }
    setIsSectionModalOpen(false);
    setEditingSection(null);
  };

  const handleDeleteSection = (id: string) => {
    if (!confirm('Excluir esta seção do manual?')) return;
    setTextSections(textSections.filter(s => s.id !== id));
  };

  const toggleSection = (id: string) => {
    setTextSections(textSections.map(s => s.id === id ? { ...s, isExpanded: !s.isExpanded } : s));
  };

  const handleSaveGlossary = async () => {
    if (!editingItem.english || !editingItem.translation) {
      setMessage({ type: 'error', text: 'Preencha os campos obrigatórios.' });
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editingItem.id;
      const method = isEdit ? 'PUT' : 'POST';
      const endpoint = activeTab === 'glossary_es' ? 'glossary_es' : 'glossary';
      const url = isEdit ? `${API_URL}/${endpoint}/${editingItem.id}` : `${API_URL}/${endpoint}`;
      
      // Remove o ID do corpo se for um novo item para evitar conflitos no backend
      const payload = { ...editingItem };
      if (!isEdit) delete payload.id;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsEditingGlossary(false);
        setEditingItem({ english: '', translation: '', description: '', dnt: 'No', app_name: '' });
        loadData();
        setMessage({ type: 'success', text: isEdit ? 'Item atualizado!' : 'Novo item salvo!' });
      } else {
        const errorData = await res.json();
        setMessage({ type: 'error', text: errorData.detail || 'Erro ao processar glossário.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteGlossary = async (id: string) => {
    if (!confirm('Deseja excluir este item do glossário?')) return;
    try {
      const endpoint = activeTab === 'glossary_es' ? 'glossary_es' : 'glossary';
      await fetch(`${API_URL}/${endpoint}/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveNotice = async () => {
    if (!editingNotice.title || !editingNotice.description) {
      setMessage({ type: 'error', text: 'Preencha título e descrição.' });
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editingNotice.id;
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_URL}/system-notices/${editingNotice.id}` : `${API_URL}/system-notices`;
      
      const payload = { ...editingNotice };
      if (!isEdit) delete payload.id;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsEditingNotice(false);
        setEditingNotice({ title: '', description: '', is_active: false });
        loadData();
        setMessage({ type: 'success', text: isEdit ? 'Aviso atualizado!' : 'Novo aviso salvo!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar aviso.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleToggleNotice = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/system-notices/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) loadData();
    } catch (e) {}
  };

  const handleDeleteNotice = async (id: number) => {
    if (!confirm('Excluir aviso?')) return;
    try {
      const res = await fetch(`${API_URL}/system-notices/${id}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (e) {}
  };

  const syncFeedbacks = async (updatedFeedbacks: {id: string, text: string}[]) => {
      setSaving(true);
      const lang = activeTab === 'feedback_pt' ? 'pt' : 'es';
      const textToSave = [...feedbackRawHeaders, ...updatedFeedbacks.map(f => f.text)].join('\n');
      try {
          const res = await fetch(`${API_URL}/knowledge-base/feedback/${lang}`, {
             method: 'PUT',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ content: textToSave })
          });
          if (res.ok) {
             setFeedbacks(updatedFeedbacks);
             setMessage({ type: 'success', text: 'Feedback salvo!' });
             setEditingFeedback({ text: '' });
          } else {
             setMessage({ type: 'error', text: 'Erro ao salvar.' });
          }
      } catch (e) {
          setMessage({ type: 'error', text: 'Erro de conexão.' });
      } finally {
          setSaving(false);
          setTimeout(() => setMessage(null), 3000);
      }
  };

  const handleSaveFeedback = async () => {
     if (!editingFeedback.text.trim()) {
         setMessage({ type: 'error', text: 'O texto do feedback não pode estar vazio.' });
         return;
     }
     let updatedFeedbacks = [...feedbacks];
     if (editingFeedback.id) {
         updatedFeedbacks = updatedFeedbacks.map(f => f.id === editingFeedback.id ? { ...f, text: editingFeedback.text } : f);
     } else {
         updatedFeedbacks.unshift({ id: (Date.now() + Math.random()).toString(), text: editingFeedback.text });
     }
     await syncFeedbacks(updatedFeedbacks);
  };

  const handleDeleteFeedback = async (id: string) => {
     if (!confirm('Excluir este feedback da IA?')) return;
     const updated = feedbacks.filter(f => f.id !== id);
     await syncFeedbacks(updated);
  };

  // --- MOTOR DE ANÁLISE DE IA EM LOTES (15 EM 15) ---
  const startBatchAIAnalysis = async (specificItems?: any[]) => {
    let itemsToAnalyze: any[] = [];
    let promptType = '';

    if (specificItems) {
      itemsToAnalyze = specificItems;
      promptType = 'Glossário Técnico (Seleção)';
      setIsAiSelectionModalOpen(false);
    } else if (activeTab === 'glossary' || activeTab === 'glossary_es') {
      itemsToAnalyze = glossaryItems;
      promptType = activeTab === 'glossary_es' ? 'Glossário Técnico (Espanhol)' : 'Glossário Técnico';
    } else {
      itemsToAnalyze = textSections;
      promptType = `Manual de Procedimentos (${activeTab})`;
    }

    if (itemsToAnalyze.length === 0) return alert('Nenhum dado para analisar.');

    setAiState({ active: true, currentIndex: 0, totalItems: itemsToAnalyze.length, results: [] });
    abortControllerRef.current = new AbortController();
    let allResults: string[] = [];

    for (let i = 0; i < itemsToAnalyze.length; i += 15) {
      if (!abortControllerRef.current) break; // Interrompido pelo usuário
      
      setAiState(prev => ({ ...prev, currentIndex: i }));
      const chunk = itemsToAnalyze.slice(i, i + 15);
      
      try {
        const res = await fetch(`${API_URL}/ai/suggest_knowledge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            content: JSON.stringify(chunk, null, 2),
            type: promptType 
          }),
          signal: abortControllerRef.current.signal
        });
        
        if (res.ok) {
          const data = await res.json();
          allResults.push(`### Análise do Lote ${Math.floor(i/15) + 1} (Itens ${i+1} a ${Math.min(i+15, itemsToAnalyze.length)})\n${data.suggestion}\n\n---\n`);
          setAiState(prev => ({ ...prev, results: [...allResults] }));
        } else {
          allResults.push(`**Erro no Lote ${Math.floor(i/15) + 1}:** Resposta inválida do servidor.\n\n---\n`);
          setAiState(prev => ({ ...prev, results: [...allResults] }));
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Análise interrompida.');
          break;
        }
        allResults.push(`**Erro no Lote ${Math.floor(i/15) + 1}:** Falha de conexão.\n\n---\n`);
        setAiState(prev => ({ ...prev, results: [...allResults] }));
      }
    }
    
    // Concluído
    setAiState(prev => ({ ...prev, active: prev.active, currentIndex: prev.totalItems }));
    abortControllerRef.current = null;
  };

  const interruptAI = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setAiState(prev => ({ ...prev, active: false }));
  };

  // --- FILTROS E PAGINAÇÃO (GLOSSÁRIO) ---
  const uniqueApps = Array.from(new Set(glossaryItems.map(i => i.app_name).filter(Boolean))).sort();
  
  const filteredGlossary = glossaryItems.filter(item => {
    const matchesSearch = item.english.toLowerCase().includes(glossarySearch.toLowerCase()) || 
                          item.translation.toLowerCase().includes(glossarySearch.toLowerCase());
    const matchesApp = glossaryAppFilter === 'ALL' || item.app_name === glossaryAppFilter;
    const matchesDnt = glossaryDntFilter === 'ALL' || item.dnt === glossaryDntFilter;
    return matchesSearch && matchesApp && matchesDnt;
  });

  const glossaryTotalPages = Math.ceil(filteredGlossary.length / itemsPerPage);
  const paginatedGlossary = filteredGlossary.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [glossarySearch, glossaryAppFilter, glossaryDntFilter]);

  // --- FILTROS E PAGINAÇÃO (SEÇÕES DE TEXTO) ---
  const filteredSections = textSections.filter(s => 
    s.title.toLowerCase().includes(searchSection.toLowerCase()) || 
    s.content.toLowerCase().includes(searchSection.toLowerCase())
  );
  const sectionsTotalPages = Math.ceil(filteredSections.length / itemsPerPage);
  const paginatedSections = filteredSections.slice((sectionCurrentPage - 1) * itemsPerPage, sectionCurrentPage * itemsPerPage);

  useEffect(() => { setSectionCurrentPage(1); }, [searchSection]);

  // --- FILTROS E PAGINAÇÃO (FEEDBACKS) ---
  const filteredFeedbacks = feedbacks.filter(f => 
    f.text.toLowerCase().includes(feedbackSearch.toLowerCase())
  );
  const feedbackTotalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice((feedbackCurrentPage - 1) * itemsPerPage, feedbackCurrentPage * itemsPerPage);

  useEffect(() => { setFeedbackCurrentPage(1); }, [feedbackSearch]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <Brain className="text-blue-500 w-10 h-10" /> Gestão de Conhecimento
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Alimente as regras de inteligência artificial e o glossário do sistema de forma estruturada.
            </p>
          </div>

          {message && (
            <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-bold uppercase tracking-wider">{message.text}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap p-1.5 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 w-fit mb-8 gap-1">
          <button onClick={() => setActiveTab('bug_review')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'bug_review' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60'}`}>
            Bug Review
          </button>
          <button onClick={() => setActiveTab('general_info')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'general_info' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60'}`}>
            Infos Gerais
          </button>
          <button onClick={() => setActiveTab('tone_of_voice')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'tone_of_voice' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60'}`}>
            <span className="flex items-center gap-2"><Sparkles size={14}/> Tom de Voz (STMS)</span>
          </button>
          <button onClick={() => setActiveTab('tone_of_voice_es')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'tone_of_voice_es' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60'}`}>
            <span className="flex items-center gap-2"><Sparkles size={14}/> Tom de Voz (STMS ES)</span>
          </button>
          <button onClick={() => setActiveTab('glossary')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'glossary' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60'}`}>
            Glossário DB
          </button>
          <button onClick={() => setActiveTab('glossary_es')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'glossary_es' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60'}`}>
            Glossário (ES)
          </button>
          <button onClick={() => setActiveTab('remarks')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'remarks' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60'}`}>
            Remarks (Autocomplete)
          </button>
          <button onClick={() => setActiveTab('feedback_pt')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'feedback_pt' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60'}`}>
            <span className="flex items-center gap-2"><MessageSquare size={14}/> Feedback IA (PT)</span>
          </button>
          <button onClick={() => setActiveTab('feedback_es')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'feedback_es' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60'}`}>
            <span className="flex items-center gap-2"><MessageSquare size={14}/> Feedback IA (ES)</span>
          </button>
          <button onClick={() => setActiveTab('system_notices')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'system_notices' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-60'}`}>
            <span className="flex items-center gap-2"><AlertCircle size={14}/> Avisos do Sistema</span>
          </button>
        </div>

        <div className="relative min-h-[600px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 opacity-20" />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* KNOWLEDGE BASE MANAGER (REMARKS) */}
              {activeTab === 'remarks' && (
                <KnowledgeBaseManager isDarkMode={isDarkMode} API_URL={API_URL} />
              )}
              
              {/* AVISOS DO SISTEMA INTERFACE */}
              {activeTab === 'system_notices' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <Card className={`p-8 rounded-[2.5rem] border shadow-2xl sticky top-24 ${isDarkMode ? 'bg-red-600/5 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                      <h3 className="text-lg font-black uppercase tracking-widest text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
                        {editingNotice.id ? <Edit2 size={20}/> : <Plus size={20}/>}
                        {editingNotice.id ? 'Editar Aviso' : 'Criar Aviso'}
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase opacity-60 ml-1">Título</label>
                          <Input value={editingNotice.title} onChange={e => setEditingNotice({...editingNotice, title: e.target.value})} className={`rounded-xl border-none h-12 font-bold ${isDarkMode ? 'bg-black/40' : 'bg-white'}`} placeholder="Ex: Manutenção Programada" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase opacity-60 ml-1">Descrição</label>
                          <Textarea value={editingNotice.description} onChange={e => setEditingNotice({...editingNotice, description: e.target.value})} className={`rounded-xl border-none font-bold min-h-[150px] p-4 ${isDarkMode ? 'bg-black/40' : 'bg-white'}`} placeholder="Mensagem do aviso (suporta quebra de linha)" />
                        </div>
                        <div className="flex items-center gap-3 py-2">
                          <input type="checkbox" checked={editingNotice.is_active} onChange={e => setEditingNotice({...editingNotice, is_active: e.target.checked})} className="w-5 h-5 rounded" />
                          <label className="text-sm font-bold">Tornar Aviso Ativo</label>
                        </div>
                      </div>
                      <div className="mt-8 flex gap-3">
                        {editingNotice.id && (
                          <Button variant="outline" onClick={() => setEditingNotice({ title: '', description: '', is_active: false })} className="flex-1 rounded-xl h-12 font-bold border-red-500/20 text-red-500">Cancelar</Button>
                        )}
                        <Button onClick={handleSaveNotice} disabled={saving} className="flex-1 rounded-xl h-12 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/20">
                          {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />} Salvar
                        </Button>
                      </div>
                    </Card>
                  </div>
                  <div className="lg:col-span-2">
                    <Card className={`p-8 rounded-[2.5rem] border shadow-2xl ${isDarkMode ? 'bg-[#111]/80 border-white/10' : 'bg-white border-black/5'}`}>
                      <div className="space-y-4">
                        {systemNotices.map((notice, idx) => (
                          <div key={notice.id} className={`p-6 rounded-3xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${notice.is_active ? (isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200') : (isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5')}`}>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{notice.title}</h4>
                                {notice.is_active && <span className="px-2.5 py-1 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest animate-pulse">Ativo</span>}
                              </div>
                              <p className={`text-sm whitespace-pre-wrap opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notice.description}</p>
                              <p className="text-[10px] font-black uppercase opacity-40 mt-3">Atualizado: {new Date(notice.updated_at).toLocaleString('pt-BR')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button onClick={() => handleToggleNotice(notice.id)} variant="outline" className={`h-10 rounded-xl font-bold border-none ${notice.is_active ? 'bg-red-500 text-white hover:bg-red-600' : (isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300')}`}>
                                {notice.is_active ? 'Desativar' : 'Ativar'}
                              </Button>
                              <Button onClick={() => { setEditingNotice(notice); window.scrollTo({top: 0, behavior: 'smooth'}); }} variant="outline" className="h-10 w-10 p-0 rounded-xl bg-transparent border-none hover:bg-blue-500/10 text-blue-500"><Edit2 size={16} /></Button>
                              <Button onClick={() => handleDeleteNotice(notice.id)} variant="outline" className="h-10 w-10 p-0 rounded-xl bg-transparent border-none hover:bg-rose-500/10 text-rose-500"><Trash2 size={16} /></Button>
                            </div>
                          </div>
                        ))}
                        {systemNotices.length === 0 && (
                          <div className="py-12 text-center opacity-40">
                            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-bold">Nenhum aviso criado.</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* INTERFACE DE MANUAIS (ACCORDION DE CAPÍTULOS) */}
              {(activeTab === 'bug_review' || activeTab === 'general_info' || activeTab === 'tone_of_voice' || activeTab === 'tone_of_voice_es') && (
                <Card className={`p-8 rounded-[2.5rem] border shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#111]/80 border-white/10 backdrop-blur-3xl' : 'bg-white border-black/5'}`}>
                  
                  {/* Cabeçalho e Filtros */}
                  <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-8">
                    <div className="relative flex-1 w-full max-w-md">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        placeholder={`Pesquisar nos capítulos do ${activeTab}...`}
                        value={searchSection}
                        onChange={e => setSearchSection(e.target.value)}
                        className={`pl-12 rounded-full border-none h-12 font-medium ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}
                      />
                    </div>
                    <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                      <Button onClick={() => { setEditingSection({ id: 'new_' + Date.now(), title: '# Novo Capítulo', content: '' }); setIsSectionModalOpen(true); }} className="rounded-full font-bold h-12 bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 shadow-none border-none">
                        <Plus className="w-4 h-4 mr-2" /> Novo Capítulo
                      </Button>
                      <Button onClick={() => startBatchAIAnalysis()} className={`rounded-full font-bold h-12 text-white shadow-lg ${activeTab.startsWith('tone_of_voice') ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'}`}>
                        <Sparkles className="w-4 h-4 mr-2" /> Análise IA (Lotes)
                      </Button>
                      <Button onClick={handleSaveTextFile} disabled={saving} className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 shadow-lg shadow-emerald-600/20">
                        {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Salvar Manual
                      </Button>
                    </div>
                  </div>

                  {/* Lista de Capítulos (Accordion) */}
                  <div className="space-y-4">
                    {paginatedSections.map((section, idx) => (
                      <div key={section.id || idx} className={`rounded-3xl border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-gray-50/50 border-black/5'}`}>
                        {/* Header do Capítulo */}
                        <div 
                          className={`p-6 flex items-center justify-between cursor-pointer hover:bg-blue-500/5 transition-colors ${section.isExpanded ? (isDarkMode ? 'bg-white/5' : 'bg-blue-50/50') : ''}`}
                          onClick={() => toggleSection(section.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full transition-transform duration-300 ${section.isExpanded ? 'rotate-90 text-blue-500 bg-blue-500/10' : 'text-gray-400'}`}>
                              <ChevronRight size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">
                              {section.title.replace(/^#+\s/, '')}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-full hover:bg-blue-500/10 text-blue-500 transition-colors" onClick={(e) => { e.stopPropagation(); setEditingSection(section); setIsSectionModalOpen(true); }} title="Editar Capítulo">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 rounded-full hover:bg-rose-500/10 text-rose-500 transition-colors" onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }} title="Excluir Capítulo">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {/* Conteúdo Expandido (Markdown) */}
                        {section.isExpanded && (
                          <div className={`p-8 border-t ${isDarkMode ? 'border-white/10 bg-black/20' : 'border-black/5 bg-white'}`}>
                            <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-blue-400' : 'prose-p:text-gray-600 prose-headings:text-gray-900 prose-strong:text-blue-600'}`}>
                              <ReactMarkdown>{section.content || '*Capítulo vazio.*'}</ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {filteredSections.length === 0 && (
                      <div className="py-20 text-center opacity-40">
                        <FileText size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-bold">Nenhum capítulo encontrado.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Paginação Seções */}
                  {sectionsTotalPages > 1 && (
                    <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                        Mostrando {(sectionCurrentPage - 1) * itemsPerPage + 1} - {Math.min(sectionCurrentPage * itemsPerPage, filteredSections.length)} de {filteredSections.length}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSectionCurrentPage(p => Math.max(1, p - 1))} disabled={sectionCurrentPage === 1} className="rounded-full h-8 px-4 font-bold">
                          Anterior
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSectionCurrentPage(p => Math.min(sectionsTotalPages, p + 1))} disabled={sectionCurrentPage === sectionsTotalPages} className="rounded-full h-8 px-4 font-bold">
                          Próxima
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* GLOSSÁRIO INTERFACE */}
              {(activeTab === 'glossary' || activeTab === 'glossary_es') && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Formulário Esquerdo */}
                  <div className="lg:col-span-1">
                    <Card className={`p-8 rounded-[2.5rem] border shadow-2xl sticky top-24 ${isDarkMode ? 'bg-emerald-600/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                      <h3 className="text-lg font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-6 flex items-center gap-2">
                        {editingItem.id ? <Edit2 size={20}/> : <Plus size={20}/>}
                        {editingItem.id ? 'Editar Termo' : 'Adicionar Novo'}
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase opacity-60 ml-1">Inglês (Original)</label>
                          <Input value={editingItem.english} onChange={e => setEditingItem({...editingItem, english: e.target.value})} className={`rounded-xl border-none h-12 font-bold ${isDarkMode ? 'bg-black/40' : 'bg-white'}`} placeholder="Ex: Display" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase opacity-60 ml-1">
                            {activeTab === 'glossary_es' ? 'Tradução (ES)' : 'Tradução (PT-BR)'}
                          </label>
                          <Input value={editingItem.translation} onChange={e => setEditingItem({...editingItem, translation: e.target.value})} className={`rounded-xl border-none h-12 font-bold ${isDarkMode ? 'bg-black/40' : 'bg-white'}`} placeholder="Ex: Tela" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase opacity-60 ml-1">Aplicativo / Contexto</label>
                          <Input value={editingItem.app_name} onChange={e => setEditingItem({...editingItem, app_name: e.target.value})} className={`rounded-xl border-none h-12 font-bold ${isDarkMode ? 'bg-black/40' : 'bg-white'}`} placeholder="Ex: Settings" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase opacity-60 ml-1 text-amber-500">Regra DNT (Do Not Translate)</label>
                          <select value={editingItem.dnt} onChange={e => setEditingItem({...editingItem, dnt: e.target.value})} className={`w-full h-12 px-4 rounded-xl border-none font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${isDarkMode ? 'bg-black/40 text-white' : 'bg-white text-gray-900'}`}>
                            <option value="No">Não - Traduzir Normalmente</option>
                            <option value="Yes">Sim - Manter em Inglês</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase opacity-60 ml-1">Descrição Técnica / Observação</label>
                          <Textarea value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className={`rounded-xl border-none font-medium min-h-[100px] ${isDarkMode ? 'bg-black/40' : 'bg-white'}`} placeholder="Ex: Use 'Tela' em vez de 'Visor' para Settings." />
                        </div>
                      </div>
                      <div className="mt-8 flex flex-col gap-3">
                        <Button onClick={handleSaveGlossary} disabled={saving || !editingItem.english} className="w-full rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 shadow-lg shadow-emerald-600/20">
                          {saving ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                          Salvar no Banco
                        </Button>
                        {editingItem.id && (
                          <Button variant="ghost" onClick={() => setEditingItem({ english: '', translation: '', description: '', dnt: 'No', app_name: '' })} className="w-full rounded-full font-bold h-12">
                            Cancelar Edição
                          </Button>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Tabela do Glossário com Filtros */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className={`p-6 rounded-[2.5rem] border shadow-2xl flex flex-col xl:flex-row gap-4 items-center ${isDarkMode ? 'bg-[#111]/80 border-white/10 backdrop-blur-3xl' : 'bg-white border-black/5'}`}>
                      <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input 
                          placeholder="Buscar no glossário..." 
                          value={glossarySearch}
                          onChange={e => setGlossarySearch(e.target.value)}
                          className={`pl-12 rounded-full border-none h-12 font-medium ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}
                        />
                      </div>
                      <div className="flex gap-2 w-full xl:w-auto">
                        <div className="relative w-full xl:w-48">
                          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select 
                            value={glossaryAppFilter} 
                            onChange={e => setGlossaryAppFilter(e.target.value)}
                            className={`w-full pl-11 pr-4 h-12 rounded-full border-none font-bold text-xs outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
                          >
                            <option value="ALL">Todos os Apps</option>
                            {uniqueApps.map((app, i) => <option key={i} value={app}>{app}</option>)}
                          </select>
                        </div>
                        <div className="relative w-full xl:w-32">
                          <select 
                            value={glossaryDntFilter} 
                            onChange={e => setGlossaryDntFilter(e.target.value)}
                            className={`w-full px-4 h-12 rounded-full border-none font-bold text-xs outline-none appearance-none cursor-pointer ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
                          >
                            <option value="ALL">DNT: Todos</option>
                            <option value="Yes">DNT: Sim</option>
                            <option value="No">DNT: Não</option>
                          </select>
                        </div>
                        <Button 
                          onClick={() => setIsAiSelectionModalOpen(true)}
                          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white p-0 shrink-0 shadow-lg shadow-blue-600/20" 
                          title="Análise IA em Lote (Glossário)"
                        >
                          <Sparkles size={18} />
                        </Button>
                      </div>
                    </Card>

                    <Card className={`rounded-[2.5rem] border shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#111]/80 border-white/10 backdrop-blur-3xl' : 'bg-white border-black/5'}`}>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className={`border-b ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
                              <th className="p-5 text-[10px] font-black uppercase tracking-widest opacity-40">App</th>
                              <th className="p-5 text-[10px] font-black uppercase tracking-widest opacity-40">Termo Original</th>
                              <th className="p-5 text-[10px] font-black uppercase tracking-widest opacity-40">Tradução</th>
                              <th className="p-5 text-[10px] font-black uppercase tracking-widest opacity-40">DNT</th>
                              <th className="p-5 text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedGlossary.length > 0 ? paginatedGlossary.map((item) => (
                              <tr key={item.id} className={`border-b last:border-0 transition-colors group ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'}`}>
                                <td className="p-5 align-top max-w-[120px]">
                                  <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isDarkMode ? 'bg-white/10 text-gray-400 border-white/5' : 'bg-gray-100 text-gray-500 border-black/5'}`}>
                                    {item.app_name || 'Geral'}
                                  </span>
                                </td>
                                <td className="p-5 align-top">
                                  <p className="font-bold text-sm leading-tight text-gray-900 dark:text-white">{item.english}</p>
                                  {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium leading-relaxed max-w-[200px]">{item.description}</p>}
                                </td>
                                <td className="p-5 align-top">
                                  <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 leading-tight">{item.translation}</p>
                                </td>
                                <td className="p-5 align-top">
                                  {item.dnt === 'Yes' ? (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                                      <AlertCircle size={12}/> Manter IN
                                    </span>
                                  ) : <span className="opacity-20 text-xs font-bold">-</span>}
                                </td>
                                <td className="p-5 align-top text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)} className="h-8 w-8 p-0 rounded-lg text-blue-500 hover:bg-blue-500/10"><Edit2 size={14}/></Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteGlossary(item.id!)} className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-500/10"><Trash2 size={14}/></Button>
                                  </div>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={5} className="p-10 text-center opacity-40 font-bold text-sm">
                                  Nenhum item no glossário.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Paginação do Glossário */}
                      {glossaryTotalPages > 1 && (
                        <div className={`p-5 border-t flex items-center justify-between ${isDarkMode ? 'border-white/5 bg-white/[0.01]' : 'border-black/5 bg-black/[0.01]'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                            Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredGlossary.length)} de {filteredGlossary.length}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-full h-8 px-4 font-bold">
                              Anterior
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(glossaryTotalPages, p + 1))} disabled={currentPage === glossaryTotalPages} className="rounded-full h-8 px-4 font-bold">
                              Próxima
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </main>

      {/* Modal de Edição de Seção de Texto (Bug Review / Infos) */}
      {isSectionModalOpen && editingSection && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setIsSectionModalOpen(false)}>
          <Card className={`w-full max-w-5xl flex flex-col overflow-hidden rounded-[2.5rem] border shadow-2xl animate-in zoom-in-95 duration-200 h-[85vh] ${isDarkMode ? 'bg-[#0a0a0a] border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'}`} onClick={e => e.stopPropagation()}>
            <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <h2 className="text-xl font-bold tracking-tight">Editar Seção</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsSectionModalOpen(false)} className="rounded-full h-8 w-8 p-0"><X className="w-5 h-5" /></Button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase opacity-60 ml-1">Título da Seção (Use # para nível do título)</label>
                  <Input 
                    value={editingSection.title} 
                    onChange={e => setEditingSection({...editingSection, title: e.target.value})} 
                    className={`mt-1 rounded-xl border-none h-12 font-bold ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} 
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="text-[10px] font-black uppercase opacity-60 ml-1">Conteúdo (Markdown)</label>
                  <Textarea 
                    value={editingSection.content} 
                    onChange={e => setEditingSection({...editingSection, content: e.target.value})} 
                    className={`mt-1 flex-1 min-h-[300px] rounded-xl border-none font-mono text-sm p-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} 
                  />
                </div>
              </div>

              {/* Preview */}
              <div className={`flex-1 p-6 rounded-3xl overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-black/5'}`}>
                <span className="text-[10px] font-black uppercase opacity-40 mb-4 block">Visualização (Markdown)</span>
                <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-blue-400' : 'prose-p:text-gray-600 prose-headings:text-gray-900 prose-strong:text-blue-600'}`}>
                   <ReactMarkdown>{`${editingSection.title}\n\n${editingSection.content}`}</ReactMarkdown>
                </div>
              </div>
            </div>

            <div className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <Button variant="ghost" onClick={() => setIsSectionModalOpen(false)} className="rounded-full px-6 font-bold">Cancelar</Button>
              <Button onClick={handleSaveSection} className="rounded-full px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20">
                Confirmar Edição
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Seleção de IA (Glossário) */}
      {isAiSelectionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setIsAiSelectionModalOpen(false)}>
          <Card className={`w-full max-w-5xl flex flex-col overflow-hidden rounded-[2.5rem] border shadow-2xl animate-in zoom-in-95 duration-200 h-[85vh] ${isDarkMode ? 'bg-[#0a0a0a] border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'}`} onClick={e => e.stopPropagation()}>
            <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="text-blue-500 w-5 h-5" /> Selecionar Itens para Análise da IA
              </h2>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar (App, EN, PT)..."
                    value={aiSelectionSearch}
                    onChange={e => setAiSelectionSearch(e.target.value)}
                    className={`pl-9 rounded-full border-none h-10 text-sm ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}
                  />
                </div>
                <select 
                  value={aiSelectionAppFilter} 
                  onChange={e => setAiSelectionAppFilter(e.target.value)}
                  className={`px-3 rounded-full border-none h-10 text-sm font-bold outline-none cursor-pointer ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
                >
                  <option value="ALL">Todos Apps</option>
                  {uniqueApps.map((app, i) => <option key={i} value={app}>{app}</option>)}
                </select>
                <Button variant="ghost" size="sm" onClick={() => setIsAiSelectionModalOpen(false)} className="rounded-full h-8 w-8 p-0"><X className="w-5 h-5" /></Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5">
                    <th className="p-4 w-[5%] text-center rounded-tl-2xl">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={
                          glossaryItems.filter(item => 
                            (aiSelectionAppFilter === 'ALL' || item.app_name === aiSelectionAppFilter) &&
                            (item.english.toLowerCase().includes(aiSelectionSearch.toLowerCase()) || 
                             item.translation.toLowerCase().includes(aiSelectionSearch.toLowerCase()) ||
                             item.app_name.toLowerCase().includes(aiSelectionSearch.toLowerCase()))
                          ).length > 0 &&
                          glossaryItems.filter(item => 
                            (aiSelectionAppFilter === 'ALL' || item.app_name === aiSelectionAppFilter) &&
                            (item.english.toLowerCase().includes(aiSelectionSearch.toLowerCase()) || 
                             item.translation.toLowerCase().includes(aiSelectionSearch.toLowerCase()) ||
                             item.app_name.toLowerCase().includes(aiSelectionSearch.toLowerCase()))
                          ).every(i => selectedForAi.has(i.id!))
                        }
                        onChange={(e) => {
                          const filteredIds = glossaryItems.filter(item => 
                            (aiSelectionAppFilter === 'ALL' || item.app_name === aiSelectionAppFilter) &&
                            (item.english.toLowerCase().includes(aiSelectionSearch.toLowerCase()) || 
                             item.translation.toLowerCase().includes(aiSelectionSearch.toLowerCase()) ||
                             item.app_name.toLowerCase().includes(aiSelectionSearch.toLowerCase()))
                          ).map(i => i.id!);
                          
                          if (e.target.checked) {
                            setSelectedForAi(new Set([...selectedForAi, ...filteredIds]));
                          } else {
                            const newSet = new Set(selectedForAi);
                            filteredIds.forEach(id => newSet.delete(id));
                            setSelectedForAi(newSet);
                          }
                        }}
                      />
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-50 w-[15%]">App</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-50 w-[40%] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => setAiSelectionSort(s => s === 'english_asc' ? 'english_desc' : 'english_asc')}>
                      Termo (EN) {aiSelectionSort === 'english_asc' ? '↑' : aiSelectionSort === 'english_desc' ? '↓' : ''}
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest opacity-50 w-[40%] rounded-tr-2xl">
                      {activeTab === 'glossary_es' ? 'Tradução (ES)' : 'Tradução (PT)'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {glossaryItems.filter(item => 
                    (aiSelectionAppFilter === 'ALL' || item.app_name === aiSelectionAppFilter) &&
                    (item.english.toLowerCase().includes(aiSelectionSearch.toLowerCase()) || 
                     item.translation.toLowerCase().includes(aiSelectionSearch.toLowerCase()) ||
                     item.app_name.toLowerCase().includes(aiSelectionSearch.toLowerCase()))
                  ).sort((a, b) => {
                    if (aiSelectionSort === 'english_asc') return a.english.localeCompare(b.english);
                    if (aiSelectionSort === 'english_desc') return b.english.localeCompare(a.english);
                    return 0;
                  }).map((item, idx) => (
                    <tr key={item.id || idx} className={`hover:bg-blue-500/[0.03] transition-colors cursor-pointer ${selectedForAi.has(item.id!) ? (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50') : ''}`} onClick={() => {
                      const newSet = new Set(selectedForAi);
                      if (newSet.has(item.id!)) newSet.delete(item.id!);
                      else newSet.add(item.id!);
                      setSelectedForAi(newSet);
                    }}>
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={selectedForAi.has(item.id!)}
                          onChange={() => {}} // handled by tr click
                        />
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                          {item.app_name || 'Geral'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-sm text-gray-900 dark:text-white">{item.english}</td>
                      <td className="p-4 font-medium text-sm text-emerald-600 dark:text-emerald-400">{item.translation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {glossaryItems.filter(item => 
                (aiSelectionAppFilter === 'ALL' || item.app_name === aiSelectionAppFilter) &&
                (item.english.toLowerCase().includes(aiSelectionSearch.toLowerCase()) || 
                 item.translation.toLowerCase().includes(aiSelectionSearch.toLowerCase()) ||
                 item.app_name.toLowerCase().includes(aiSelectionSearch.toLowerCase()))
              ).length === 0 && (
                <div className="py-10 text-center opacity-40 italic">Nenhum item encontrado com este filtro.</div>
              )}
            </div>

            <div className={`p-6 border-t flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="text-sm font-bold">
                <span className="text-blue-500">{selectedForAi.size}</span> itens selecionados
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setIsAiSelectionModalOpen(false)} className="rounded-full px-6 font-bold">Cancelar</Button>
                <Button 
                  onClick={() => {
                    const itemsToRun = glossaryItems.filter(i => selectedForAi.has(i.id!));
                    startBatchAIAnalysis(itemsToRun);
                  }} 
                  disabled={selectedForAi.size === 0} 
                  className="rounded-full px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Iniciar Análise
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Progresso da IA em Lote */}
      {aiState.active && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <Card className={`w-full max-w-3xl overflow-hidden rounded-[2.5rem] border shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col h-[85vh] ${isDarkMode ? 'bg-[#0a0a0a] border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'}`}>
            <div className="p-8 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-blue-600/5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${aiState.currentIndex < aiState.totalItems ? 'bg-blue-600 shadow-blue-600/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}>
                  {aiState.currentIndex < aiState.totalItems ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                    {aiState.currentIndex < aiState.totalItems ? 'Analisando em Lotes (15 itens)...' : 'Análise Concluída!'}
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50 mt-1">
                    Processados {Math.min(aiState.currentIndex, aiState.totalItems)} de {aiState.totalItems}
                  </p>
                </div>
              </div>
              {aiState.currentIndex < aiState.totalItems ? (
                <Button onClick={interruptAI} variant="destructive" className="rounded-full font-bold px-6 shadow-lg">
                  <StopCircle className="w-4 h-4 mr-2" /> Interromper
                </Button>
              ) : (
                <Button onClick={() => setAiState(prev => ({...prev, active: false}))} className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-lg shadow-emerald-600/20">
                  Fechar
                </Button>
              )}
            </div>

            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar bg-black/[0.02] dark:bg-white/[0.02]">
              {aiState.results.length === 0 && aiState.currentIndex < aiState.totalItems && (
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                  <Brain size={48} className="mb-4 animate-pulse" />
                  <p className="font-bold tracking-wider">A IA está lendo o primeiro lote de 15 itens...</p>
                </div>
              )}
              
              <div className="space-y-12">
                {aiState.results.map((res, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className={`p-10 rounded-[2.5rem] border shadow-xl relative overflow-hidden ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-black/5'}`}>
                      {/* Badge de Lote */}
                      <div className="absolute top-0 right-0 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                        Batch Result #{i + 1}
                      </div>

                      <div className={`prose prose-sm max-w-none w-full 
                        ${isDarkMode 
                          ? 'prose-invert prose-headings:text-blue-400 prose-strong:text-emerald-400 prose-p:text-gray-300 prose-li:text-gray-300' 
                          : 'prose-headings:text-blue-600 prose-strong:text-emerald-600 prose-p:text-gray-600 prose-li:text-gray-600'}
                        prose-headings:font-black prose-headings:tracking-tight
                        prose-p:leading-relaxed prose-p:text-base
                        prose-li:text-base prose-li:font-medium
                        prose-hr:border-black/5 dark:prose-hr:border-white/10`}>
                        <ReactMarkdown 
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-3xl mb-6" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-2xl mt-10 mb-4 flex items-center gap-3 before:w-1.5 before:h-8 before:bg-blue-500 before:rounded-full" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-xl mt-8 mb-3 text-blue-500/80" {...props} />,
                            ul: ({node, ...props}) => <ul className="space-y-4 list-none pl-0" {...props} />,
                            li: ({node, ...props}) => (
                              <li className="flex gap-4 items-start bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 transition-hover hover:scale-[1.01]" {...props}>
                                <div className="mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <div>{props.children}</div>
                              </li>
                            ),
                            p: ({node, ...props}) => <p className="mb-6 last:mb-0" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-black px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500" {...props} />,
                            code: ({node, ...props}) => <code className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md font-mono text-sm" {...props} />,
                            table: () => <div className="hidden" />, // Garante que tabelas não sejam renderizadas
                          }}
                        >
                          {res}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Barra de progresso visual */}
            <div className="w-full h-2 bg-black/5 dark:bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${Math.min((aiState.currentIndex / Math.max(1, aiState.totalItems)) * 100, 100)}%` }}
              />
            </div>
          </Card>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}