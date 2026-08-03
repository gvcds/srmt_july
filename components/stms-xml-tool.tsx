'use client';

import React, { useState, useRef, useEffect } from 'react';
import { diffWords } from 'diff';
import { 
 Sparkles, 
 Download, 
 Mail, 
 UploadCloud, 
 Search, 
 CheckCircle2, 
 Loader2, 
 Bot,
 ChevronRight,
 X,
 FileText,
 Zap,
 Table as TableIcon,
 Clock,
 ExternalLink,
 AlertCircle,
 Minimize2,
 Maximize2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/theme-provider';

interface TranslationResult {
 app_name: string;
 string_name: string;
 en: string;
 en_comment?: string;
 pt: string;
 pt_comment?: string;
 advice: string;
 reason: string;
 simplyReason: string;
}

const translations = {
 pt: {
 uploadTitle: "Arquivos XML",
 dropzoneText: "Clique ou arraste XMLs aqui",
 dropzoneHint: "Ex: app_en_1.xml e app_pt_1.xml",
 projectTitle: "Detalhes do Projeto",
 projectName: "Nome do Projeto / Assunto",
 swVersion: "Versão de SW",
 feature: "Feature",
 devType: "Tipo de Desenvolvimento",
 startReview: "Iniciar Processamento",
 processing: "Processando Traduções...",
 resultsTitle: "Matriz de Resultados",
 resultsSubtitle: "Detalhes da Revisão e Conselhos da IA",
 searchPlaceholder: "Buscar em tudo...",
 exportBtn: "Finalizar e Gerar Relatório",
 preparing: "Preparando...",
 waitingText: "Aguardando processamento de XML...",
 tableHeaderEn: "Inglês Original",
 tableHeaderPt: "Português Original",
 tableHeaderAi: "Sugestão IA & Motivo",
 tableHeaderAnalysis: "Análise IA",
 maintained: "Mantido",
 noSuggestion: "Sem sugestão",
 generateIssue: "Gerar Issue?",
 modalText: "Deseja baixar o relatório de issue (.txt) para a chave:",
 cancel: "Cancelar",
 download: "Baixar Issue",
 elapsedTime: "Tempo decorrido:",
 emailSummaryTitle: "Resumo do E-mail Gerado",
 openOutlook: "Abrir no Outlook",
 to: "Para:",
 cc: "CC:",
 subject: "Assunto:",
 attachment: "Anexo:",
 close: "Fechar"
 },
 en: {
 uploadTitle: "XML Files",
 dropzoneText: "Click or drag XMLs here",
 dropzoneHint: "Ex: app_en_1.xml and app_pt_1.xml",
 projectTitle: "Project Details",
 projectName: "Project Name / Subject",
 swVersion: "SW Version",
 feature: "Feature",
 devType: "Development Type",
 startReview: "Start Processing",
 processing: "Processing Translations...",
 resultsTitle: "Results Matrix",
 resultsSubtitle: "Review Details and AI Advice",
 searchPlaceholder: "Search everything...",
 exportBtn: "Finish and Generate Report",
 preparing: "Preparing...",
 waitingText: "Waiting for XML processing...",
 tableHeaderEn: "Original English",
 tableHeaderPt: "Original Portuguese",
 tableHeaderAi: "AI Suggestion & Reason",
 tableHeaderAnalysis: "AI Analysis",
 maintained: "Maintained",
 noSuggestion: "No suggestion",
 generateIssue: "Generate Issue?",
 modalText: "Do you want to download the issue report (.txt) for the key:",
 cancel: "Cancel",
 download: "Download Issue",
 elapsedTime: "Elapsed time:",
 emailSummaryTitle: "Generated Email Summary",
 openOutlook: "Open in Outlook",
 to: "To:",
 cc: "CC:",
 subject: "Subject:",
 attachment: "Attachment:",
 close: "Close"
 },
 ko: {
 uploadTitle: "XML 파일",
 dropzoneText: "XML 파일을 클릭하거나 드래그하세요",
 dropzoneHint: "예: app_en_1.xml 및 app_pt_1.xml",
 projectTitle: "프로젝트 세부 정보",
 projectName: "프로젝트 이름 / 주제",
 swVersion: "SW 버전",
 feature: "기능",
 devType: "개발 유형",
 startReview: "처리 시작",
 processing: "번역 처리 중...",
 resultsTitle: "결과 매트릭스",
 resultsSubtitle: "리뷰 세부 정보 및 AI 조언",
 searchPlaceholder: "모든 항목 검색...",
 exportBtn: "완료 및 보고서 생성",
 preparing: "준비 중...",
 waitingText: "XML 처리를 기다리는 중...",
 tableHeaderEn: "원본 영어",
 tableHeaderPt: "원본 포르투갈어",
 tableHeaderAi: "AI 제안 및 이유",
 tableHeaderAnalysis: "AI 분석",
 maintained: "유지됨",
 noSuggestion: "제안 없음",
 generateIssue: "이슈를 생성하시겠습니까?",
 modalText: "해당 키에 대한 이슈 보고서(.txt)를 다운로드하시겠습니까:",
 cancel: "취소",
 download: "이슈 다운로드",
 elapsedTime: "경과 시간:",
 emailSummaryTitle: "생성된 이메일 요약",
 openOutlook: "Outlook에서 열기",
 to: "수신인:",
 cc: "참조:",
 subject: "제목:",
 attachment: "첨부 파일:",
 close: "닫기"
 }
};

export function STMSXmlTool({ onFocusChange }: { onFocusChange?: (focused: boolean) => void }) {
 const { isDarkMode } = useTheme();
 const [lang, setLanguage] = useState<'pt' | 'en' | 'ko'>('pt');
 const t = translations[lang];

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
 
 return () => {
 window.removeEventListener('storage', handleStorageChange);
 clearInterval(interval);
 };
 }, []);

 const [files, setFiles] = useState<File[]>([]);
 const [refObjectName, setRefObjectName] = useState('');
 const [swVersion, setSwVersion] = useState('');
 const [feature, setFeature] = useState('');
 const [developmentType, setDevelopmentType] = useState('Request');

 const [isLoading, setIsLoading] = useState(false);
 const [isGeneratingReport, setIsGeneratingReport] = useState(false);
 const [progress, setProgress] = useState(0);
 const [statusText, setStatusText] = useState('');
 const [finalResults, setFinalResults] = useState<TranslationResult[]>([]);
 const [emailData, setEmailData] = useState<any>(null);
 const [elapsedTime, setElapsedTime] = useState(0);

 const [searchTerm, setSearchTerm] = useState('');
 const [sortConfig, setSortConfig] = useState<{ key: keyof TranslationResult; direction: 'asc' | 'desc' | null }>({ key: 'app_name', direction: null });

 const [selectedIssue, setSelectedIssue] = useState<TranslationResult | null>(null);
 const [selectedDetail, setSelectedDetail] = useState<TranslationResult | null>(null);
 const [isFocusMode, setIsFocusModeState] = useState(false);
 
 const setIsFocusMode = (focused: boolean) => {
 setIsFocusModeState(focused);
 if (onFocusChange) onFocusChange(focused);
 };

 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 15;
 const fileInputRef = useRef<HTMLInputElement>(null);

 // Reset pagination on search
 useEffect(() => {
 setCurrentPage(1);
 }, [searchTerm]);

 useEffect(() => {
 if (isFocusMode) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = 'unset';
 }
 return () => { document.body.style.overflow = 'unset'; };
 }, [isFocusMode]);

 const API_URL = typeof window !== 'undefined' 
 ? `${window.location.protocol}//${window.location.hostname}:8001` 
 : '';

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (e.target.files) {
 setFiles(Array.from(e.target.files));
 }
 };

 const handleDragOver = (e: React.DragEvent) => e.preventDefault();
 const handleDrop = (e: React.DragEvent) => {
 e.preventDefault();
 if (e.dataTransfer.files) {
 const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.xml'));
 setFiles(prev => [...prev, ...droppedFiles]);
 }
 };

 const handleGenerateReport = async () => {
 if (finalResults.length === 0) return;
 setIsGeneratingReport(true);
 try {
 const reportResponse = await fetch(`${API_URL}/generate_report`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 projectInfo: { refObjectName, developmentType, swVersion, feature },
 items: finalResults
 })
 });
 if (!reportResponse.ok) throw new Error('Falha ao gerar relatório');
 const data = await reportResponse.json();
 setEmailData(data);
 
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
 console.error('Erro ao gerar relatório:', error);
 } finally {
 setIsGeneratingReport(false);
 }
 };

 const handleSort = (key: keyof TranslationResult) => {
 let direction: 'asc' | 'desc' = 'asc';
 if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
 setSortConfig({ key, direction });
 };

 const filteredAndSortedResults = finalResults
 .filter(item => {
 return searchTerm === '' || Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
 })
 .sort((a, b) => {
 if (!sortConfig.direction) return 0;
 const key = sortConfig.key;
 const valA = String(a[key]).toLowerCase();
 const valB = String(b[key]).toLowerCase();
 if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
 if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
 return 0;
 });

 const renderAdvice = (pt: string, advice: string) => {
 if (advice === 'Mantido' || !advice) return <span className="text-gray-500 italic">{t.maintained}</span>;
 if (advice === 'ERRO') return <span className="text-red-500 font-bold">ERRO</span>;
 if (advice === 'Sem sugestão') return <span className="text-gray-500 italic">{t.noSuggestion}</span>;
 
 const differences = diffWords(pt.trim(), advice.trim());
 return (
 <span className="block break-words">
 {differences.map((part, i) => {
 if (part.removed) return null;
 return <span key={i} className={part.added ? 'text-red-500 font-bold bg-red-500/10 px-1 rounded mx-0.5' : ''}>{part.value}</span>;
 })}
 </span>
 );
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (files.length === 0) return alert(lang === 'ko' ? "XML 파일을 추가하세요." : "Adicione arquivos XML.");
 setIsLoading(true);
 setProgress(0);
 setFinalResults([]);
 setEmailData(null);
 setElapsedTime(0);
 const startTime = Date.now();
 const timer = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 1000);

 try {
 setStatusText(lang === 'en' ? 'Pairing files...' : lang === 'ko' ? '파일 페어링 중...' : 'Emparelhando arquivos...');
 const formData = new FormData();
 files.forEach(file => formData.append('files', file));
 const parseResponse = await fetch(`${API_URL}/parse`, { method: 'POST', body: formData });
 if (!parseResponse.ok) throw new Error('Erro no parse');
 const parseData = await parseResponse.json();
 const items = parseData.items;

 const BATCH_SIZE = 1;
 const totalBatches = Math.ceil(items.length / BATCH_SIZE);
 for (let i = 0; i < totalBatches; i++) {
 const batch = items.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
 setStatusText(lang === 'en' ? `Processing batch ${i + 1} of ${totalBatches}...` : lang === 'ko' ? `배치 ${i + 1} / ${totalBatches} 처리 중...` : `Processando lote ${i + 1} de ${totalBatches}...`);
 const batchResponse = await fetch(`${API_URL}/process_batch`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ items: batch })
 });
 const batchData = await batchResponse.json();
 setFinalResults(prev => [...prev, ...batchData.results]);
 setProgress(Math.round(((i + 1) / totalBatches) * 100));
 }
 setStatusText(lang === 'en' ? 'Done!' : lang === 'ko' ? '완료!' : 'Concluído!');
 } catch (error) {
 console.error(error);
 setStatusText('Error.');
 } finally {
 clearInterval(timer);
 setIsLoading(false);
 }
 };

 const handleDownloadIssue = (res: TranslationResult) => {
 const content = `[English_US]
 - Category : Translation Error
 - Current Text (As-Is) : ${res.pt}
 + Request Text (To-Be) : ${res.advice}

[MODEL] - [RELEASE VERSION]
Brazil Ui [BUYER]
[Precondition]
1. ${refObjectName || 'NOME DO APLICATIVO'} installed in device.
[Steps]
1. Open the application and navigate to the screen where "${res.pt}" is displayed.
2. This issue was automatically identified by the AI Translation Review tool.
[Occurrence]
1. The Portuguese translation "${res.pt}" is incorrect or suboptimal. Reason: ${res.reason}
[Expected result]
1. The text should be updated to the suggested translation: "${res.advice}"
 
[Remarks]
#1. Video and log attached.
#2. Sample id: SX....
#3. RevX.X
#4. App Version : ${swVersion || 'SW VERSION'}
 Design ID : ${res.pt_comment || res.en_comment || 'N/A'}
`;
 const blob = new Blob([content], { type: 'text/plain' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `Issue_${res.string_name}.txt`;
 a.click();
 URL.revokeObjectURL(url);
 setSelectedIssue(null);
 };

 return (
 <div className={`w-full space-y-8 animate-in fade-in duration-700 pb-20 px-4 ${isFocusMode ? 'relative z-[1000]' : ''}`}>
 {/* Top Section: Upload & Project Info side by side */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <Card className={`p-8 rounded-xl border shadow-2xl transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-black/40' : 'bg-white/60 border-slate-200 shadow-slate-200/50'}`}>
 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
 <UploadCloud className="text-blue-500 w-5 h-5" /> {t.uploadTitle}
 </h3>
 <div
 className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDarkMode ? 'border-white/10 hover:border-blue-500/50 bg-white/5' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}`}
 onClick={() => fileInputRef.current?.click()}
 onDragOver={handleDragOver}
 onDrop={handleDrop}
 >
 <input type="file" multiple accept=".xml" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
 <div className="flex flex-col items-center gap-2">
 <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center mb-2">
 <FileText className="w-6 h-6" />
 </div>
 <p className="font-semibold">{t.dropzoneText}</p>
 <p className="text-xs opacity-50">{t.dropzoneHint}</p>
 </div>
 </div>
 {files.length > 0 && (
 <div className="mt-4 flex flex-wrap gap-2">
 {files.slice(0, 10).map((f, i) => (
 <div key={i} className={`px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-2 ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-black/5 text-gray-600'}`}>
 <span className="font-medium truncate max-w-[150px]">{f.name}</span>
 <span className="opacity-50">{(f.size / 1024).toFixed(1)}kb</span>
 </div>
 ))}
 {files.length > 10 && <div className="text-[10px] opacity-40 px-2 py-1">+{files.length - 10} more</div>}
 </div>
 )}
 </Card>

 <Card className={`p-8 rounded-xl border shadow-2xl transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-black/40' : 'bg-white/60 border-slate-200 shadow-slate-200/50'}`}>
 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
 <Bot className="text-purple-500 w-5 h-5" /> {t.projectTitle}
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
 <div className="space-y-1">
 <label className="text-[10px] font-black uppercase opacity-40 ml-1">{t.projectName}</label>
 <Input placeholder="Ex: Camera App Update" value={refObjectName} onChange={e => setRefObjectName(e.target.value)} className={`rounded-xl border-none h-11 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
 </div>
 <div className="space-y-1">
 <label className="text-[10px] font-black uppercase opacity-40 ml-1">{t.swVersion}</label>
 <Input placeholder="Ex: v1.2.0" value={swVersion} onChange={e => setSwVersion(e.target.value)} className={`rounded-xl border-none h-11 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
 </div>
 <div className="space-y-1">
 <label className="text-[10px] font-black uppercase opacity-40 ml-1">{t.feature}</label>
 <Input placeholder="Ex: Night Mode" value={feature} onChange={e => setFeature(e.target.value)} className={`rounded-xl border-none h-11 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
 </div>
 <div className="space-y-1">
 <label className="text-[10px] font-black uppercase opacity-40 ml-1">{t.devType}</label>
 <select value={developmentType} onChange={e => setDevelopmentType(e.target.value)} className={`w-full h-11 px-3 py-2 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-black'}`}>
 <option value="Request">{lang === 'pt' ? 'Request' : lang === 'en' ? 'Request' : '요청 (Request)'}</option>
 <option value="Projeto PRA/MR">{lang === 'pt' ? 'Projeto PRA/MR' : lang === 'en' ? 'PRA/MR Project' : 'PRA/MR 프로젝트'}</option>
 </select>
 </div>
 </div>
 
 <div className="flex flex-col items-center gap-4">
 <Button onClick={handleSubmit} disabled={isLoading} className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white h-12 font-bold shadow-lg shadow-blue-600/20 text-base">
 {isLoading ? (
 <>
 <Loader2 className="animate-spin w-5 h-5 mr-2" /> {t.processing}
 </>
 ) : (
 <>{t.startReview} <Zap className="w-5 h-5 ml-2" /></>
 )}
 </Button>

 {(isLoading || progress > 0) && (
 <div className="w-full mt-2">
 <div className="flex justify-between text-[10px] font-black uppercase mb-2">
 <span>{statusText}</span>
 <span className="text-blue-500">{progress}%</span>
 </div>
 <div className={`relative h-2 w-full rounded-lg overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} shadow-inner`}>
 <div className="h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(37,99,235,0.3)]" style={{ width: `${progress}%` }}>
 <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_2.5s_linear_infinite]" />
 </div>
 </div>
 <div className="mt-4 text-[10px] opacity-60 flex items-center justify-center gap-2 font-mono bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg w-fit mx-auto">
 {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
 <span>
 {t.elapsedTime} <strong className="text-blue-500 dark:text-blue-400">{Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}</strong>
 </span>
 </div>
 </div>
 )}
 </div>
 </Card>
 </div>

 {/* Email Summary Card */}
 {emailData && !isLoading && (
 <Card className={`p-8 rounded-xl border shadow-2xl animate-in slide-in-from-top-4 duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-black/40' : 'bg-white/60 border-slate-200 shadow-slate-200/50'}`}>
 <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
 <Mail className="text-blue-500 w-6 h-6" /> {t.emailSummaryTitle}
 </h2>
 <div className={`text-sm p-6 rounded-xl mb-6 space-y-3 ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-black/5'}`}>
 <p className="flex gap-2"><strong>{t.to}</strong> <span className="opacity-70">{emailData.to.join(', ')}</span></p>
 <p className="flex gap-2"><strong>{t.cc}</strong> <span className="opacity-70">{emailData.cc.join(', ')}</span></p>
 <p className="flex gap-2"><strong>{t.subject}</strong> <span className="opacity-70">{emailData.subject}</span></p>
 <p className="flex gap-2"><strong>{t.attachment}</strong> <span className="text-blue-500 font-medium">{emailData.filename}</span></p>
 </div>
 <div className={`p-6 rounded-xl whitespace-pre-wrap text-sm leading-relaxed border ${isDarkMode ? 'bg-black/40 border-white/5 text-gray-300' : 'bg-gray-100 border-black/5 text-gray-800'}`}>
 {emailData.body}
 </div>
 <div className="mt-8 flex justify-end">
 <Button 
 asChild
 className="rounded-lg px-8 h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20"
 >
 <a href={`mailto:${emailData.to.join(';')}?cc=${emailData.cc.join(',')}&subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`}>
 {t.openOutlook} <ExternalLink className="w-4 h-4 ml-2" />
 </a>
 </Button>
 </div>
 </Card>
 )}

 {/* Results Matrix Section */}
 <Card className={`p-8 transition-all duration-500 flex flex-col backdrop-blur-2xl
 ${isFocusMode 
 ? 'fixed inset-0 z-[999] rounded-none border-none bg-background' 
 : 'rounded-xl border shadow-2xl min-h-[400px]'
 }
 ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-black/40' : 'bg-white/60 border-slate-200 shadow-slate-200/50'}
 `}>
 <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
 <div>
 <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
 <TableIcon className="text-emerald-500 w-6 h-6" /> {t.resultsTitle}
 </h3>
 <p className="text-xs opacity-40 uppercase font-black tracking-widest mt-1">{t.resultsSubtitle}</p>
 </div>
 
 <div className="flex items-center gap-4 w-full md:w-auto">
 <div className="relative flex-1 md:w-80">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
 <Input 
 placeholder={t.searchPlaceholder}
 value={searchTerm} 
 onChange={e => setSearchTerm(e.target.value)} 
 className={`pl-11 rounded-lg border-none h-11 text-sm ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}
 />
 {searchTerm && (
 <button className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100" onClick={() => setSearchTerm('')}>
 <X className="w-4 h-4" />
 </button>
 )}
 </div>
 {finalResults.length > 0 && (
 <div className="flex gap-2">
 <Button 
 onClick={() => setIsFocusMode(!isFocusMode)} 
 variant="outline"
 className={`rounded-lg h-11 w-11 p-0 font-bold transition-all ${isFocusMode ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20 ' : ''}`}
 title={isFocusMode ? "Sair do Modo Foco" : "Modo Foco (Tela Cheia)"}
 >
 {isFocusMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
 </Button>
 <Button onClick={handleGenerateReport} disabled={isGeneratingReport} className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white h-11 px-6 shadow-lg shadow-emerald-600/20 font-bold">
 {isGeneratingReport ? (
 <><Loader2 className="animate-spin w-4 h-4 mr-2" /> {t.preparing}</>
 ) : (
 <><Download className="w-4 h-4 mr-2" /> {t.exportBtn}</>
 )}
 </Button>
 </div>
 )}
 </div>
 </div>

 {finalResults.length === 0 ? (
 <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic py-20">
 <Sparkles size={64} className="mb-4" />
 <p className="text-lg font-bold">{t.waitingText}</p>
 </div>
 ) : (
 <div className="flex flex-col flex-1 min-h-0">
 {isFocusMode && (
 <div className={`p-4 mb-4 rounded-xl border flex justify-between items-center ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-100 border-black/5'}`}>
 <div className="flex items-center gap-3">
 <TableIcon className="w-5 h-5 text-blue-500" />
 <h3 className="font-bold uppercase tracking-widest text-xs">Modo Foco Ativado - Matriz de Resultados</h3>
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
 <div className={`overflow-y-auto overflow-x-auto rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/[0.02] custom-scrollbar ${isFocusMode ? 'flex-1 min-h-0' : ''}`}>
 <table className="w-full text-sm text-left border-separate border-spacing-0">
 <thead>
 <tr className="bg-black/[0.02] dark:bg-white/[0.03]">
 <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 border-b border-black/5 dark:border-white/5 w-[25%]">{t.tableHeaderEn}</th>
 <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 border-b border-black/5 dark:border-white/5 w-[25%]">{t.tableHeaderPt}</th>
 <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 border-b border-black/5 dark:border-white/5 w-[20%]">{t.tableHeaderAnalysis}</th>
 <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 border-b border-black/5 dark:border-white/5 w-[30%] text-blue-500">{t.tableHeaderAi}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-black/5 dark:divide-white/5">
 {filteredAndSortedResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((res, i) => (
 <tr 
 key={i} 
 onClick={() => setSelectedDetail(res)}
 onDoubleClick={(e) => {
 e.stopPropagation();
 setSelectedIssue(res);
 }}
 className={`hover:bg-blue-500/[0.03] dark:hover:bg-blue-500/[0.05] transition-all duration-300 group cursor-pointer ${res.advice === 'ERRO' ? 'bg-red-500/[0.02]' : ''}`} 
 title="Clique para detalhes | Duplo clique para gerar Issue"
 >
 <td className="p-6 align-top">
 <div className="font-semibold text-gray-950 dark:text-gray-100 leading-relaxed text-[14px]">{res.en}</div>
 </td>
 <td className="p-6 align-top">
 <div className="text-gray-700 dark:text-gray-400 leading-relaxed italic text-[14px]">{res.pt}</div>
 </td>
 <td className="p-6 align-top">
 <div className="flex flex-col gap-2">
 <span className={`inline-flex px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit border transition-all ${
 res.advice !== 'Mantido' && res.advice !== 'Sem sugestão' && res.advice !== 'ERRO' 
 ? (isDarkMode ? 'bg-white/5 border-white/10 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800')
 : (isDarkMode ? 'bg-white/5 text-gray-500 border-white/10' : 'bg-gray-100 text-gray-700 border-gray-200')
 }`}>
 {res.simplyReason || res.reason}
 </span>
 </div>
 </td>
 <td className="p-6 align-top">
 <div className="space-y-4">
 <div className={`p-4 rounded-xl border transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/5 ${
 isDarkMode 
 ? 'bg-blue-500/[0.05] border-blue-500/20 text-blue-300 group-hover:bg-blue-500/[0.08]' 
 : 'bg-blue-50 border-blue-200 text-blue-800 group-hover:bg-blue-100/50'
 }`}>
 <div className="font-bold text-[14px] leading-relaxed">
 {renderAdvice(res.pt, res.advice)}
 </div>
 </div>
 <div className="flex items-start gap-3 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
 <Sparkles size={14} className="mt-0.5 text-blue-500 shrink-0" />
 <p className="text-[11px] leading-relaxed font-bold italic text-gray-700 dark:text-gray-400">{res.simplyReason || "Análise detalhada disponível"}</p>
 </div>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 
 {/* Pagination Controls */}
 {filteredAndSortedResults.length > itemsPerPage && (
 <div className="flex items-center justify-between mt-6 px-2">
 <div className="text-[10px] font-black uppercase opacity-40 tracking-[0.2em]">
 Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedResults.length)} de {filteredAndSortedResults.length} resultados
 </div>
 <div className="flex items-center gap-2">
 <Button 
 variant="outline" 
 size="sm" 
 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
 disabled={currentPage === 1}
 className="rounded-lg h-9 px-4 font-bold disabled:opacity-30"
 >
 Anterior
 </Button>
 <div className="flex items-center gap-1">
 {Array.from({ length: Math.ceil(filteredAndSortedResults.length / itemsPerPage) }).map((_, i) => {
 const pageNum = i + 1;
 // Lógica para mostrar apenas algumas páginas se houver muitas
 if (
 pageNum === 1 || 
 pageNum === Math.ceil(filteredAndSortedResults.length / itemsPerPage) ||
 (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
 ) {
 return (
 <Button 
 key={i}
 variant={currentPage === pageNum ? "default" : "ghost"}
 size="sm"
 onClick={() => setCurrentPage(pageNum)}
 className={`rounded-lg h-8 w-8 p-0 text-[10px] font-black ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : ''}`}
 >
 {pageNum}
 </Button>
 );
 } else if (
 pageNum === currentPage - 2 || 
 pageNum === currentPage + 2
 ) {
 return <span key={i} className="text-[10px] opacity-30">...</span>;
 }
 return null;
 })}
 </div>
 <Button 
 variant="outline" 
 size="sm" 
 onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAndSortedResults.length / itemsPerPage)))}
 disabled={currentPage === Math.ceil(filteredAndSortedResults.length / itemsPerPage)}
 className="rounded-lg h-9 px-4 font-bold disabled:opacity-30"
 >
 Próxima
 </Button>
 </div>
 </div>
 )}
 </div>
 )}
 </Card>

 {selectedIssue && (
 <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedIssue(null)}>
 <Card className={`w-full max-w-lg p-8 rounded-xl border-none shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-900'}`} onClick={e => e.stopPropagation()}>
 <div className="flex items-center gap-3 mb-6">
 <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
 <AlertCircle className="w-6 h-6" />
 </div>
 <div>
 <h2 className="text-2xl font-black tracking-tight">{t.generateIssue}</h2>
 <p className="opacity-50 text-xs font-bold uppercase tracking-widest">{selectedIssue.string_name}</p>
 </div>
 </div>
 
 <p className="opacity-70 text-sm mb-8 leading-relaxed">
 {t.modalText}<br/>
 <strong className="text-blue-500 font-bold">{selectedIssue.string_name}</strong>
 </p>

 <div className="flex justify-end gap-3">
 <Button variant="ghost" onClick={() => setSelectedIssue(null)} className="rounded-lg px-6 font-bold">{t.cancel}</Button>
 <Button onClick={() => handleDownloadIssue(selectedIssue)} className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-8 font-bold shadow-lg shadow-blue-600/20">
 <Download className="w-4 h-4 mr-2" /> {t.download}
 </Button>
 </div>
 </Card>
 </div>
 )}

 {/* Modal Detalhado (Clique Único) */}
 {selectedDetail && (
 <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedDetail(null)}>
 <Card className={`w-full max-w-2xl overflow-hidden rounded-xl border shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#0a0a0a] border-white/10 text-white backdrop-blur-3xl' : 'bg-white border-black/10 text-gray-900 shadow-2xl'}`} onClick={e => e.stopPropagation()}>
 <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}><Bot className="w-5 h-5" /></div>
 <h2 className="text-xl font-bold tracking-tight">Análise Detalhada da IA</h2>
 </div>
 <Button variant="ghost" size="sm" onClick={() => setSelectedDetail(null)} className="rounded-lg h-8 w-8 p-0 text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></Button>
 </div>
 <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'}`}>
 <span className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 block">{t.tableHeaderEn}</span>
 <p className="text-[15px] font-bold leading-relaxed">{selectedDetail.en}</p>
 </div>
 <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'}`}>
 <span className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2 block">{t.tableHeaderPt}</span>
 <p className="text-[15px] font-medium text-gray-600 dark:text-gray-400 mb-4">{selectedDetail.pt}</p>
 <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 mb-2 block">Sugestão da IA</span>
 <div className="text-[15px] font-bold leading-relaxed">{renderAdvice(selectedDetail.pt, selectedDetail.advice)}</div>
 </div>
 </div>
 {selectedDetail.simplyReason && (
 <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50/50 border-blue-100'}`}>
 <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-3"><Sparkles className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Resumo da Alteração</span></div>
 <p className="text-sm font-bold leading-relaxed text-gray-800 dark:text-blue-100">{selectedDetail.simplyReason}</p>
 </div>
 )}
 {selectedDetail.reason && (
 <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
 <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3"><Zap className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Motivo Técnico Detalhado</span></div>
 <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-medium whitespace-pre-wrap">{selectedDetail.reason}</p>
 </div>
 )}
 </div>
 <div className={`p-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
 <Button variant="outline" onClick={() => { setSelectedIssue(selectedDetail); setSelectedDetail(null); }} className="rounded-lg px-6 font-bold border-blue-600/30 text-blue-600 hover:bg-blue-600/10">Gerar Issue</Button>
 <Button onClick={() => setSelectedDetail(null)} className="rounded-lg px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20">{t.close}</Button>
 </div>
 </Card>
 </div>
 )}

 <style jsx global>{`
 @keyframes shimmer {
 0% { background-position: -200% 0; }
 100% { background-position: 200% 0; }
 }
 `}</style>
 </div>
 );
}