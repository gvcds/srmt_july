'use client';

import React, { useState, useRef, useEffect } from 'react';
import { diffWords } from 'diff';
import { Navbar } from "@/components/navbar";
import { useTheme } from '@/components/theme-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Zap
} from 'lucide-react';

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

type Language = 'pt' | 'en' | 'ko';

const translations = {
  pt: {
    title: "Revisão",
    titleAccent: "Automática",
    subtitle: "Faça revisão das strings dos aplicativos Samsung usando a inteligência artificial do SVP.",
    uploadTitle: "Arquivos XML",
    dropzoneText: "Clique ou arraste arquivos XML aqui",
    dropzoneHint: "Ex: app_en_1.xml e app_pt_1.xml",
    projectDetailsTitle: "Detalhes do Projeto",
    projectNameLabel: "Project Name / Subject",
    swVersionLabel: "SW Version",
    featureLabel: "Feature",
    devTypeLabel: "Development Type",
    startProcessing: "Iniciar Processamento",
    processingTranslations: "Processando Traduções...",
    statusTextPairing: "Avaliando e emparelhando arquivos XML...",
    elapsedTimeText: "Tempo decorrido:",
    finishReport: "Finalizar e Gerar Relatório",
    preparing: "Preparando...",
    emailSummaryTitle: "Resumo do E-mail Gerado",
    openOutlook: "Abrir no Outlook",
    resultsMatrixTitle: "Matriz de Resultados",
    searchPlaceholder: "Buscar em tudo...",
    tableHeaderEn: "Inglês Original",
    tableHeaderPt: "Português Original",
    tableHeaderAnalysis: "Análise IA",
    tableHeaderSuggestion: "Sugestão Completa",
    modalTitle: "Gerar Issue?",
    modalText: "Deseja baixar o relatório de issue (.txt) para a chave:",
    modalCancel: "Cancelar",
    modalConfirm: "Baixar Issue",
    maintained: "Mantido",
    noSuggestion: "Sem sugestão"
  },
  en: {
    title: "Automatic",
    titleAccent: "Review",
    subtitle: "Review Samsung application strings using SVP's artificial intelligence.",
    uploadTitle: "XML Files",
    dropzoneText: "Click or drag XML files here",
    dropzoneHint: "Ex: app_en_1.xml and app_pt_1.xml",
    projectDetailsTitle: "Project Details",
    projectNameLabel: "Project Name / Subject",
    swVersionLabel: "SW Version",
    featureLabel: "Feature",
    devTypeLabel: "Development Type",
    startProcessing: "Start Processing",
    processingTranslations: "Processing Translations...",
    statusTextPairing: "Evaluating and pairing XML files...",
    elapsedTimeText: "Elapsed time:",
    finishReport: "Finish and Generate Report",
    preparing: "Preparing...",
    emailSummaryTitle: "Generated Email Summary",
    openOutlook: "Open in Outlook",
    resultsMatrixTitle: "Results Matrix",
    searchPlaceholder: "Search everything...",
    tableHeaderEn: "Original English",
    tableHeaderPt: "Original Portuguese",
    tableHeaderAnalysis: "AI Analysis",
    tableHeaderSuggestion: "Complete Suggestion",
    modalTitle: "Generate Issue?",
    modalText: "Do you want to download the issue report (.txt) for the key:",
    modalCancel: "Cancel",
    modalConfirm: "Download Issue",
    maintained: "Maintained",
    noSuggestion: "No suggestion"
  },
  ko: {
    title: "자동",
    titleAccent: "리뷰",
    subtitle: "SVP의 인공지능을 사용하여 삼성 애플리케이션 문자열을 리뷰하세요.",
    uploadTitle: "XML 파일",
    dropzoneText: "XML 파일을 클릭하거나 여기로 드래그하세요",
    dropzoneHint: "예: app_en_1.xml 및 app_pt_1.xml",
    projectDetailsTitle: "프로젝트 세부 정보",
    projectNameLabel: "프로젝트 이름 / 주제",
    swVersionLabel: "SW 버전",
    featureLabel: "기능",
    devTypeLabel: "개발 유형",
    startProcessing: "처리 시작",
    processingTranslations: "번역 처리 중...",
    statusTextPairing: "XML 파일 평가 및 페어링 중...",
    elapsedTimeText: "경과 시간:",
    finishReport: "완료 및 보고서 생성",
    preparing: "준비 중...",
    emailSummaryTitle: "생성된 이메일 요약",
    openOutlook: "Outlook에서 열기",
    resultsMatrixTitle: "결과 매트릭스",
    searchPlaceholder: "모든 항목 검색...",
    tableHeaderEn: "원본 영어",
    tableHeaderPt: "원본 포르투갈어",
    tableHeaderAnalysis: "AI 분석",
    tableHeaderSuggestion: "전체 제안",
    modalTitle: "이슈를 생성하시겠습니까?",
    modalText: "해당 키에 대한 이슈 보고서(.txt)를 다운로드하시겠습니까:",
    modalCancel: "취소",
    modalConfirm: "이슈 다운로드",
    maintained: "유지됨",
    noSuggestion: "제안 없음"
  }
};

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

export default function STMSToolPage() {
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

  const [files, setFiles] = useState<File[]>([]);
  const [refObjectName, setRefObjectName] = useState('');
  const [developmentType, setDevelopmentType] = useState('Request');
  const [swVersion, setSwVersion] = useState('');
  const [feature, setFeature] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [finalResults, setFinalResults] = useState<TranslationResult[]>([]);
  const [emailData, setEmailData] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof TranslationResult; direction: 'asc' | 'desc' | null }>({ key: 'app_name', direction: null });
  const [columnFilters, setColumnFilters] = useState<Partial<Record<keyof TranslationResult, string>>>({});

  const [selectedIssue, setSelectedIssue] = useState<TranslationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:8001` 
    : '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

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
      alert('Erro ao preparar o e-mail e o Excel.');
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
      const matchesSearch = searchTerm === '' ||
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesColumnFilters = Object.entries(columnFilters).every(([key, val]) => {
        if (!val) return true;
        return String(item[key as keyof TranslationResult]).toLowerCase() === val.toLowerCase();
      });

      return matchesSearch && matchesColumnFilters;
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
          const isDifferent = part.added;
          return (
            <span key={i} className={`inline-block ${isDifferent ? 'text-red-500 font-bold bg-red-500/10 px-1 rounded mx-0.5' : ''}`}>
              {part.value}
            </span>
          );
        })}
      </span>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Por favor, adicione pelo menos um arquivo XML.");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setFinalResults([]);
    setEmailData(null);
    setElapsedTime(0);

    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    try {
      setStatusText(t.statusTextPairing);

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const parseResponse = await fetch(`${API_URL}/parse`, {
        method: 'POST',
        body: formData,
      });

      if (!parseResponse.ok) throw new Error('Falha ao processar arquivos XML');
      const parseData = await parseResponse.json();
      const items = parseData.items;

      if (!items || items.length === 0) {
        alert(lang === 'pt' ? 'Nenhuma chave de tradução em comum foi encontrada. Verifique se enviou os pares (EN e PT) com o padrão correto.' : lang === 'en' ? 'No common translation keys were found. Check if you sent the pairs (EN and PT) with the correct pattern.' : '공통 번역 키를 찾을 수 없습니다. 올바른 패턴의 쌍(EN 및 PT)을 보냈는지 확인하세요.');
        setIsLoading(false);
        return;
      }

      const BATCH_SIZE = 1;
      const totalBatches = Math.ceil(items.length / BATCH_SIZE);
      let allResults: TranslationResult[] = [];

      for (let i = 0; i < totalBatches; i++) {
        const batch = items.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);

        setStatusText(lang === 'pt' ? `Processando lote ${i + 1} de ${totalBatches} (${items.length} chaves)...` : lang === 'en' ? `Processing batch ${i + 1} of ${totalBatches} (${items.length} keys)...` : `배치 ${i + 1} / ${totalBatches} 처리 중 (${items.length} 키)...`);

        const batchResponse = await fetch(`${API_URL}/process_batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: batch })
        });

        if (!batchResponse.ok) throw new Error(`Falha no lote ${i + 1}`);

        const batchData = await batchResponse.json();
        setFinalResults(prev => [...prev, ...batchData.results]);
        allResults = [...allResults, ...batchData.results];

        const currentProgress = Math.round(((i + 1) / totalBatches) * 100);
        setProgress(currentProgress);
      }

      setStatusText(lang === 'pt' ? 'Concluído com Sucesso!' : lang === 'en' ? 'Successfully Completed!' : '성공적으로 완료되었습니다!');

    } catch (error) {
      console.error('Erro no processamento:', error);
      alert(lang === 'pt' ? 'Falha na comunicação com o backend. Certifique-se de que ele está rodando na porta 8001.' : lang === 'en' ? 'Failure in communication with the backend. Make sure it is running on port 8001.' : '백엔드와의 통신에 실패했습니다. 8001번 포트에서 실행 중인지 확인하세요.');
      setStatusText('Erro no processamento.');
    } finally {
      clearInterval(timer);
      setIsLoading(false);
    }
  };

  const handleDownloadIssue = (res: TranslationResult) => {
    const fileName = `Issue_${res.string_name}.txt`;
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
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setSelectedIssue(null);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-8 transition-colors duration-500 ${isDarkMode ? "bg-black text-gray-200" : "bg-[#f5f5f7] text-gray-800"}`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />

      <div className="w-full max-w-6xl relative z-10 py-10">
        
        {/* Seletor de Idioma */}
        <div className="flex justify-center mb-8 gap-2">
          {[
            { id: 'pt', label: 'Português', icon: '🇧🇷' },
            { id: 'en', label: 'English', icon: '🇺🇸' },
            { id: 'ko', label: '한국어', icon: '🇰🇷' }
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id as Language)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-2 ${lang === l.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'}`}
            >
              <span>{l.icon}</span> {l.label}
            </button>
          ))}
        </div>

        <div className="text-center mb-16 space-y-4">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:-translate-y-1 cursor-default ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">STMS AI Review</span>
          </div>
          
          <h1 className={`text-5xl md:text-6xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">{t.titleAccent}</span>
          </h1>
          
          <p className={`text-lg max-w-2xl mx-auto opacity-60 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
           {t.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
          <Card className={`overflow-hidden border p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-black/40' : 'bg-white/60 border-slate-200 shadow-slate-200/50'}`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UploadCloud className="text-blue-500 w-6 h-6" /> {t.uploadTitle}
            </h2>
            
            <div
              className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-blue-500/50 bg-white/5' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input type="file" multiple accept=".xml" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="font-semibold">{t.dropzoneText}</p>
                <p className="text-sm opacity-50">{t.dropzoneHint}</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <div key={i} className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>
                    <span className="font-medium max-w-[150px] truncate">{file.name}</span>
                    <span className="opacity-50">{(file.size / 1024).toFixed(1)}kb</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className={`overflow-hidden border p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-black/40' : 'bg-white/60 border-slate-200 shadow-slate-200/50'}`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bot className="text-purple-500 w-6 h-6" /> {t.projectDetailsTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">{t.projectNameLabel}</label>
                <Input required value={refObjectName} onChange={e => setRefObjectName(e.target.value)} placeholder="Ex: Camera App Update" className={`rounded-xl border-none ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">{t.swVersionLabel}</label>
                <Input required value={swVersion} onChange={e => setSwVersion(e.target.value)} placeholder="Ex: v1.2.0" className={`rounded-xl border-none ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">{t.featureLabel}</label>
                <Input required value={feature} onChange={e => setFeature(e.target.value)} placeholder="Ex: Night Mode" className={`rounded-xl border-none ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">{t.devTypeLabel}</label>
                <select value={developmentType} onChange={e => setDevelopmentType(e.target.value)} className={`w-full h-10 px-3 py-2 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-black'}`}>
                  <option value="Request">{lang === 'pt' ? 'Request' : lang === 'en' ? 'Request' : '요청 (Request)'}</option>
                  <option value="Projeto PRA/MR">{lang === 'pt' ? 'Projeto PRA/MR' : lang === 'en' ? 'PRA/MR Project' : 'PRA/MR 프로젝트'}</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Button type="submit" disabled={isLoading} className="rounded-full px-8 h-12 w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-500/30">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t.processingTranslations}
                  </>
                ) : (
                  <>{t.startProcessing} <Zap className="w-5 h-5 ml-2" /></>
                )}
              </Button>

              {(isLoading || progress > 0) && (
                <div className="w-full max-w-md mt-6 flex flex-col items-center">
                  <div className="flex justify-between w-full mb-3 text-sm font-bold opacity-80">
                    <span>{statusText}</span>
                    <span className="text-blue-500">{progress}%</span>
                  </div>
                  
                  <div className={`relative w-full h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} shadow-inner`}>
                    <div 
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-shimmer" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs opacity-60 flex items-center gap-2 font-mono bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full">
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                    <span>
                      {t.elapsedTimeText} <strong className="text-blue-500 dark:text-blue-400">{Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </form>

        {finalResults.length > 0 && !isLoading && (
          <div className="mt-12 flex flex-col items-center gap-6">
            {!emailData && (
              <Button type="button" onClick={handleGenerateReport} disabled={isGeneratingReport} className="rounded-full px-8 h-12 bg-green-600 hover:bg-green-500 text-white font-bold text-base shadow-lg shadow-green-500/30">
                {isGeneratingReport ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t.preparing}</>
                ) : (
                  <>{t.finishReport} <Download className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            )}

            {emailData && (
              <Card className={`w-full max-w-4xl p-8 rounded-[2.5rem] shadow-xl border ${isDarkMode ? 'bg-[#171717] border-white/10' : 'bg-white border-gray-200'}`}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="text-blue-500 w-6 h-6" /> {t.emailSummaryTitle}
                </h2>
                <div className={`text-sm p-4 rounded-xl mb-4 space-y-2 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p><strong>Para:</strong> {emailData.to.join(', ')}</p>
                  <p><strong>CC:</strong> {emailData.cc.join(', ')}</p>
                  <p><strong>Assunto:</strong> {emailData.subject}</p>
                  <p><strong>Anexo:</strong> {emailData.filename}</p>
                </div>
                <div className={`p-4 rounded-xl whitespace-pre-wrap text-sm leading-relaxed ${isDarkMode ? 'bg-black text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                  {emailData.body}
                </div>
                <div className="mt-6 flex justify-end">
                  <a href={`mailto:${emailData.to.join(';')}?cc=${emailData.cc.join(',')}&subject=${escape(emailData.subject)}&body=${escape(emailData.body)}`} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    {t.openOutlook}
                  </a>
                </div>
              </Card>
            )}

            <div className="w-full mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">{t.resultsMatrixTitle}</h2>
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <Input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className={`pl-10 rounded-full h-10 border-none ${isDarkMode ? 'bg-white/10 text-white' : 'bg-white shadow-sm'}`}
                  />
                  {searchTerm && (
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100" onClick={() => setSearchTerm('')}>
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'border-white/10 bg-[#111]/80' : 'border-gray-200 bg-white'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className={`${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                        <th className="p-4 cursor-pointer hover:opacity-80 font-bold" onClick={() => handleSort('en')}>
                          {t.tableHeaderEn}
                        </th>
                        <th className="p-4 cursor-pointer hover:opacity-80 font-bold" onClick={() => handleSort('pt')}>
                          {t.tableHeaderPt}
                        </th>
                        <th className="p-4 cursor-pointer hover:opacity-80 font-bold" onClick={() => handleSort('simplyReason')}>
                          {t.tableHeaderAnalysis}
                        </th>
                        <th className="p-4 cursor-pointer hover:opacity-80 font-bold" onClick={() => handleSort('advice')}>
                          {t.tableHeaderSuggestion}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                      {filteredAndSortedResults.map((res, idx) => (
                        <tr key={idx} className={`transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${res.advice === 'ERRO' ? 'bg-red-500/10' : ''}`} onDoubleClick={() => setSelectedIssue(res)} title="Duplo clique para gerar Issue">
                          <td className="p-4 align-top max-w-[200px] break-words">{res.en}</td>
                          <td className="p-4 align-top max-w-[200px] break-words">{res.pt}</td>
                          <td className="p-4 align-top max-w-[200px]">
                            <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${res.advice !== 'Mantido' && res.advice !== 'Sem sugestão' && res.advice !== 'ERRO' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                              {res.simplyReason || res.reason}
                            </span>
                          </td>
                          <td className="p-4 align-top max-w-[250px]">
                            {renderAdvice(res.pt, res.advice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedIssue(null)}>
          <Card className={`w-full max-w-md p-6 rounded-3xl border-none shadow-2xl ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-900'}`} onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-2">{t.modalTitle}</h2>
            <p className="opacity-70 text-sm mb-6">
              {t.modalText}<br/>
              <strong className="text-blue-500">{selectedIssue.string_name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" className="rounded-full" onClick={() => setSelectedIssue(null)}>{t.modalCancel}</Button>
              <Button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white" onClick={() => handleDownloadIssue(selectedIssue)}>{t.modalConfirm}</Button>
            </div>
          </Card>
        </div>
      )}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 20px 0; }
          100% { background-position: 0 0; }
        }
        .animate-shimmer {
          animation: shimmer 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
