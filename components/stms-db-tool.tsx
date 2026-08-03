'use client';

import React, { useState, useEffect, useRef } from 'react';
import { diffWords } from 'diff';
import { 
 RefreshCw, 
 Sparkles, 
 Check, 
 X, 
 AlertCircle, 
 Database, 
 CheckCircle2, 
 Loader2,
 Table as TableIcon,
 Search,
 ArrowRight,
 StopCircle,
 FileText,
 Zap,
 Bot,
 Maximize2,
 Minimize2,
 Calendar,
 Filter,
 ChevronDown,
 ChevronLeft,
 ChevronRight,
 ChevronUp,
 Download,
 Clock,
 Eye,
 EyeOff,
 RotateCcw,
 Trash2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/theme-provider';

interface STMSString {
 id: number;
 excel_row: number;
 context: string;
 source_text: string;
 target_text: string; 
 suggested_text?: string; 
 char_limit: string;
 reason: string;
 simply_reason?: string;
 status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'postponed';
 source_filename: string;
 created_at: string;
 design_type?: string;
 design_id?: string;
}

interface AIReviewResponse {
 suggestion: string;
 reasoning: string;
 simplyReason: string;
}

const translations = {
 pt: {
 total: 'Total',
 pending: 'Pendente',
 reviewing: 'Em Revisão',
 approved: 'Aprovado',
 rejected: 'Rejeitado',
 postponed: 'Adiado',
 syncBtn: 'Sincronizar DB',
 startReviewBtn: 'Iniciar Revisão IA',
 stopReviewBtn: 'Parar Revisão',
 reviewingBtn: 'Revisando Lote...',
 searchPlaceholder: 'Buscar globalmente...',
 fileFilterPlaceholder: 'Filtrar por arquivo ou data...',
 noStrings: 'Nenhuma string encontrada no Banco.',
 runScriptHint: 'Execute sync_excel_bd.py para importar arquivos Excel.',
 row: 'Linha/Arquivo',
 designTypeLabel: 'Design Type',
 sourceLabel: 'Origem (Inglês)',
 targetLabel: 'Texto para revisar',
 aiResultLabel: 'Resultado da IA',
 analysisLabel: 'Análise',
 statusLabel: 'Status',
 approve: 'Aprovar',
 reject: 'Rejeitar',
 postpone: 'Adiar',
 ready: 'Pronto',
 waiting: 'Aguardando',
 analysisTitle: 'Análise Detalhada da IA',
 techReason: 'Motivo Técnico Detalhado',
 shortSummary: 'Resumo da Alteração',
 context: 'Contexto',
 limit: 'Limite',
 close: 'Fechar',
 allFiles: 'Todos os arquivos',
 filesFound: 'arquivos encontrados',
 previous: 'Anterior',
 next: 'Próximo',
 page: 'Página',
 of: 'de',
 exportBtn: 'Exportar Excel',
 preparing: 'Preparando...',
 showContextBtn: 'Contexto',
 undo: 'Desfazer',
 editResultTitle: 'Editar Resultado da IA',
 saveBtn: 'Salvar Alteração',
 cancelBtn: 'Cancelar'
 },
 en: {
 total: 'Total',
 pending: 'Pending',
 reviewing: 'Reviewing',
 approved: 'Approved',
 rejected: 'Rejected',
 postponed: 'Postponed',
 syncBtn: 'Sync DB',
 startReviewBtn: 'Start AI Review',
 stopReviewBtn: 'Stop Review',
 reviewingBtn: 'Reviewing...',
 searchPlaceholder: 'Search globally...',
 fileFilterPlaceholder: 'Filter by file or date...',
 noStrings: 'No strings found in Database.',
 runScriptHint: 'Run sync_excel_bd.py to import your Excel files.',
 row: 'Row/File',
 designTypeLabel: 'Design Type',
 sourceLabel: 'Source (English)',
 targetLabel: 'Text to review',
 aiResultLabel: 'AI Result',
 analysisLabel: 'Analysis',
 statusLabel: 'Status',
 approve: 'Approve',
 reject: 'Reject',
 postpone: 'Postpone',
 ready: 'Ready',
 waiting: 'Waiting',
 analysisTitle: 'Detailed AI Analysis',
 techReason: 'Detailed Technical Reason',
 shortSummary: 'Change Summary',
 context: 'Context',
 limit: 'Limit',
 close: 'Close',
 allFiles: 'All files',
 filesFound: 'files found',
 previous: 'Previous',
 next: 'Next',
 page: 'Page',
 of: 'of',
 exportBtn: 'Export Excel',
 preparing: 'Preparing...',
 showContextBtn: 'Show Context',
 undo: 'Undo',
 editResultTitle: 'Edit AI Result',
 saveBtn: 'Save Changes',
 cancelBtn: 'Cancel'
 },
 ko: {
 total: '전체',
 pending: '대기 중',
 reviewing: '리뷰 중',
 approved: '승인됨',
 rejected: '거부됨',
 postponed: '연기됨',
 syncBtn: 'DB 동기화',
 startReviewBtn: 'AI 리뷰 시작',
 stopReviewBtn: '리뷰 중지',
 reviewingBtn: '리뷰 중...',
 searchPlaceholder: '전체 검색...',
 fileFilterPlaceholder: '파일 또는 날짜별 필터링...',
 noStrings: '데이터베이스에서 문자열을 찾을 수 없습니다.',
 runScriptHint: 'Excel 파일을 가져오려면 sync_excel_bd.py를 실행하세요.',
 row: '행/파일',
 designTypeLabel: 'Design Type',
 sourceLabel: '원본 (영어)',
 targetLabel: '리뷰할 텍스트',
 aiResultLabel: 'AI 결과',
 analysisLabel: '분석',
 statusLabel: '상태',
 approve: '승인',
 reject: '거절',
 postpone: '연기하다',
 ready: '완료',
 waiting: '대기',
 analysisTitle: '상세 AI 분석',
 techReason: '상세 기술적 이유',
 shortSummary: '변경 요약',
 context: '컨텍스트',
 limit: '제한',
 close: '닫기',
 allFiles: '모든 파일',
 filesFound: '파일 찾음',
 previous: '이전',
 next: '다음',
 page: '페이지',
 of: '중',
 exportBtn: 'Excel 내보내기',
 preparing: '준비 중...',
 showContextBtn: '컨텍스트 표시',
 undo: '취소',
 editResultTitle: 'AI 결과 편집',
 saveBtn: '변경 사항 저장',
 cancelBtn: '취소'
 }
};

const getCharLimit = (limitStr: string): number | null => {
 if (!limitStr) return null;
 const match = limitStr.match(/\d+/);
 return match ? parseInt(match[0], 10) : null;
};

export function STMSDBTool({ onFocusChange }: { onFocusChange?: (focused: boolean) => void }) {
 const { isDarkMode } = useTheme();
 const [lang, setLanguage] = useState<'pt' | 'en' | 'ko'>('pt');
 const t = translations[lang];

 const [items, setItems] = useState<STMSString[]>([]);
 const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
 const [isGlobalLoading, setIsGlobalLoading] = useState(false);
 const [isBatchProcessing, setIsBatchProcessing] = useState(false);
 const [isExporting, setIsExporting] = useState(false);
 const [globalSearch, setGlobalSearch] = useState('');
 const [showContext, setShowContext] = useState(false);
 const [showDesignId, setShowDesignId] = useState(false);
 const [isFocusModeState, setIsFocusModeState] = useState(false);
 const isFocusMode = isFocusModeState;

 const setIsFocusMode = (focused: boolean) => {
 setIsFocusModeState(focused);
 if (onFocusChange) onFocusChange(focused);
 };

 useEffect(() => {
 if (isFocusMode) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = 'unset';
 }
 return () => { document.body.style.overflow = 'unset'; };
 }, [isFocusMode]);

 const [fileSearch, setFileSearch] = useState(''); const [selectedFile, setSelectedFile] = useState<string | null>(null);
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 const [selectedItem, setSelectedItem] = useState<STMSString | null>(null);
 const [tempDesignId, setTempDesignId] = useState('');
 
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [tempEditItem, setTempEditItem] = useState<STMSString | null>(null);
 const [editValue, setEditValue] = useState('');

 useEffect(() => {
 if (selectedItem) {
 setTempDesignId(selectedItem.design_id || '');
 }
 }, [selectedItem]);

 const handleSaveDesignId = async () => {
 if (!selectedItem) return;
 try {
 const response = await fetch(`${API_URL}/stms/update_string`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id: selectedItem.id, design_id: tempDesignId })
 });
 if (response.ok) {
 setItems(prev => prev.map(item => item.id === selectedItem.id ? { ...item, design_id: tempDesignId } : item));
 setSelectedItem(prev => prev ? { ...prev, design_id: tempDesignId } : null);
 }
 } catch (error) {
 console.error("Erro ao salvar Design ID:", error);
 }
 };

 const [colFilters, setColFilters] = useState({
 en: '',
 pt: '',
 ai: '',
 analysis: '',
 status: ''
 });

 const [sortConfig, setSortConfig] = useState<{ key: keyof STMSString | null; direction: 'asc' | 'desc' | null }>({ key: 'id', direction: 'asc' });

 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 15;
 
 const isProcessingRef = useRef(false);
 const itemsRef = useRef<STMSString[]>([]);
 const dropdownRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 itemsRef.current = items;
 }, [items]);

 const API_URL = typeof window !== 'undefined' 
 ? `${window.location.protocol}//${window.location.hostname}:8001` 
 : '';

 useEffect(() => {
 const handleStorageChange = () => {
 const savedLang = localStorage.getItem('srmt_lang') as 'pt' | 'en' | 'ko';
 if (savedLang && ['pt', 'en', 'ko'].includes(savedLang)) {
 setLanguage(savedLang);
 }
 };

 handleStorageChange();
 window.addEventListener('storage', handleStorageChange);
 const interval = setInterval(handleStorageChange, 1000);
 
 const handleClickOutside = (event: MouseEvent) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
 setIsDropdownOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 
 return () => {
 window.removeEventListener('storage', handleStorageChange);
 document.removeEventListener('mousedown', handleClickOutside);
 clearInterval(interval);
 };
 }, []);

 useEffect(() => {
 loadData();
 }, []);

 const loadData = async () => {
 setIsGlobalLoading(true);
 try {
 const response = await fetch(`${API_URL}/stms/strings`);
 if (response.ok) {
 const data = await response.json();
 setItems(data);
 } else {
 setItems([]);
 }
 } catch (error) {
 console.error("Erro ao conectar no servidor:", error);
 setItems([]);
 } finally {
 setIsGlobalLoading(false);
 }
 };

 const handleExportExcel = async () => {
 if (items.length === 0) return;
 setIsExporting(true);
 try {
 const response = await fetch(`${API_URL}/stms/export_excel`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ items: items }) 
 });
 if (!response.ok) throw new Error('Falha ao exportar excel');
 
 const data = await response.json();
 const byteCharacters = atob(data.excel_base64);
 const byteNumbers = new Array(byteCharacters.length);
 for (let i = 0; i < byteCharacters.length; i++) {
 byteNumbers[i] = byteCharacters.charCodeAt(i);
 }
 const byteArray = new Uint8Array(byteNumbers);
 const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
 const url = window.URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = data.filename;
 a.click();
 window.URL.revokeObjectURL(url);
 } catch (error) {
 console.error('Erro ao exportar:', error);
 alert('Erro ao gerar planilha.');
 } finally {
 setIsExporting(false);
 }
 };

 const uniqueFiles = Array.from(new Set(items.map(i => i.source_filename))).sort();
 const uniqueDates = Array.from(new Set(items.map(i => i.created_at?.split('T')[0]))).filter(Boolean).sort().reverse();

 const autocompleteOptions = [
 ...uniqueFiles.map(f => ({ label: f, type: 'file' as const })),
 ...uniqueDates.map(d => ({ label: d, type: 'date' as const }))
 ].filter(opt => 
 opt.label.toLowerCase().includes(fileSearch.toLowerCase())
 );

 const processBatch = async () => {
 if (!isProcessingRef.current) {
 setIsBatchProcessing(false);
 return;
 }

 const pending = itemsRef.current.filter(i => {
 const isPending = i.status === 'pending';
 const matchesFile = selectedFile ? (i.source_filename === selectedFile || i.created_at?.startsWith(selectedFile)) : true;
 return isPending && matchesFile;
 });
 
 if (pending.length === 0) {
 setIsBatchProcessing(false);
 isProcessingRef.current = false;
 return;
 }

 const batchSize = 15;
 const batch = pending.slice(0, batchSize);

 setLoadingIds(prev => {
 const next = new Set(prev);
 batch.forEach(item => next.add(item.id));
 return next;
 });

 try {
 await Promise.all(batch.map(async (item) => {
 try {
 const payload = {
 id: item.id,
 context: item.context,
 source_text: item.source_text,
 target_text: item.target_text,
 char_limit: item.char_limit
 };

 const response = await fetch(`${API_URL}/stms/review_ai`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(payload)
 });
 
 if (response.ok) {
 const data: AIReviewResponse = await response.json();
 setItems(prev => prev.map(p => 
 p.id === item.id 
 ? { ...p, suggested_text: data.suggestion, reason: data.reasoning, simply_reason: data.simplyReason, status: 'reviewing' }
 : p
 ));
 }
 } catch (e) {
 console.error(`Erro no item ${item.id}:`, e);
 } finally {
 setLoadingIds(prev => {
 const next = new Set(prev);
 next.delete(item.id);
 return next;
 });
 }
 }));

 if (isProcessingRef.current) {
 setTimeout(processBatch, 500);
 }
 } catch (error) {
 console.error("Erro fatal no lote:", error);
 setIsBatchProcessing(false);
 isProcessingRef.current = false;
 }
 };

 const runAIReview = () => {
 if (isBatchProcessing) {
 setIsBatchProcessing(false);
 isProcessingRef.current = false;
 return;
 }

 const hasPending = items.some(i => {
 const matchesFile = selectedFile ? (i.source_filename === selectedFile || i.created_at?.startsWith(selectedFile)) : true;
 return i.status === 'pending' && matchesFile;
 });
 
 if (!hasPending) return;

 setIsBatchProcessing(true);
 isProcessingRef.current = true;
 processBatch();
 };

 const handleApprove = async (e: React.MouseEvent, id: number) => {
 e.stopPropagation();
 try {
 const response = await fetch(`${API_URL}/stms/approve_string`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id })
 });
 if (response.ok) {
 setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
 }
 } catch (error) {
 console.error("Erro ao aprovar:", error);
 }
 };

 const handleReject = async (e: React.MouseEvent, id: number) => {
 e.stopPropagation();
 try {
 const response = await fetch(`${API_URL}/stms/reject_string`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id })
 });
 if (response.ok) {
 setItems(prev => prev.map(item => 
 item.id === id 
 ? { ...item, status: 'rejected', suggested_text: item.target_text } 
 : item
 ));
 } else {
 alert("Erro ao rejeitar no servidor.");
 }
 } catch (error) {
 console.error("Erro ao rejeitar:", error);
 }
 };

 const handlePostpone = async (e: React.MouseEvent, id: number) => {
 e.stopPropagation();
 try {
 const response = await fetch(`${API_URL}/stms/postpone_string`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id })
 });
 if (response.ok) {
 setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'postponed' } : item));
 } else {
 alert("Erro ao adiar no servidor.");
 }
 } catch (error) {
 console.error("Erro ao adiar:", error);
 }
 };

 const handleUpdate = async (id: number, newValue: string) => {
 try {
 const response = await fetch(`${API_URL}/stms/update_string`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id, suggested_text: newValue })
 });
 if (response.ok) {
 setItems(prev => prev.map(item => item.id === id ? { ...item, suggested_text: newValue, status: 'reviewing' } : item));
 setIsEditModalOpen(false);
 setTempEditItem(null);
 } else {
 alert("Erro ao salvar no servidor.");
 }
 } catch (error) {
 console.error("Erro ao atualizar:", error);
 }
 };

 const handleUndo = async (e: React.MouseEvent, id: number) => {
 e.stopPropagation();
 try {
 const response = await fetch(`${API_URL}/stms/undo_string`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id })
 });
 if (response.ok) {
 setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'reviewing' } : item));
 } else {
 alert("Erro ao desfazer no servidor.");
 }
 } catch (error) {
 console.error("Erro ao desfazer:", error);
 }
 };

 const handleDeleteFile = async (e: React.MouseEvent, filename: string) => {
 e.stopPropagation();
 if (!confirm(`Deseja realmente deletar TODAS as strings do arquivo "${filename}" do banco de dados? Esta ação não pode ser desfeita.`)) {
 return;
 }
 
 try {
 const response = await fetch(`${API_URL}/stms/delete_file`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ filename })
 });
 
 if (response.ok) {
 setItems(prev => prev.filter(item => item.source_filename !== filename));
 if (selectedFile === filename) {
 setSelectedFile(null);
 setFileSearch('');
 }
 setIsDropdownOpen(false);
 } else {
 alert("Erro ao deletar arquivo no servidor.");
 }
 } catch (error) {
 console.error("Erro ao deletar arquivo:", error);
 }
 };

 const handleSort = (key: keyof STMSString) => {
 let direction: 'asc' | 'desc' = 'asc';
 if (sortConfig.key === key && sortConfig.direction === 'asc') {
 direction = 'desc';
 }
 setSortConfig({ key, direction });
 };

 const filteredAndSortedItems = items.filter(item => {
 const matchesGlobal = globalSearch === '' || 
 item.source_text.toLowerCase().includes(globalSearch.toLowerCase()) ||
 item.target_text.toLowerCase().includes(globalSearch.toLowerCase()) ||
 (item.suggested_text || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
 (item.simply_reason || '').toLowerCase().includes(globalSearch.toLowerCase());
 
 const matchesFile = selectedFile ? (item.source_filename === selectedFile || item.created_at?.startsWith(selectedFile)) : true;
 
 const matchesEn = item.source_text.toLowerCase().includes(colFilters.en.toLowerCase());
 const matchesPt = item.target_text.toLowerCase().includes(colFilters.pt.toLowerCase());
 const matchesAi = (item.suggested_text || '').toLowerCase().includes(colFilters.ai.toLowerCase());
 const matchesAnalysis = (item.simply_reason || '').toLowerCase().includes(colFilters.analysis.toLowerCase());
 const matchesStatus = colFilters.status === '' || item.status === colFilters.status;
 
 return matchesGlobal && matchesFile && matchesEn && matchesPt && matchesAi && matchesAnalysis && matchesStatus;
 }).sort((a, b) => {
 if (!sortConfig.key || !sortConfig.direction) return 0;
 const key = sortConfig.key;
 
 if (key === 'excel_row' || key === 'id') {
 const valA = Number(a[key]) || 0;
 const valB = Number(b[key]) || 0;
 if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
 if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
 return 0;
 }

 const valA = String(a[key] || '').toLowerCase();
 const valB = String(b[key] || '').toLowerCase();
 
 if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
 if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
 return 0;
 });

 const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
 const currentItems = filteredAndSortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 useEffect(() => {
 setCurrentPage(1);
 }, [globalSearch, selectedFile, colFilters]);

 const renderDiff = (original: string, suggested?: string) => {
 if (!suggested || original === suggested) return <span className="font-bold opacity-90">{suggested || original}</span>;
 
 const diff = diffWords(original.trim(), suggested.trim());
 return (
 <span className="font-bold break-words leading-relaxed">
 {diff.map((part, i) => {
 if (part.removed) return null;
 const isDifferent = part.added;
 return (
 <span 
 key={i} 
 className={isDifferent ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1 rounded-sm mx-0.5 border-b border-blue-500/30' : 'opacity-70'}
 >
 {part.value}
 </span>
 );
 })}
 </span>
 );
 };

 const stats = {
 total: filteredAndSortedItems.length,
 pending: filteredAndSortedItems.filter(i => i.status === 'pending').length,
 reviewing: filteredAndSortedItems.filter(i => i.status === 'reviewing').length,
 approved: filteredAndSortedItems.filter(i => i.status === 'approved').length,
 rejected: filteredAndSortedItems.filter(i => i.status === 'rejected').length,
 postponed: filteredAndSortedItems.filter(i => i.status === 'postponed').length,
 };

 return (
 <div className={`w-full space-y-8 animate-in fade-in duration-700 pb-20 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} ${isFocusMode ? 'relative z-[1000]' : ''}`}>
 
 {/* Stats Bar */}
 <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
 {[
 { label: t.total, value: stats.total, color: 'text-slate-500' },
 { label: t.pending, value: stats.pending, color: 'text-slate-400' },
 { label: t.reviewing, value: stats.reviewing, color: 'text-blue-500' },
 { label: t.approved, value: stats.approved, color: 'text-blue-600' },
 { label: t.rejected, value: stats.rejected, color: 'text-slate-600' },
 { label: t.postponed, value: stats.postponed, color: 'text-slate-500' },
 ].map((stat, i) => (
  <Card key={i} className={`p-4 border shadow-sm backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 text-gray-100' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 text-gray-900'} rounded-xl flex flex-col items-center justify-center transition-all duration-500 hover:shadow-xl`}>
 <span className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
 <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-20 mt-1">{stat.label}</span>
 </Card>
 ))}
 </div>

 {/* Main Filter Bar */}
 <Card className={`relative z-50 p-4 rounded-xl border shadow-2xl transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-black/40 text-gray-100' : 'bg-white/60 border-slate-200 shadow-slate-200/50 text-gray-900'}`}>
 <div className="flex flex-col lg:flex-row gap-3 items-center mb-4">
 <div className="flex gap-2 w-full lg:w-auto">
 <Button onClick={loadData} disabled={isGlobalLoading || isBatchProcessing} variant="ghost" className={`rounded-xl h-12 px-7 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-50 border-black/5 hover:bg-gray-100 shadow-sm'}`}>
 <RefreshCw size={14} className={`mr-3 ${isGlobalLoading ? "animate-spin" : ""}`} />
 {t.syncBtn}
 </Button>
 <Button 
 onClick={runAIReview} 
 disabled={stats.pending === 0 && !isBatchProcessing} 
 className={`rounded-xl h-12 px-9 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
 isBatchProcessing 
 ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30' 
 : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/40'
 }`}
 >
 {isBatchProcessing ? (
 <><StopCircle size={14} className="mr-3" /> {t.stopReviewBtn}</>
 ) : (
 <><Sparkles size={14} className="mr-3" /> {t.startReviewBtn}</>
 )}
 </Button>
 </div>

 <div className="relative flex-1 w-full" ref={dropdownRef}>
 <div className={`flex items-center rounded-xl border transition-all duration-500 h-12 px-6 
 ${isDarkMode ? 'bg-white/[0.04] border-white/5 focus-within:border-blue-500/50' : 'bg-gray-50 border-black/5 focus-within:border-blue-500/30'}`}>
 <Filter className="w-3.5 h-3.5 opacity-30 shrink-0" />
 <input 
 type="text"
 value={fileSearch}
 onFocus={() => setIsDropdownOpen(true)}
 onChange={(e) => {
 setFileSearch(e.target.value);
 setIsDropdownOpen(true);
 if (!e.target.value) setSelectedFile(null);
 }}
 placeholder={t.fileFilterPlaceholder}
 className="flex-1 bg-transparent border-none outline-none px-4 text-xs font-black tracking-tight placeholder:font-bold placeholder:opacity-20"
 />
 {selectedFile && (
 <button onClick={() => { setSelectedFile(null); setFileSearch(''); }} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
 <X size={12} className="opacity-30" />
 </button>
 )}
 <div className="w-px h-5 bg-current opacity-10 mx-3" />
 <ChevronDown className={`w-4 h-4 opacity-20 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
 </div>

 {isDropdownOpen && (
 <div className={`absolute left-0 right-0 top-full mt-4 rounded-xl border overflow-hidden z-[100] shadow-[0_64px_96px_-12px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-top-4 duration-500
 ${isDarkMode ? 'bg-[#0a0a0a]/98 border-white/10 backdrop-blur-3xl' : 'bg-white/98 border-gray-100 backdrop-blur-3xl'}`}>
 <div className="max-h-80 overflow-y-auto custom-scrollbar p-3">
 <button 
 onClick={() => { setSelectedFile(null); setFileSearch(''); setIsDropdownOpen(false); }}
 className={`w-full text-left px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-5 transition-all
 ${!selectedFile ? (isDarkMode ? 'bg-blue-600/30 text-blue-400' : 'bg-blue-50 text-blue-600 shadow-sm') : (isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400')}`}
 >
 <Database size={16} className="opacity-40" /> {t.allFiles}
 </button>
 <div className="h-px bg-current opacity-5 my-2 mx-4" />
 {autocompleteOptions.map((opt, i) => (
 <div 
 key={i}
 className={`w-full text-left px-8 py-3.5 rounded-xl text-[13px] flex items-center justify-between transition-all group/item
 ${selectedFile === opt.label ? (isDarkMode ? 'bg-blue-600/30 text-blue-400' : 'bg-blue-50 text-blue-600 shadow-sm') : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50')}`}
 >
 <button 
 onClick={() => { setSelectedFile(opt.label); setFileSearch(opt.label); setIsDropdownOpen(false); }}
 className="flex items-center gap-5 truncate mr-4 flex-1 text-left font-black tracking-tight opacity-60 group-hover:opacity-100 group-hover:text-blue-500 transition-all"
 >
 {opt.type === 'file' ? <FileText size={16} className="opacity-30" /> : <Calendar size={16} className="opacity-30" />}
 <span className="truncate">{opt.label}</span>
 </button>
 <div className="flex items-center gap-4 shrink-0">
 <span className="text-[9px] font-black uppercase opacity-20 tracking-[0.25em]">{opt.type}</span>
 {opt.type === 'file' && (
 <button 
 onClick={(e) => handleDeleteFile(e, opt.label)}
 className="p-2.5 rounded-xl bg-rose-500/0 hover:bg-rose-500/10 text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all"
 title="Deletar arquivo do banco"
 >
 <Trash2 size={14} />
 </button>
 )}
 </div>
 </div>
 ))}
 </div>
 <div className="px-10 py-4 border-t border-black/5 dark:border-white/5 bg-black/[0.03] dark:bg-white/[0.03]">
 <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">{autocompleteOptions.length} {t.filesFound}</p>
 </div>
 </div>
 )}
 </div>

 <div className="flex gap-2 w-full lg:w-auto">
 <Button 
 onClick={() => setShowDesignId(!showDesignId)} 
 variant="outline"
 className={`rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${showDesignId ? (isDarkMode ? 'bg-blue-600/10 text-blue-400 border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-blue-50 text-blue-600 border-blue-200 shadow-xl shadow-blue-600/5') : (isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-50 border-black/5 hover:bg-gray-100')}`}
 >
 {showDesignId ? <EyeOff size={14} className="mr-3" /> : <Eye size={14} className="mr-3" />}
 ID
 </Button>
 <Button 
 onClick={() => setShowContext(!showContext)} 
 variant="outline"
 className={`rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${showContext ? (isDarkMode ? 'bg-blue-600/10 text-blue-400 border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-blue-50 text-blue-600 border-blue-200 shadow-xl shadow-blue-600/5') : (isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5')}`}
 >
 {showContext ? <EyeOff size={14} className="mr-3" /> : <Eye size={14} className="mr-3" />}
 Ctx
 </Button>
 <Button 
 onClick={() => setIsFocusMode(!isFocusMode)} 
 variant="outline"
 className={`rounded-xl h-12 w-12 p-0 transition-all ${isFocusMode ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-600/40' : (isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-50 border-black/5 hover:bg-gray-100 shadow-sm')}`}
 title={isFocusMode ? "Sair do Modo Foco" : "Modo Foco (Tela Cheia)"}
 >
 {isFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
 </Button>
 <Button 
 onClick={handleExportExcel} 
 disabled={isExporting || items.length === 0}
 className={`rounded-xl h-12 w-12 p-0 shadow-2xl transition-all flex items-center justify-center bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-500`}
 title={t.exportBtn}
 >
 {isExporting ? <Loader2 className="animate-spin w-5 h-5" /> : <Download size={18} />}
 </Button>
 </div>
 </div>

 <div className="relative w-full">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
 <Input 
 value={globalSearch} 
 onChange={(e) => setGlobalSearch(e.target.value)} 
 placeholder={t.searchPlaceholder} 
 className={`pl-14 rounded-xl border-none h-12 text-sm font-black tracking-tight placeholder:font-bold placeholder:opacity-20 transition-all ${isDarkMode ? 'bg-white/[0.04] focus:bg-white/[0.08]' : 'bg-black/[0.04] focus:bg-black/[0.06] shadow-inner'}`} 
 />
 </div>
 </Card>

 {/* RESULTS TABLE */}
 <Card className={`p-1 transition-all duration-700 flex flex-col overflow-hidden backdrop-blur-2xl
 ${isFocusMode 
 ? 'fixed inset-0 z-[0] rounded-none border-none bg-background' 
 : 'rounded-xl border border-white/5 dark:border-white/5 shadow-2xl shadow-black/40'
 }
 ${isDarkMode ? 'bg-[#111]/40 text-gray-100' : 'bg-white/60 text-gray-900'}
 `}>
 {isFocusMode && (
 <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-100 border-black/5'}`}>
 <div className="flex items-center gap-3">
 <TableIcon className="w-5 h-5 text-blue-500" />
 <h3 className="font-bold uppercase tracking-widest text-xs">Modo Foco Ativado</h3>
 </div>
 <Button 
 onClick={() => setIsFocusMode(false)} 
 variant="ghost" 
 size="sm" 
 className="rounded-lg h-9 px-4 font-bold bg-blue-600/10 text-blue-600 hover:bg-blue-600/20"
 >
 <Minimize2 className="w-4 h-4 mr-2" /> Sair do Foco
 </Button>
 </div>
 )}
 
 <div className={`overflow-x-auto custom-scrollbar flex-1 ${!isFocusMode ? 'rounded-t-2xl' : ''}`}>
 <table className="w-full text-left text-[13px]">
 <thead className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} border-b border-black/5 dark:border-white/5`}>
 {/* Row 1: Headers & Sort */}
 <tr>
 <th className="p-4 min-w-[120px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('excel_row')}>
 <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
 Row
 {sortConfig.key === 'excel_row' && (sortConfig.direction === 'asc' ? <ChevronUp size={10}/> : <ChevronDown size={10}/>)}
 </div>
 </th>
 {showContext && (
 <th className="p-4 min-w-[280px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('context')}>
 <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
 {t.context}
 {sortConfig.key === 'context' && (sortConfig.direction === 'asc' ? <ChevronUp size={10}/> : <ChevronDown size={10}/>)}
 </div>
 </th>
 )}
 {showDesignId && (
 <th className="p-4 min-w-[220px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('design_id')}>
 <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
 Design ID
 {sortConfig.key === 'design_id' && (sortConfig.direction === 'asc' ? <ChevronUp size={10}/> : <ChevronDown size={10}/>)}
 </div>
 </th>
 )}
 <th className="p-4 min-w-[120px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('design_type')}>
 <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
 Type
 {sortConfig.key === 'design_type' && (sortConfig.direction === 'asc' ? <ChevronUp size={10}/> : <ChevronDown size={10}/>)}
 </div>
 </th>
 <th className="p-4 min-w-[150px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('source_text')}>
 <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
 {t.sourceLabel}
 {sortConfig.key === 'source_text' && (sortConfig.direction === 'asc' ? <ChevronUp size={10}/> : <ChevronDown size={10}/>)}
 </div>
 </th>
 <th className="p-4 min-w-[200px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('target_text')}>
 <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
 {t.targetLabel}
 {sortConfig.key === 'target_text' && (sortConfig.direction === 'asc' ? <ChevronUp size={10}/> : <ChevronDown size={10}/>)}
 </div>
 </th>
 <th className="p-4 min-w-[200px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('suggested_text')}>
 <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">
 AI Suggestion
 {sortConfig.key === 'suggested_text' && (sortConfig.direction === 'asc' ? <ChevronUp size={10}/> : <ChevronDown size={10}/>)}
 </div>
 </th>
 <th className="p-4 min-w-[150px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('simply_reason')}>
 <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">
 Analysis
 {sortConfig.key === 'simply_reason' && (sortConfig.direction === 'asc' ? <ChevronUp size={10}/> : <ChevronDown size={10}/>)}
 </div>
 </th>
 <th className="p-4 min-w-[120px] text-right cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('status')}>
 <div className="flex items-center justify-end gap-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
 {t.statusLabel}
 {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <ChevronUp size={10}/> : <ChevronDown size={10}/>)}
 </div>
 </th>
 </tr>
 {/* Row 2: Column Filters */}
 <tr className="border-t border-black/5 dark:border-white/5">
 <th className="p-3"></th>
 {showContext && <th className="p-3"></th>}
 {showDesignId && <th className="p-3"></th>}
 <th className="p-3"></th>
 <th className="p-3">
 <select 
 value={colFilters.en} 
 onChange={e => setColFilters(p => ({...p, en: e.target.value}))}
 className={`w-full h-9 px-3 rounded-xl text-[11px] font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
 >
 <option value="">Todos</option>
 {Array.from(new Set(items.map(i => i.source_text || ''))).filter(val => val !== '').sort().map(val => (
 <option key={val} value={val}>{String(val).substring(0, 50)}{String(val).length > 50 ? '...' : ''}</option>
 ))}
 </select>
 </th>
 <th className="p-3">
 <select 
 value={colFilters.pt} 
 onChange={e => setColFilters(p => ({...p, pt: e.target.value}))}
 className={`w-full h-9 px-3 rounded-xl text-[11px] font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
 >
 <option value="">Todos</option>
 {Array.from(new Set(items.map(i => i.target_text || ''))).filter(val => val !== '').sort().map(val => (
 <option key={val} value={val}>{String(val).substring(0, 50)}{String(val).length > 50 ? '...' : ''}</option>
 ))}
 </select>
 </th>
 <th className="p-3">
 <select 
 value={colFilters.ai} 
 onChange={e => setColFilters(p => ({...p, ai: e.target.value}))}
 className={`w-full h-9 px-3 rounded-xl text-[11px] font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
 >
 <option value="">Todos</option>
 {Array.from(new Set(items.map(i => i.suggested_text || ''))).filter(val => val !== '').sort().map(val => (
 <option key={val} value={val}>{String(val).substring(0, 50)}{String(val).length > 50 ? '...' : ''}</option>
 ))}
 </select>
 </th>
 <th className="p-3">
 <select 
 value={colFilters.analysis} 
 onChange={e => setColFilters(p => ({...p, analysis: e.target.value}))}
 className={`w-full h-9 px-3 rounded-xl text-[11px] font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
 >
 <option value="">Todos</option>
 {Array.from(new Set(items.map(i => i.simply_reason || ''))).filter(val => val !== '').sort().map(val => (
 <option key={val} value={val}>{String(val).substring(0, 50)}{String(val).length > 50 ? '...' : ''}</option>
 ))}
 </select>
 </th>
 <th className="p-3">
 <select 
 value={colFilters.status} 
 onChange={e => setColFilters(p => ({...p, status: e.target.value}))}
 className={`w-full h-9 px-3 rounded-xl text-[11px] font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
 >
 <option value="">Todos</option>
 <option value="pending">Pendente</option>
 <option value="reviewing">Revisando</option>
 <option value="approved">Aprovado</option>
 <option value="rejected">Rejeitado</option>
 <option value="postponed">Adiado</option>
 </select>
 </th>
 </tr>
 </thead>
 
 <tbody className="divide-y divide-black/5 dark:divide-white/5">
 {currentItems.length === 0 ? (
 <tr>
 <td colSpan={showContext ? 8 : 7} className="p-20 text-center opacity-40 font-bold text-lg">
 Nenhum resultado corresponde aos filtros.
 </td>
 </tr>
 ) : (
 currentItems.map((item) => (
 <tr 
 key={item.id} 
 onClick={() => setSelectedItem(item)}
 onDoubleClick={(e) => {
 e.stopPropagation();
 setSelectedItem(null);
 setTempEditItem(item);
 setEditValue(item.suggested_text || item.target_text);
 setIsEditModalOpen(true);
 }}
 className={`transition-all duration-300 group hover:bg-blue-500/[0.04] cursor-pointer border-l-4 border-transparent hover:shadow-lg hover:shadow-black/5 
 ${item.status === 'reviewing' ? 'border-l-blue-500/40 bg-blue-500/[0.01]' : ''}
 ${item.status === 'approved' ? 'border-l-blue-600/40 bg-blue-600/[0.01]' : ''}
 ${item.status === 'rejected' ? 'border-l-slate-500/40 bg-slate-500/[0.01]' : ''}
 ${item.status === 'postponed' ? 'border-l-slate-400/40 bg-slate-400/[0.01]' : ''}
 `}
 >
 <td className="px-4 py-3 align-top max-w-[120px]">
   <div className="flex flex-col gap-1">
     <span className="text-[11px] font-black tracking-tighter text-blue-600 dark:text-blue-400 uppercase">Row {item.excel_row}</span>
     <span className="text-[10px] truncate w-full block opacity-40 font-medium" title={item.source_filename}>{item.source_filename}</span>
   </div>
 </td>
 {showContext && (
   <td className="px-4 py-3 align-top max-w-[400px]">
   {item.context ? (
     <div className={`text-[11px] font-mono px-3 py-2 rounded-xl break-words border leading-relaxed transition-all
       ${isDarkMode ? 'bg-white/[0.03] border-white/5 text-white/50 group-hover:text-white/70' : 'bg-gray-50 border-black/5 text-gray-500 group-hover:text-gray-700'}`}>
       {item.context}
     </div>
   ) : (
     <span className="opacity-20">-</span>
   )}
 </td>
 )}
 {showDesignId && (
 <td className="px-4 py-3 align-top max-w-[300px]">
   {item.design_id ? (
     <div className={`text-[11px] font-mono px-3 py-2 rounded-xl break-words border leading-relaxed transition-all
       ${isDarkMode ? 'bg-blue-500/[0.03] border-blue-500/10 text-blue-400/60 group-hover:text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600/60 group-hover:text-blue-600'}`}>
       {item.design_id}
     </div>
   ) : (
     <span className="opacity-20">-</span>
   )}
 </td>
 )}
 <td className="px-4 py-3 align-top max-w-[120px]">
 {item.design_type ? (
   <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all
     ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-500 group-hover:text-gray-300' : 'bg-gray-50 border-black/5 text-gray-400 group-hover:text-gray-600'}`}>
     {item.design_type}
   </div>
 ) : (
   <span className="opacity-20">-</span>
 )}
 </td>
 <td className="px-4 py-3 align-top max-w-[200px]">
   <div className={`font-bold text-[14px] leading-snug ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.source_text}</div>
 </td>
 <td className="px-4 py-3 align-top max-w-[200px]">
   <div className={`leading-relaxed text-[14px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.target_text}</div>
 </td>
 <td className="px-4 py-3 align-top max-w-[250px] relative group"> <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
 <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 shadow-sm" onClick={(e) => {
 e.stopPropagation();
 setSelectedItem(null);
 setTempEditItem(item);
 setEditValue(item.suggested_text || item.target_text);
 setIsEditModalOpen(true);
 }}>
 <Maximize2 size={14} />
 </Button>
 </div>
 <div className={`h-full text-[14px] font-black tracking-tight leading-relaxed ${item.status === 'reviewing' ? 'text-blue-600 dark:text-blue-400' : ''}`}>
 {renderDiff(item.target_text, item.suggested_text)}
 </div>
 {(() => {
 const limit = getCharLimit(item.char_limit);
 if (!limit) return null;
 const current = (item.suggested_text || item.target_text || '').length;
 return (
 <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest border border-current transition-colors
 ${current > limit ? 'bg-rose-500/10 text-rose-500' : 'opacity-30'}`}>
 <span>{current}</span>
 <span>/</span>
 <span>{limit}</span>
 </div>
 );
 })()}
 </td>
 <td className="p-5 align-top max-w-[150px]">
 {item.simply_reason ? (
 <div className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-[0.15em] inline-block leading-none transition-all
 ${isDarkMode ? 'bg-blue-500/[0.05] border-blue-500/20 text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/40' : 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-100 group-hover:border-blue-200 shadow-sm'}`}>
 {item.simply_reason}
 </div>
 ) : (
 <div className="flex items-center gap-2 opacity-20 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
 <Clock size={12}/> {t.waiting}
 </div>
 )}
 </td>
 <td className="p-5 align-top w-[140px] text-right">
 {(item.status === 'reviewing' || item.status === 'postponed') && (
 <div className="flex flex-col gap-2 transition-all duration-500">
 <Button onClick={(e) => handleApprove(e, item.id)} className="h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-[0.15em] gap-2 w-full bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 border-none shadow-sm transition-all ">
 <Check size={14} /> {t.approve}
 </Button>
 <Button onClick={(e) => handleReject(e, item.id)} variant="ghost" className="h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-[0.15em] gap-2 w-full bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20 border-none transition-all ">
 <X size={14} /> {t.reject}
 </Button>
 {item.status === 'reviewing' && (
 <Button onClick={(e) => handlePostpone(e, item.id)} variant="ghost" className="h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-[0.15em] gap-2 w-full bg-slate-400/10 text-slate-500 dark:text-slate-500 hover:bg-slate-400/20 border-none transition-all ">
 <Clock size={14} /> {t.postpone}
 </Button>
 )}
 </div>
 )}
 {(item.status === 'approved' || item.status === 'rejected' || item.status === 'postponed') && (
 <div className="flex flex-col gap-2 mt-2 transition-all duration-500">
 {item.status === 'approved' && (
 <div className="flex items-center justify-end gap-2 text-blue-500 mb-1">
 <CheckCircle2 size={16} className="animate-in zoom-in duration-500" />
 <span className="text-[10px] font-black uppercase tracking-[0.25em]">{t.approved}</span>
 </div>
 )}
 {item.status === 'rejected' && (
 <div className="flex items-center justify-end gap-2 text-slate-500 mb-1">
 <X size={16} className="animate-in zoom-in duration-500" />
 <span className="text-[10px] font-black uppercase tracking-[0.25em]">{t.rejected}</span>
 </div>
 )}
 {item.status === 'postponed' && (
 <div className="flex items-center justify-end gap-2 text-slate-400 mb-1">
 <Clock size={16} className="animate-in zoom-in duration-500" />
 <span className="text-[10px] font-black uppercase tracking-[0.25em]">{t.postponed}</span>
 </div>
 )}
 <Button onClick={(e) => handleUndo(e, item.id)} variant="outline" className="h-7 rounded-xl px-4 text-[9px] font-black uppercase tracking-[0.2em] gap-1.5 w-full border-blue-500/20 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-all opacity-40 hover:opacity-100">
 <RotateCcw size={10} /> {t.undo}
 </Button>
 </div>
 )}
 {item.status === 'pending' && (
 <div className={`flex items-center justify-end gap-1.5 text-[11px] font-black uppercase tracking-widest ${loadingIds.has(item.id) ? 'text-blue-600 dark:text-blue-400' : 'opacity-40'}`}>
 {loadingIds.has(item.id) ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
 {loadingIds.has(item.id) ? t.reviewingBtn : t.waiting}
 </div>
 )}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination Controls Bottom (Inside Card for Focus Mode) */}
 {totalPages > 1 && (
 <div className={`flex justify-center items-center gap-4 py-4 border-t border-black/5 dark:border-white/5 ${isFocusMode ? 'bg-black/5 dark:bg-white/5' : ''}`}>
 <Button 
 variant="ghost" 
 size="sm" 
 onClick={() => {
 setCurrentPage(prev => Math.max(1, prev - 1));
 if (!isFocusMode) window.scrollTo({ top: 0, behavior: 'smooth' });
 }}
 disabled={currentPage === 1}
 className="rounded-lg h-10 w-10 p-0 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-20"
 >
 <ChevronLeft size={20} />
 </Button>
 <div className="flex items-center gap-2">
 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
 let pageNum;
 if (totalPages <= 5) pageNum = i + 1;
 else if (currentPage <= 3) pageNum = i + 1;
 else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
 else pageNum = currentPage - 2 + i;

 return (
 <Button
 key={pageNum}
 variant="ghost"
 size="sm"
 onClick={() => {
 setCurrentPage(pageNum);
 if (!isFocusMode) window.scrollTo({ top: 0, behavior: 'smooth' });
 }}
 className={`h-8 w-8 rounded-xl font-bold text-[11px] transition-all duration-300
 ${currentPage === pageNum 
 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
 : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-40 hover:opacity-100'}`}
 >
 {pageNum}
 </Button>
 );
 })}
 </div>
 <Button 
 variant="ghost" 
 size="sm" 
 onClick={() => {
 setCurrentPage(prev => Math.min(totalPages, prev + 1));
 if (!isFocusMode) window.scrollTo({ top: 0, behavior: 'smooth' });
 }}
 disabled={currentPage === totalPages}
 className="rounded-lg h-10 w-10 p-0 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-20"
 >
 <ChevronRight size={20} />
 </Button>
 </div>
 )}
 </Card>

 {/* Pagination Controls Bottom (Old location removed) */}

 {/* Modal de Análise Detalhada */}
 {selectedItem && (
 <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedItem(null)}>
 <Card className={`w-full max-w-2xl overflow-hidden rounded-xl border shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#0a0a0a] border-white/10 text-white backdrop-blur-3xl' : 'bg-white border-black/5 text-gray-900'}`} onClick={e => e.stopPropagation()}>
 <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
 <Bot className="w-5 h-5" />
 </div>
 <h2 className="text-xl font-bold tracking-tight">{t.analysisTitle}</h2>
 </div>
 <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)} className="rounded-lg h-8 w-8 p-0"><X className="w-5 h-5" /></Button>
 </div>

 <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className={`p-6 rounded-xl border transition-all duration-500 hover:shadow-lg ${isDarkMode ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-gray-50 border-black/5 hover:bg-white'}`}>
 <div className="flex items-center gap-2 opacity-30 mb-4">
 <FileText size={14} />
 <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.sourceLabel}</span>
 </div>
 <p className="text-sm font-bold leading-relaxed">{selectedItem.source_text}</p>
 </div>
 <div className={`p-6 rounded-xl border transition-all duration-500 hover:shadow-lg ${isDarkMode ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-gray-50 border-black/5 hover:bg-white'}`}>
 <div className="flex items-center gap-2 opacity-30 mb-4">
 <CheckCircle2 size={14} />
 <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.targetLabel}</span>
 </div>
 <p className="text-sm font-medium mb-6 opacity-60 italic">{selectedItem.target_text}</p>
 <div className="h-px bg-current opacity-10 w-full mb-6" />
 <div className="flex items-center gap-2 text-blue-500 mb-4">
 <Sparkles size={14} className="animate-pulse" />
 <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.aiResultLabel}</span>
 </div>
 <div className="text-sm font-black leading-relaxed tracking-tight">
 {renderDiff(selectedItem.target_text, selectedItem.suggested_text)}
 </div>
 </div>
 </div>

 <div className="space-y-6">
 <div className="flex flex-col md:flex-row gap-6">
 <div className="flex-1 space-y-2">
 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
 Design ID
 </label>
 <div className="flex gap-2">
 <Input 
 value={tempDesignId}
 onChange={(e) => setTempDesignId(e.target.value)}
 className={`flex-1 rounded-xl h-11 border focus:ring-4 focus:ring-zinc-500/20 outline-none transition-all
 ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
 placeholder="Insira o Design ID..."
 />
 <Button 
 onClick={handleSaveDesignId}
 variant="outline"
 className="rounded-xl h-11 px-6 font-bold border-zinc-500/30 hover:bg-zinc-500/10 transition-all "
 >
 Salvar
 </Button>
 </div>
 </div>
 
 {selectedItem.char_limit && (
 <div className="space-y-2 w-full md:w-32">
 <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block">Limite</label>
 {(() => {
 const limit = getCharLimit(selectedItem.char_limit);
 const current = (selectedItem.suggested_text || selectedItem.target_text || '').length;
 return (
 <div className={`h-11 flex items-center px-4 rounded-xl text-[13px] font-mono border transition-colors
 ${isDarkMode ? 'bg-white/10 border-white/5 text-white/80' : 'bg-gray-100 border-black/5 text-gray-600'}
 ${limit && current > limit ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' : ''}`}>
 {current}{limit ? ` / ${limit}` : ''}
 </div>
 );
 })()}
 </div>
 )}
 </div>

 {selectedItem.context && (
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block">Contexto</label>
 <div className={`p-4 rounded-xl text-[12px] font-mono border leading-relaxed break-words
 ${isDarkMode ? 'bg-white/5 border-white/5 text-white/70' : 'bg-gray-100 border-black/5 text-gray-600'}`}>
 {selectedItem.context}
 </div>
 </div>
 )}
 </div>

 {selectedItem.simply_reason && (
 <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
 <div className="flex items-center gap-2 text-blue-500 mb-3">
 <Sparkles className="w-4 h-4" />
 <span className="text-[10px] font-black uppercase tracking-widest">{t.shortSummary}</span>
 </div>
 <p className="text-sm font-bold leading-relaxed">{selectedItem.simply_reason}</p>
 </div>
 )}

 {selectedItem.reason && (
 <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
 <div className="flex items-center gap-2 opacity-40 mb-3">
 <Zap className="w-4 h-4" />
 <span className="text-[10px] font-black uppercase tracking-widest">{t.techReason}</span>
 </div>
 <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">{selectedItem.reason}</p>
 </div>
 )}
 </div>

 <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
 <Button onClick={() => setSelectedItem(null)} className="rounded-lg px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold">{t.close}</Button>
 </div>
 </Card>
 </div>
 )}
 {/* Modal de Edição de Resultado da IA */}
 {isEditModalOpen && tempEditItem && (
 <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
 <Card className={`w-full max-w-xl overflow-hidden rounded-xl border shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#0a0a0a] border-white/10 text-white backdrop-blur-3xl' : 'bg-white border-black/5 text-gray-900'}`}>
 <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
 <Sparkles className="w-5 h-5" />
 </div>
 <h2 className="text-xl font-bold tracking-tight">{t.editResultTitle}</h2>
 </div>
 <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(false)} className="rounded-lg h-8 w-8 p-0"><X className="w-5 h-5" /></Button>
 </div>

 <div className="p-8 space-y-6">
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-4 opacity-60">
 <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'}`}>
 <span className="text-[10px] font-black uppercase mb-1 block">{t.sourceLabel}</span>
 <p className="text-xs">{tempEditItem.source_text}</p>
 </div>
 <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'}`}>
 <span className="text-[10px] font-black uppercase mb-1 block">{t.targetLabel}</span>
 <p className="text-xs">{tempEditItem.target_text}</p>
 </div>
 </div>

 <div className="space-y-2">
 <div className="flex justify-between items-end">
 <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">{t.aiResultLabel}</label>
 {(() => {
 const limit = getCharLimit(tempEditItem.char_limit);
 if (!limit) return null;
 const current = editValue.length;
 return (
 <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black tracking-widest border border-current transition-all duration-300
 ${current > limit ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20 ' : 'opacity-40'}`}>
 <span>{current}</span>
 <span>/</span>
 <span>{limit}</span>
 </div>
 );
 })()}
 </div>
 <textarea
 value={editValue}
 onChange={(e) => setEditValue(e.target.value)}
 className={`w-full p-4 text-sm rounded-xl border-2 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all min-h-[120px] resize-none
 ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
 autoFocus
 />
 </div>
 </div>
 </div>

 <div className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
 <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="rounded-lg px-6">{t.cancelBtn}</Button>
 <Button onClick={() => handleUpdate(tempEditItem.id, editValue)} className="rounded-lg px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20">
 {t.saveBtn}
 </Button>
 </div>
 </Card>
 </div>
 )}
 </div>
 );
}