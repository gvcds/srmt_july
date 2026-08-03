'use client';

import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Briefcase,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  Calendar as CalendarIcon,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Sparkles,
  Clock,
  ArrowRight,
  FileText,
  Bot,
  Zap,
  X,
  Loader2,
  CheckCircle2,
  Minus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { useTheme } from '@/components/theme-provider';
import { CustomToast } from "@/components/ui/toast";

interface Project {
  id: string | number;
  name: string;
  created_at?: string;
}

interface DailyIssue {
  id: string | number;
  project_id: string | number;
  title: string;
  date: string; // YYYY-MM-DD
  created_at?: string;
}

interface AnalysisState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isAnalyzing: boolean;
  result: string;
}

const getApiBaseUrl = () => {
  if (typeof window !== "undefined") return `${window.location.protocol}//${window.location.hostname}:8001`;
  return "http://localhost:8001";
};

type TabType = 'registro' | 'gestao';

const getTodayString = () => {
  const d = new Date();
  const tzoffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzoffset).toISOString().split('T')[0];
};

const formatDateBr = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const formatDateLong = (dateString: string, lang: Language) => {
  const d = new Date(dateString + 'T12:00:00Z');
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'ko-KR';
  return d.toLocaleDateString(locale, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
};

// --- COMPONENTE PARA RENDERIZAR CONTEÚDO MARKDOWN ---
const MarkdownContent = ({ content, isDarkMode }: { content: string, isDarkMode: boolean }) => {
  const formatMarkdown = (text: string) => {
    if (!text) return "";
    let html = text;
    // Headers
    html = html.replace(/^\s*####\s*(.*$)/gm, `<h4 class="text-base font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mt-5 mb-2">$1</h4>`);
    html = html.replace(/^\s*###\s*(.*$)/gm, `<h3 class="text-lg font-bold mt-6 mb-3">$1</h3>`);
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-500">$1</strong>');
    // Lists
    html = html.replace(/^[*-] (.*$)/gm, `<div class="flex items-start gap-2 mb-1"><div class="w-1.5 h-1.5 rounded-xl bg-blue-500 mt-1.5 shrink-0"></div><span>$1</span></div>`);
    return html;
  };

  return (
    <div 
      className="prose-custom max-w-none whitespace-pre-wrap text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} 
    />
  );
};

// --- COMPONENTE DE BOLINHA FLUTUANTE ---
const FloatingAnalysisBubble = ({ title, isAnalyzing, onOpen, isDarkMode, index = 0 }: any) => (
  <div 
    onClick={onOpen}
    className="fixed z-[150] cursor-pointer group animate-in zoom-in duration-300"
    style={{ bottom: `${40 + (index * 80)}px`, right: '40px' }}
  >
    <div className={`relative w-16 h-16 rounded-xl flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 
      ${isAnalyzing ? 'bg-blue-600 animate-pulse' : 'bg-green-500 shadow-green-500/20'}`}>
      {isAnalyzing ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <CheckCircle2 className="w-8 h-8 text-white" />}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-black/80 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {title} ({isAnalyzing ? 'Analisando...' : 'Concluído'})
      </div>
    </div>
  </div>
);

// --- COMPONENTE DE MODAL DE ANÁLISE ---
const AnalysisModal = ({ isOpen, onClose, onMinimize, title, isAnalyzing, result, isDarkMode }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={!isAnalyzing ? onClose : undefined} />
      <Card className={`relative w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col z-10 border-none shadow-2xl animate-in zoom-in-95 duration-200
        ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-gray-900'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <Bot className={`w-5 h-5 text-blue-500 ${isAnalyzing ? 'animate-bounce' : ''}`} />
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onMinimize} className="rounded-xl h-8 w-8 p-0 opacity-50 hover:opacity-100"><Minus className="w-5 h-5" /></Button>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isAnalyzing} className="rounded-xl h-8 w-8 p-0"><X className="w-5 h-5" /></Button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-8 custom-scrollbar">
          {!result && isAnalyzing ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-sm font-bold animate-pulse">IA está processando as issues...</p>
            </div>
          ) : (
            <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'}`}>
              <MarkdownContent content={result} isDarkMode={isDarkMode} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// --- COMPONENTE DE IMPORTAÇÃO JSON ---
const JsonImportModal = ({ isOpen, onClose, onImport, isDarkMode, t, jsonInput, setJsonInput, onShowExamples, isImporting }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <Card className={`relative w-full max-w-2xl overflow-hidden flex flex-col z-10 border-none shadow-2xl animate-in zoom-in-95 duration-200
        ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-gray-900'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold tracking-tight">{t.jsonImportTitle}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl h-8 w-8 p-0"><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-8 space-y-6">
          <textarea 
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={t.jsonPlaceholder}
            className={`w-full h-64 p-4 rounded-xl border text-xs font-mono transition-all outline-none resize-none
              ${isDarkMode ? 'bg-black/40 border-white/10 focus:border-blue-500/50' : 'bg-gray-50 border-black/10 focus:border-blue-500/50'}`}
          />
          <div className="flex gap-4">
            <Button 
              onClick={onShowExamples} 
              variant="outline"
              className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest border-blue-500/20 text-blue-500 hover:bg-blue-500/10"
            >
              {t.jsonExampleBtn}
            </Button>
            <Button 
              onClick={onImport} 
              disabled={isImporting || !jsonInput.trim()}
              className="flex-[2] h-12 rounded-xl font-black text-[10px] uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
            >
              {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : t.importBtn}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- COMPONENTE DE EXEMPLOS JSON ---
const JsonExampleModal = ({ isOpen, onClose, isDarkMode, t }: any) => {
  if (!isOpen) return null;
  const exampleSingle = JSON.stringify({ project: "SM-S938B", title: "Problema na tela", date: "2024-05-20" }, null, 2);
  const exampleMultiple = JSON.stringify([
    { project: "SM-S938B", title: "Bug no teclado", date: "2024-05-20" },
    { project: "SM-A546B", title: "Câmera falhando" }
  ], null, 2);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <Card className={`relative w-full max-w-lg overflow-hidden flex flex-col z-10 border-none shadow-2xl animate-in zoom-in-95 duration-200
        ${isDarkMode ? 'bg-[#111] text-white' : 'bg-white text-gray-900'}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">{t.jsonExampleBtn}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl h-8 w-8 p-0"><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-6 space-y-6 overflow-auto max-h-[70vh] custom-scrollbar">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase opacity-40">{t.jsonExampleSingle}</p>
            <pre className={`p-4 rounded-xl text-[10px] font-mono ${isDarkMode ? 'bg-black/50' : 'bg-gray-100'}`}>{exampleSingle}</pre>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase opacity-40">{t.jsonExampleMultiple}</p>
            <pre className={`p-4 rounded-xl text-[10px] font-mono ${isDarkMode ? 'bg-black/50' : 'bg-gray-100'}`}>{exampleMultiple}</pre>
          </div>
          <p className="text-[9px] opacity-40 italic">Nota: 'projectId' pode ser usado em vez de 'project'. Se 'date' for omitido, será usada a data selecionada.</p>
        </div>
        <div className="p-6 border-t">
          <Button onClick={onClose} className="w-full h-10 rounded-xl font-black text-[10px] uppercase bg-zinc-800 text-white">{t.closeBtn}</Button>
        </div>
      </Card>
    </div>
  );
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
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-xl blur-[120px] opacity-20 animate-pulse 
        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '8s' }} 
      />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-xl blur-[120px] opacity-20 animate-pulse
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
    badge: "Daily Analytics",
    title: "Daily",
    titleAccent: "Issues",
    subtitle: "Registro rápido de problemas e gestão de projetos diários.",
    tabRegister: "Registro",
    tabManagement: "Gestão & Dashboard",
    registerIssue: "Registrar Issue",
    linkProjectPlaceholder: "Vincular Projeto...",
    issueDescriptionPlaceholder: "Descrição do problema detectado...",
    registerBtn: "Registrar",
    newProject: "Novo Projeto",
    newProjectPlaceholder: "Cadastrar nova amostra ou modelo (Ex: SM-S938B)...",
    createBtn: "Criar",
    today: "Hoje",
    analyzeIssuesBtn: "Analisar Issues com IA",
    filterPlaceholder: "Filtrar nesta data...",
    tableHeaderProject: "Projeto / Modelo",
    tableHeaderIssues: "Issues Detectadas",
    tableHeaderAction: "Ação",
    noRecords: "Nenhum registro para esta data",
    analyzeDashboardBtn: "Analisar Dados do Dashboard",
    kpiActiveProjects: "Projetos Ativos",
    kpiTotalIssues: "Issues Totais",
    kpiAvgProject: "Média / Projeto",
    kpiIssuesToday: "Ocorrências Hoje",
    chartTemporalTitle: "Fluxo Temporal de Ocorrências",
    chartConcentrationTitle: "Concentração (Top 5)",
    chartLineDistributionTitle: "Distribuição por Linha (S, A, M, Z, Tab)",
    chartTop10Title: "Top 10 Projetos por Issues",
    govTitle: "Governança de Projetos",
    govSubtitle: "Controle de modelos e exportação de dados",
    govSearchPlaceholder: "Buscar projeto ou data...",
    exportCsvBtn: "Exportar CSV",
    govTableHeaderModel: "Modelo / Amostra",
    govTableHeaderDate: "Data Cadastro",
    govTableHeaderVolume: "Volume Acumulado",
    govTableHeaderActions: "Ações",
    govNoProjects: "Nenhum projeto encontrado",
    govOccurrences: "ocorrências",
    page: "Página",
    pageOf: "de",
    loading: "Iniciando Daily...",
    toastProjectCreated: "Projeto criado!",
    toastIssueRegistered: "Issue registrada!",
    toastIssueRemoved: "Issue removida.",
    toastNoIssuesToAnalyze: "Nenhuma issue para analisar nesta data.",
    toastRemoveIssuesFirst: "Remova as issues antes de deletar o projeto.",
    confirmDeleteIssue: "Deseja realmente excluir esta issue?",
    confirmDeleteProject: "Deletar projeto permanentemente?",
    errorApi: "Erro na API",
    errorAiConnection: "Erro ao conectar com a IA. Verifique se o servidor está ativo.",
    importJsonBtn: "Importar JSON",
    jsonImportTitle: "Importação em Massa via JSON",
    jsonPlaceholder: "Cole seu JSON aqui...",
    jsonExampleBtn: "Ver Exemplos",
    importBtn: "Importar",
    toastImportSuccess: "issues importadas com sucesso!",
    toastImportError: "Erro ao importar JSON. Verifique o formato.",
    jsonExampleSingle: "Exemplo: Uma issue",
    jsonExampleMultiple: "Exemplo: Múltiplas issues",
    closeBtn: "Fechar"
  },
  en: {
    badge: "Daily Analytics",
    title: "Daily",
    titleAccent: "Issues",
    subtitle: "Quick reporting of problems and daily project management.",
    tabRegister: "Register",
    tabManagement: "Management & Dashboard",
    registerIssue: "Report Issue",
    linkProjectPlaceholder: "Link Project...",
    issueDescriptionPlaceholder: "Description of the detected problem...",
    registerBtn: "Report",
    newProject: "New Project",
    newProjectPlaceholder: "Register new sample or model (Ex: SM-S938B)...",
    createBtn: "Create",
    today: "Today",
    analyzeIssuesBtn: "Analyze Issues with AI",
    filterPlaceholder: "Filter on this date...",
    tableHeaderProject: "Project / Model",
    tableHeaderIssues: "Detected Issues",
    tableHeaderAction: "Action",
    noRecords: "No records for this date",
    analyzeDashboardBtn: "Analyze Dashboard Data",
    kpiActiveProjects: "Active Projects",
    kpiTotalIssues: "Total Issues",
    kpiAvgProject: "Avg / Project",
    kpiIssuesToday: "Issues Today",
    chartTemporalTitle: "Temporal Issue Flow",
    chartConcentrationTitle: "Concentration (Top 5)",
    chartLineDistributionTitle: "Distribution by Line (S, A, M, Z, Tab)",
    chartTop10Title: "Top 10 Projects by Issues",
    govTitle: "Project Governance",
    govSubtitle: "Model control and data export",
    govSearchPlaceholder: "Search project or date...",
    exportCsvBtn: "Export CSV",
    govTableHeaderModel: "Model / Sample",
    govTableHeaderDate: "Registration Date",
    govTableHeaderVolume: "Accumulated Volume",
    govTableHeaderActions: "Actions",
    govNoProjects: "No projects found",
    govOccurrences: "occurrences",
    page: "Page",
    pageOf: "of",
    loading: "Starting Daily...",
    toastProjectCreated: "Project created!",
    toastIssueRegistered: "Issue reported!",
    toastIssueRemoved: "Issue removed.",
    toastNoIssuesToAnalyze: "No issues to analyze on this date.",
    toastRemoveIssuesFirst: "Remove issues before deleting the project.",
    confirmDeleteIssue: "Do you really want to delete this issue?",
    confirmDeleteProject: "Permanently delete project?",
    errorApi: "API Error",
    errorAiConnection: "Error connecting to AI. Check if server is active.",
    importJsonBtn: "Import JSON",
    jsonImportTitle: "Bulk JSON Import",
    jsonPlaceholder: "Paste your JSON here...",
    jsonExampleBtn: "See Examples",
    importBtn: "Import",
    toastImportSuccess: "issues imported successfully!",
    toastImportError: "Error importing JSON. Check format.",
    jsonExampleSingle: "Example: Single issue",
    jsonExampleMultiple: "Example: Multiple issues",
    closeBtn: "Close"
  },
  ko: {
    badge: "일일 분석",
    title: "일일",
    titleAccent: "이슈",
    subtitle: "문제의 신속한 보고 및 일일 프로젝트 관리.",
    tabRegister: "등록",
    tabManagement: "관리 및 대시보드",
    registerIssue: "이슈 보고",
    linkProjectPlaceholder: "프로젝트 연결...",
    issueDescriptionPlaceholder: "감지된 문제에 대한 설명...",
    registerBtn: "보고",
    newProject: "새 프로젝트",
    newProjectPlaceholder: "새 샘플 또는 모델 등록 (예: SM-S938B)...",
    createBtn: "생성",
    today: "오늘",
    analyzeIssuesBtn: "AI로 이슈 분석",
    filterPlaceholder: "이 날짜 필터링...",
    tableHeaderProject: "프로젝트 / 모델",
    tableHeaderIssues: "감지된 이슈",
    tableHeaderAction: "동작",
    noRecords: "이 날짜에 대한 기록이 없습니다",
    analyzeDashboardBtn: "대시보드 데이터 분석",
    kpiActiveProjects: "활성 프로젝트",
    kpiTotalIssues: "총 이슈",
    kpiAvgProject: "평균 / 프로젝트",
    kpiIssuesToday: "오늘 발생",
    chartTemporalTitle: "시간별 이슈 흐름",
    chartConcentrationTitle: "집중도 (상위 5개)",
    chartLineDistributionTitle: "라인별 분포 (S, A, M, Z, Tab)",
    chartTop10Title: "이슈별 상위 10개 프로젝트",
    govTitle: "프로젝트 거버넌스",
    govSubtitle: "모델 제어 및 데이터 내보내기",
    govSearchPlaceholder: "프로젝트 또는 날짜 검색...",
    exportCsvBtn: "CSV 내보내기",
    govTableHeaderModel: "모델 / 샘플",
    govTableHeaderDate: "등록 날짜",
    govTableHeaderVolume: "누적 볼륨",
    govTableHeaderActions: "작업",
    govNoProjects: "프로젝트를 찾을 수 없습니다",
    govOccurrences: "건 발생",
    page: "페이지",
    pageOf: "/",
    loading: "Daily 시작 중...",
    toastProjectCreated: "프로젝트가 생성되었습니다!",
    toastIssueRegistered: "이슈가 등록되었습니다!",
    toastIssueRemoved: "이슈가 삭제되었습니다.",
    toastNoIssuesToAnalyze: "이 날짜에 분석할 이슈가 없습니다.",
    toastRemoveIssuesFirst: "프로젝트를 삭제하기 전에 이슈를 제거하세요.",
    confirmDeleteIssue: "정말로 이 이슈를 삭제하시겠습니까?",
    confirmDeleteProject: "프로젝트를 영구적으로 삭제하시겠습니까?",
    errorApi: "API 오류",
    errorAiConnection: "AI 연결 오류. 서버가 활성 상태인지 확인하십시오.",
    importJsonBtn: "JSON 가져오기",
    jsonImportTitle: "JSON 대량 가져오기",
    jsonPlaceholder: "여기에 JSON을 붙여넣으세요...",
    jsonExampleBtn: "예시 보기",
    importBtn: "가져오기",
    toastImportSuccess: "개의 이슈를 성공적으로 가져왔습니다!",
    toastImportError: "JSON 가져오기 오류. 형식을 확인하세요.",
    jsonExampleSingle: "예시: 단일 이슈",
    jsonExampleMultiple: "예시: 다중 이슈",
    closeBtn: "닫기"
  }
};

function DailyIssuesContent() {
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

  const [activeTab, setActiveTab] = useState<TabType>('registro');
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<DailyIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [chartTimeRange, setChartTimeRange] = useState('7d');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info', visible: boolean}>({ message: '', type: 'info', visible: false });

  // Estados para Importação JSON
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Estados para Análise de IA
  const [activeAnalyses, setActiveAnalyses] = useState<AnalysisState[]>([]);

  // Carregar e Salvar Análises para continuidade
  useEffect(() => {
    const savedAnalyses = localStorage.getItem('srmt_daily_analyses');
    if (savedAnalyses) {
      try {
        const parsed = JSON.parse(savedAnalyses);
        if (Array.isArray(parsed)) setActiveAnalyses(parsed);
      } catch (e) { console.error("Erro ao restaurar análises", e); }
    }
  }, []);

  useEffect(() => {
    if (activeAnalyses.length > 0) {
      localStorage.setItem('srmt_daily_analyses', JSON.stringify(activeAnalyses));
    } else {
      localStorage.removeItem('srmt_daily_analyses');
    }
  }, [activeAnalyses]);

  // Estados para Governança
  const [projectSearch, setProjectSearch] = useState('');
  const [govPage, setGovPage] = useState(1);
  const govItemsPerPage = 10;

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [projectsRes, issuesRes] = await Promise.all([
        fetch(`${getApiBaseUrl()}/daily-projects`),
        fetch(`${getApiBaseUrl()}/daily-issues`) 
      ]);
      if (projectsRes.ok && issuesRes.ok) {
        setProjects(await projectsRes.json());
        setIssues(await issuesRes.json());
      }
    } catch (error) {} finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return showToast(lang === 'pt' ? 'Nome obrigatório.' : lang === 'en' ? 'Name required.' : '이름이 필요합니다.', "error");
    setIsCreatingProject(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/daily-projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev => [...prev, data]);
        setNewProjectName('');
        showToast(t.toastProjectCreated, "success");
      }
    } catch (error) {} finally { setIsCreatingProject(false); }
  };

  const handleCreateIssue = async () => {
    if (!selectedProjectId || !issueTitle.trim()) return showToast(lang === 'pt' ? 'Preencha todos os campos.' : lang === 'en' ? 'Fill in all fields.' : '모든 필드를 채워주세요.', "error");
    try {
      const res = await fetch(`${getApiBaseUrl()}/daily-issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: parseInt(selectedProjectId), title: issueTitle.trim(), date: getTodayString() })
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(prev => [...prev, data]);
        setIssueTitle(''); setProjectSearchTerm(''); setSelectedProjectId('');
        showToast(t.toastIssueRegistered, "success");
      }
    } catch (error) {}
  };

  const handleImportJson = async () => {
    try {
      const data = JSON.parse(jsonInput);
      const issuesToImport = Array.isArray(data) ? data : [data];
      
      const formattedIssues = issuesToImport.map(item => {
        let pId = item.projectId;
        if (!pId && item.project) {
          const p = projects.find(proj => proj.name.toLowerCase() === item.project.toLowerCase());
          if (p) pId = p.id;
        }
        
        return {
          projectId: pId,
          title: item.title,
          date: item.date || selectedDate
        };
      }).filter(i => i.projectId && i.title);

      if (formattedIssues.length === 0) {
        showToast(t.toastImportError, "error");
        return;
      }

      setIsImporting(true);
      const res = await fetch(`${getApiBaseUrl()}/daily-issues/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedIssues)
      });

      if (res.ok) {
        const newIssues = await res.json();
        setIssues(prev => [...prev, ...newIssues]);
        showToast(`${newIssues.length} ${t.toastImportSuccess}`, "success");
        setIsImportModalOpen(false);
        setJsonInput('');
      } else {
        showToast(t.toastImportError, "error");
      }
    } catch (e) {
      showToast(t.toastImportError, "error");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteIssue = async (id: string | number) => {
    if(!confirm(t.confirmDeleteIssue)) return;
    try {
      const res = await fetch(`${getApiBaseUrl()}/daily-issues/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIssues(issues.filter(i => i.id.toString() !== id.toString()));
        showToast(t.toastIssueRemoved, "success");
      }
    } catch (error) {}
  };

  const getProjectName = useCallback((id: string | number) => {
    return projects.find(p => p.id.toString() === id.toString())?.name || 'Excluído';
  }, [projects]);

  // --- LÓGICA DE ANÁLISE DE IA ---
  const updateAnalysis = (id: string, updates: Partial<AnalysisState>) => {
    setActiveAnalyses(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const startDailyAnalysis = async () => {
    const issuesToAnalyze = filteredIssuesByDate;
    if (issuesToAnalyze.length === 0) return showToast(t.toastNoIssuesToAnalyze, "warning");

    const langName = lang === 'pt' ? 'Portuguese' : lang === 'en' ? 'English' : 'Korean';
    const analysisId = `daily-${selectedDate}-${Date.now()}`;
    const newAnalysis: AnalysisState = {
      id: analysisId,
      title: `${lang === 'pt' ? 'Análise' : lang === 'en' ? 'Analysis' : '분석'}: ${formatDateBr(selectedDate)}`,
      isOpen: true,
      isMinimized: false,
      isAnalyzing: true,
      result: ''
    };

    setActiveAnalyses(prev => [...prev, newAnalysis]);

    try {
      const issuesText = issuesToAnalyze.map((i, idx) => `- [${getProjectName(i.project_id)}] ${i.title}`).join('\n');
      const prompt = lang === 'pt' 
        ? `Analise as seguintes ocorrências (Daily Issues) registradas no dia ${formatDateBr(selectedDate)}:\n\n${issuesText}\n\nForneça um resumo técnico, identifique padrões ou recorrências entre os projetos e sugira possíveis pontos de atenção. (NÃO CRIE TABELAS)`
        : lang === 'en'
        ? `Analyze the following occurrences (Daily Issues) recorded on ${formatDateBr(selectedDate)}:\n\n${issuesText}\n\nProvide a technical summary, identify patterns or recurrences between projects, and suggest possible points of attention. (DO NOT CREATE TABLES)`
        : `${formatDateBr(selectedDate)}에 기록된 다음 발생 사항(일일 이슈)을 분석하십시오:\n\n${issuesText}\n\n기술 요약을 제공하고 프로젝트 간의 패턴 또는 재발을 식별하며 가능한 주의 사항을 제안하십시오. (표를 생성하지 마십시오)`;

      const response = await fetch(`${getApiBaseUrl()}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `You are an SVP Strategic Software Quality Analyst. Respond EXCLUSIVELY in ${langName}. Do not use any other language. Provide direct and professional insights.` },
            { role: 'user', content: prompt }
          ],
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        updateAnalysis(analysisId, { isAnalyzing: false, result: data.message?.content || (lang === 'pt' ? "Não foi possível gerar a análise." : lang === 'en' ? "Could not generate analysis." : "분석을 생성할 수 없습니다.") });
      } else {
        throw new Error("Erro na API");
      }
    } catch (error) {
      updateAnalysis(analysisId, { isAnalyzing: false, result: t.errorAiConnection });
    }
  };

  const startDashboardAnalysis = async () => {
    if (!dashboardStats || issues.length === 0) return showToast(lang === 'pt' ? "Sem dados suficientes para análise." : lang === 'en' ? "Not enough data for analysis." : "분석을 위한 데이터가 충분하지 않습니다.", "warning");

    const langName = lang === 'pt' ? 'Portuguese' : lang === 'en' ? 'English' : 'Korean';
    const analysisId = `dashboard-${Date.now()}`;
    const newAnalysis: AnalysisState = {
      id: analysisId,
      title: lang === 'pt' ? `Análise Executiva do Dashboard` : lang === 'en' ? `Dashboard Executive Analysis` : `대시보드 경영진 분석`,
      isOpen: true,
      isMinimized: false,
      isAnalyzing: true,
      result: ''
    };

    setActiveAnalyses(prev => [...prev, newAnalysis]);

    try {
      const prompt = lang === 'pt'
        ? `Gere um relatório executivo baseado nos seguintes dados consolidados do Dashboard de Daily Issues:
        - Total de Issues: ${dashboardStats.totalIssues}
        - Projetos Ativos: ${projects.length}
        - Média de Issues por Projeto: ${dashboardStats.avgIssuesPerProject}
        - Top 5 Projetos com mais Issues: ${dashboardStats.issuesPerProjectData.map(p => `${p.name} (${p.value})`).join(', ')}
        - Ocorrências por Linha: ${dashboardStats.lineDistributionData.map(l => `${l.name}: ${l.value}`).join(', ')}
        - Tendência Temporal (últimos dias): ${dashboardStats.overTimeData.map(d => `${d.date}: ${d.count}`).join(', ')}

        Forneça uma análise crítica sobre a distribuição de problemas, identifique qual linha de produto ou projeto está exigindo mais esforço e sugira uma estratégia de priorização. (NÃO CRIE TABELAS)`
        : lang === 'en'
        ? `Generate an executive report based on the following consolidated data from the Daily Issues Dashboard:
        - Total Issues: ${dashboardStats.totalIssues}
        - Active Projects: ${projects.length}
        - Avg Issues per Project: ${dashboardStats.avgIssuesPerProject}
        - Top 5 Projects with most Issues: ${dashboardStats.issuesPerProjectData.map(p => `${p.name} (${p.value})`).join(', ')}
        - Occurrences by Line: ${dashboardStats.lineDistributionData.map(l => `${l.name}: ${l.value}`).join(', ')}
        - Temporal Trend (last days): ${dashboardStats.overTimeData.map(d => `${d.date}: ${d.count}`).join(', ')}

        Provide a critical analysis of the distribution of problems, identify which product line or project is requiring the most effort, and suggest a prioritization strategy. (DO NOT CREATE TABLES)`
        : `다음의 통합된 일일 이슈 대시보드 데이터를 기반으로 경영진 보고서를 생성하십시오:
        - 총 이슈: ${dashboardStats.totalIssues}
        - 활성 프로젝트: ${projects.length}
        - 프로젝트당 평균 이슈: ${dashboardStats.avgIssuesPerProject}
        - 이슈가 가장 많은 상위 5개 프로젝트: ${dashboardStats.issuesPerProjectData.map(p => `${p.name} (${p.value})`).join(', ')}
        - 라인별 발생: ${dashboardStats.lineDistributionData.map(l => `${l.name}: ${l.value}`).join(', ')}
        - 시간적 추세 (최근 며칠): ${dashboardStats.overTimeData.map(d => `${d.date}: ${d.count}`).join(', ')}

        문제 분포에 대한 비판적 분석을 제공하고, 어떤 제품 라인이나 프로젝트가 가장 많은 노력을 필요로 하는지 파악하며, 우선순위 전략을 제안하십시오. (표를 생성하지 마십시오)`;

      const response = await fetch(`${getApiBaseUrl()}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `You are an SVP Project Manager and Data Analyst. Respond EXCLUSIVELY in ${langName}. Do not use any other language. Generate high-level executive reports.` },
            { role: 'user', content: prompt }
          ],
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        updateAnalysis(analysisId, { isAnalyzing: false, result: data.message?.content || (lang === 'pt' ? "Não foi possível gerar a análise executiva." : lang === 'en' ? "Could not generate executive analysis." : "경영진 분석을 생성할 수 없습니다.") });
      } else {
        throw new Error("Erro na API");
      }
    } catch (error) {
      updateAnalysis(analysisId, { isAnalyzing: false, result: t.errorAiConnection });
    }
  };

  // Issues Filtradas por Data e Termo de Busca
  const filteredIssuesByDate = useMemo(() => {
    return issues.filter(i => i.date === selectedDate && 
      (i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       getProjectName(i.project_id).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [issues, selectedDate, searchTerm, getProjectName]);

  // Agrupamento por Projeto para a Tabela
  const issuesGroupedByProject = useMemo(() => {
    const groups: Record<string, DailyIssue[]> = {};
    filteredIssuesByDate.forEach(i => {
      const pName = getProjectName(i.project_id);
      if (!groups[pName]) groups[pName] = [];
      groups[pName].push(i);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredIssuesByDate, getProjectName]);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate + 'T12:00:00Z');
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Estatísticas completas para o Dashboard
  const dashboardStats = useMemo(() => {
    if (issues.length === 0) return {
      totalIssues: 0,
      avgIssuesPerProject: '0',
      issuesPerProjectData: [],
      top10ProjectsData: [],
      overTimeData: [],
      weeklyData: [],
      lineDistributionData: []
    };

    // 1. Concentração por Projeto (TOP 5 e TOP 10)
    const issuesPerProjectMap: Record<string, number> = {};
    issues.forEach(i => {
      const name = getProjectName(i.project_id).toUpperCase();
      issuesPerProjectMap[name] = (issuesPerProjectMap[name] || 0) + 1;
    });

    const allProjectsData = Object.entries(issuesPerProjectMap)
      .map(([name, value], index) => ({
        name,
        value,
        color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'][index % 6]
      }))
      .sort((a, b) => b.value - a.value);

    const issuesPerProjectData = allProjectsData.slice(0, 5);
    const top10ProjectsData = allProjectsData.slice(0, 10);

    // 2. Fluxo Temporal (Últimos X dias)
    let daysToShow = 7;
    if (chartTimeRange === '15d') daysToShow = 15;
    else if (chartTimeRange === '30d') daysToShow = 30;

    const timeRangeDates = Array.from({ length: daysToShow }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const overTimeData = timeRangeDates.map(date => ({
      date: date.split('-').slice(1).reverse().join('/'), // DD/MM
      count: issues.filter(i => i.date === date).length
    }));

    // 3. Distribuição por Dia da Semana
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekMap: Record<string, number> = {};
    weekDays.forEach(d => weekMap[d] = 0);
    
    issues.forEach(i => {
      const d = new Date(i.date + 'T12:00:00Z');
      const dayName = weekDays[d.getDay()];
      weekMap[dayName]++;
    });
    const weeklyData = weekDays.map(name => ({ name, value: weekMap[name] }));

    // 4. Distribuição por Linha de Produto (S, A, M, Z, Tab)
    const lineMap: Record<string, number> = { 'S': 0, 'A': 0, 'M': 0, 'Z': 0, 'Tab': 0, 'Outros': 0 };
    issues.forEach(i => {
      const name = getProjectName(i.project_id).toUpperCase();
      if (name.includes('SM-S')) lineMap['S']++;
      else if (name.includes('SM-A')) lineMap['A']++;
      else if (name.includes('SM-M')) lineMap['M']++;
      else if (name.includes('SM-F')) lineMap['Z']++;
      else if (name.includes('SM-X') || name.includes('SM-T')) lineMap['Tab']++;
      else lineMap['Outros']++;
    });

    const lineDistributionData = Object.entries(lineMap)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name: `Linha ${name}`, value }));

    return {
      totalIssues: issues.length,
      avgIssuesPerProject: projects.length ? (issues.length / projects.length).toFixed(1) : '0',
      issuesPerProjectData,
      top10ProjectsData,
      overTimeData,
      weeklyData,
      lineDistributionData
    };
  }, [issues, projects, chartTimeRange, getProjectName]);

  // Lógica de Busca e Paginação da Governança
  const filteredProjectsGov = useMemo(() => {
    return projects.filter(p => 
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      (p.created_at && new Date(p.created_at).toLocaleDateString().includes(projectSearch))
    ).sort((a, b) => (b.id as number) - (a.id as number));
  }, [projects, projectSearch]);

  const paginatedProjectsGov = useMemo(() => {
    const start = (govPage - 1) * govItemsPerPage;
    return filteredProjectsGov.slice(start, start + govItemsPerPage);
  }, [filteredProjectsGov, govPage]);

  const totalGovPages = Math.ceil(filteredProjectsGov.length / govItemsPerPage);

  const mainBgClass = isDarkMode ? "bg-[#050505] text-zinc-300" : "bg-[#f5f5f7] text-zinc-800";
  const cardClass = `relative overflow-hidden rounded-xl border transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`;
  const inputStyle = `rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-black/40 border-white/10 text-white focus:bg-black focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-black/10 text-black focus:bg-white focus:ring-2 focus:ring-blue-500/10'}`;

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-10 transition-colors duration-1000 ${mainBgClass} overflow-x-hidden pb-20`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />
      <CustomToast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast(prev => ({ ...prev, visible: false }))} isDarkMode={isDarkMode} />

      {/* Modais de Importação JSON */}
      <JsonImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImportJson} 
        isDarkMode={isDarkMode} 
        t={t} 
        jsonInput={jsonInput} 
        setJsonInput={setJsonInput} 
        onShowExamples={() => setIsExampleModalOpen(true)}
        isImporting={isImporting}
      />
      
      <JsonExampleModal 
        isOpen={isExampleModalOpen} 
        onClose={() => setIsExampleModalOpen(false)} 
        isDarkMode={isDarkMode} 
        t={t} 
      />

      {/* Janelas de Análise de IA */}
      {activeAnalyses.map((analysis, idx) => (
        <React.Fragment key={analysis.id}>
          <AnalysisModal 
            isOpen={analysis.isOpen && !analysis.isMinimized} 
            onClose={() => setActiveAnalyses(prev => prev.filter(a => a.id !== analysis.id))}
            onMinimize={() => updateAnalysis(analysis.id, { isMinimized: true })}
            title={analysis.title}
            isAnalyzing={analysis.isAnalyzing}
            result={analysis.result}
            isDarkMode={isDarkMode}
          />
          
          {analysis.isOpen && analysis.isMinimized && (
            <FloatingAnalysisBubble 
              title={analysis.title}
              isAnalyzing={analysis.isAnalyzing}
              onOpen={() => updateAnalysis(analysis.id, { isMinimized: false })}
              isDarkMode={isDarkMode}
              index={activeAnalyses.filter(a => a.isOpen && a.isMinimized).indexOf(analysis)}
            />
          )}
        </React.Fragment>
      ))}

      <div className="w-full max-w-7xl relative z-10 space-y-10 px-4">
        
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

        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border-b border-black/5 dark:border-white/5 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> {t.badge}
            </div>
            <h1 className={`text-4xl lg:text-5xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{t.titleAccent}</span>
            </h1>
            <p className="text-sm font-bold opacity-50 max-w-sm">{t.subtitle}</p>
          </div>

          <div 
            style={{
              position: 'relative',
              display: 'flex',
              padding: '6px',
              width: '380px',
              maxWidth: '100%',
              borderRadius: '16px',
              transition: 'all 0.5s ease',
              backgroundColor: isDarkMode ? '#16161a' : '#f1f3f6',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: isDarkMode 
                ? 'inset 0 1px 1px rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.5)' 
                : 'inset 0 1px 1px rgba(0,0,0,0.02), 0 10px 20px rgba(0,0,0,0.05)',
            }}
          >
            {/* Spring-Bouncing & Color-Morphing Sliding Pill */}
            <div 
              style={{
                position: 'absolute',
                top: '6px',
                bottom: '6px',
                left: activeTab === 'registro' ? '6px' : 'calc(50% + 2px)',
                width: 'calc(50% - 8px)',
                transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                borderRadius: '12px',
                background: activeTab === 'registro'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                boxShadow: activeTab === 'registro'
                  ? '0 4px 14px rgba(16, 185, 129, 0.4)'
                  : '0 4px 14px rgba(99, 102, 241, 0.4)',
              }}
            />
            
            <button 
              onClick={() => setActiveTab('registro')} 
              style={{
                position: 'relative',
                zIndex: 10,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                paddingTop: '8px',
                paddingBottom: '8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                color: activeTab === 'registro' ? '#ffffff' : (isDarkMode ? '#a1a1aa' : '#71717a'),
                opacity: activeTab === 'registro' ? 1 : 0.7,
              }}
              className="hover:opacity-100 hover:scale-[1.02]"
            >
              <FileText 
                style={{
                  width: '14px',
                  height: '14px',
                  transition: 'all 0.5s ease',
                  transform: activeTab === 'registro' ? 'rotate(360deg) scale(1.1)' : 'none',
                  color: activeTab === 'registro' ? '#ffffff' : (isDarkMode ? '#71717a' : '#9ca3af'),
                }}
              />
              <span>{t.tabRegister}</span>
            </button>
            <button 
              onClick={() => setActiveTab('gestao')} 
              style={{
                position: 'relative',
                zIndex: 10,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                paddingTop: '8px',
                paddingBottom: '8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                color: activeTab === 'gestao' ? '#ffffff' : (isDarkMode ? '#a1a1aa' : '#71717a'),
                opacity: activeTab === 'gestao' ? 1 : 0.7,
              }}
              className="hover:opacity-100 hover:scale-[1.02]"
            >
              <BarChart3 
                style={{
                  width: '14px',
                  height: '14px',
                  transition: 'all 0.5s ease',
                  transform: activeTab === 'gestao' ? 'rotate(360deg) scale(1.1)' : 'none',
                  color: activeTab === 'gestao' ? '#ffffff' : (isDarkMode ? '#71717a' : '#9ca3af'),
                }}
              />
              <span>{t.tabManagement}</span>
            </button>
          </div>
        </header>

        <main className="w-full">
          {activeTab === 'registro' ? (
            <div className="space-y-8">
              <div className="flex flex-col gap-6">
                <Card className={`${cardClass} p-6 border-none !overflow-visible relative z-50 shadow-2xl w-full`}>
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest opacity-40 whitespace-nowrap">{t.registerIssue}</h2>
                      </div>
                      <Button 
                        onClick={() => setIsImportModalOpen(true)} 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl px-4 h-8 text-[9px] font-black uppercase tracking-widest border-blue-500/20 text-blue-500 hover:bg-blue-500/10 transition-all flex items-center gap-2"
                      >
                        <Zap className="w-3 h-3" /> {t.importJsonBtn}
                      </Button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 flex-grow w-full">
                      <div className="relative flex-grow sm:flex-1">
                        <Input 
                          placeholder={t.linkProjectPlaceholder} 
                          value={projectSearchTerm} 
                          onChange={e => { setProjectSearchTerm(e.target.value); setIsProjectDropdownOpen(true); }} 
                          onFocus={() => setIsProjectDropdownOpen(true)} 
                          onBlur={() => setTimeout(() => setIsProjectDropdownOpen(false), 200)} 
                          className={`${inputStyle} h-12 text-sm font-bold`} 
                        />
                        {isProjectDropdownOpen && projectSearchTerm.length > 0 && (
                          <div className={`absolute border-none z-50 w-full mt-2 rounded-xl border backdrop-blur-3xl shadow-2xl p-1 ${isDarkMode ? 'bg-[#1a1a1a]/95 border-white/10' : 'bg-white/95 border-black/10'}`}>
                            {projects.filter(p => p.name.toLowerCase().includes(projectSearchTerm.toLowerCase())).map(p => (
                              <div key={p.id} onClick={() => { setSelectedProjectId(p.id.toString()); setProjectSearchTerm(p.name); setIsProjectDropdownOpen(false); }} className={`px-4 py-2.5 text-xs font-bold cursor-pointer rounded-xl hover:bg-blue-500/10 transition-colors`}>{p.name}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-grow sm:flex-[2]">
                        <Input 
                          placeholder={t.issueDescriptionPlaceholder} 
                          value={issueTitle} 
                          onChange={e => setIssueTitle(e.target.value)} 
                          className={`${inputStyle} h-12 text-sm font-bold flex-grow`} 
                          onKeyDown={e => e.key === 'Enter' && handleCreateIssue()} 
                        />
                        <Button onClick={handleCreateIssue} className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 shrink-0">
                          {t.registerBtn}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className={`${cardClass} p-6 border-none flex flex-col md:flex-row items-center gap-6 shadow-xl w-full`}>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest opacity-40 whitespace-nowrap">{t.newProject}</h2>
                  </div>
                  <div className="flex gap-3 flex-grow w-full">
                    <Input placeholder={t.newProjectPlaceholder} value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className={`${inputStyle} h-12 text-sm font-bold flex-grow`} onKeyDown={e => e.key === 'Enter' && handleCreateProject()} />
                    <Button onClick={handleCreateProject} disabled={isCreatingProject} className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20 shrink-0">
                      {isCreatingProject ? <RefreshCw className="animate-spin" /> : t.createBtn}
                    </Button>
                  </div>
                </Card>
              </div>

              <Card className={`${cardClass} p-8 md:p-10 border-none`}>
                <div className="flex flex-col xl:flex-row justify-between items-center gap-8 mb-10 pb-8 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-6">
                    <button onClick={() => changeDate(-1)} className="p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"><ChevronLeft className="w-6 h-6" /></button>
                    <div className="text-center min-w-[200px]">
                      <h2 className="text-2xl font-black tracking-tighter uppercase">{selectedDate === getTodayString() ? t.today : formatDateLong(selectedDate, lang)}</h2>
                      <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">{formatDateBr(selectedDate)}</p>
                    </div>
                    <button onClick={() => changeDate(1)} className="p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"><ChevronRight className="w-6 h-6" /></button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <Button 
                      onClick={startDailyAnalysis}
                      disabled={filteredIssuesByDate.length === 0}
                      className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 gap-2 w-full sm:w-auto shrink-0"
                    >
                      <Bot className="w-4 h-4" /> {t.analyzeIssuesBtn}
                    </Button>
                    <div className="relative w-full sm:w-64 group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t.filterPlaceholder} className={`w-full pl-12 h-12 text-sm rounded-xl border transition-all outline-none ${isDarkMode ? 'bg-black/40 border-white/10 focus:border-blue-500/50' : 'bg-white border-black/10 focus:border-blue-500/50 shadow-inner'}`} />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 border-b border-black/5 dark:border-white/5">
                        <th className="px-6 py-4 text-left w-[300px]">{t.tableHeaderProject}</th>
                        <th className="px-6 py-4 text-left">{t.tableHeaderIssues}</th>
                        <th className="px-6 py-4 text-right w-[100px]">{t.tableHeaderAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {issuesGroupedByProject.length === 0 ? (
                        <tr><td colSpan={3} className="py-20 text-center opacity-30 font-black uppercase tracking-widest text-xs">{t.noRecords}</td></tr>
                      ) : (
                        issuesGroupedByProject.map(([projectName, projectIssues]) => (
                          <tr key={projectName} className="group transition-all hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                            <td className="px-6 py-6 align-top">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20"><Briefcase className="w-5 h-5" /></div>
                                <span className="font-black text-sm uppercase tracking-tight">{projectName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="space-y-3">
                                {projectIssues.map(issue => (
                                  <div key={issue.id} className="flex items-start gap-3 group/item">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-xl bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                                    <div className="flex-grow">
                                      <p className="text-sm font-bold leading-tight">{issue.title}</p>
                                      <span className="text-[8px] font-black uppercase opacity-30 tracking-widest flex items-center gap-1 mt-1"><Clock className="w-2.5 h-2.5" /> {new Date(issue.created_at || '').toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <button onClick={() => handleDeleteIssue(issue.id)} className="opacity-0 group-hover/item:opacity-100 p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-6 text-right align-top">
                              <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 text-[10px] font-black">{projectIssues.length}</div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="flex justify-end mb-4">
                <Button 
                  onClick={startDashboardAnalysis}
                  className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 gap-2 shrink-0"
                >
                  <TrendingUp className="w-4 h-4" /> {t.analyzeDashboardBtn}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: t.kpiActiveProjects, val: projects.length, icon: Briefcase, gradient: 'from-blue-500 to-indigo-600' },
                  { label: t.kpiTotalIssues, val: issues.length, icon: ListOrdered, gradient: 'from-purple-500 to-pink-600' },
                  { label: t.kpiAvgProject, val: dashboardStats?.avgIssuesPerProject || 0, icon: TrendingUp, gradient: 'from-emerald-400 to-teal-500' },
                  { label: t.kpiIssuesToday, val: issues.filter(i => i.date === getTodayString()).length, icon: Clock, gradient: 'from-orange-400 to-rose-500' }
                ].map((kpi, i) => (
                  <Card key={i} className={`${cardClass} p-6 flex items-center justify-between group hover:scale-[1.02]`}>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">{kpi.label}</p>
                      <p className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{kpi.val}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${kpi.gradient} shadow-lg group-hover:rotate-3 transition-all duration-500`}>
                      <kpi.icon className="w-6 h-6" />
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Card className={`${cardClass} lg:col-span-8 p-8 flex flex-col gap-8`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-blue-500" /> {t.chartTemporalTitle}
                    </h3>
                    <select value={chartTimeRange} onChange={(e) => setChartTimeRange(e.target.value)} className="bg-black/5 dark:bg-white/10 rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none outline-none cursor-pointer">
                      <option value="7d">7 {lang === 'pt' ? 'dias' : lang === 'en' ? 'days' : '일'}</option><option value="15d">15 {lang === 'pt' ? 'dias' : lang === 'en' ? 'days' : '일'}</option><option value="30d">30 {lang === 'pt' ? 'dias' : lang === 'en' ? 'days' : '일'}</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardStats?.overTimeData || []}>
                        <defs><linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#71717a' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#71717a' }} />
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: isDarkMode ? '#111' : '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className={`${cardClass} lg:col-span-4 p-8 flex flex-col gap-8`}>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                    <PieChartIcon className="w-3 h-3 text-purple-500" /> {t.chartConcentrationTitle}
                  </h3>
                  <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={dashboardStats?.issuesPerProjectData || []} 
                          cx="50%" cy="50%" 
                          innerRadius={60} outerRadius={80} 
                          paddingAngle={8} dataKey="value" 
                          stroke="none" cornerRadius={6}
                        >
                          {(dashboardStats?.issuesPerProjectData || []).map((entry: any, index: number) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#000', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black tracking-tighter">{dashboardStats?.issuesPerProjectData?.reduce((a:any, b:any) => a + b.value, 0)}</span>
                      <span className="text-[7px] font-black uppercase opacity-30">Total Top 5</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {dashboardStats?.issuesPerProjectData?.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-[9px] font-black uppercase p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-xl" style={{ backgroundColor: p.color }} />
                          <span className="opacity-60 truncate max-w-[120px]">{p.name}</span>
                        </div>
                        <span className="text-blue-500">{p.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className={`${cardClass} p-8 flex flex-col gap-6`}>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                    <PieChartIcon className="w-3 h-3 text-blue-500" /> {t.chartLineDistributionTitle}
                  </h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={dashboardStats?.lineDistributionData || []} 
                          cx="50%" cy="50%" 
                          innerRadius={60} outerRadius={85} 
                          paddingAngle={5} dataKey="value" 
                          nameKey="name"
                          stroke="none" cornerRadius={8}
                        >
                          {(dashboardStats?.lineDistributionData || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#10b981'][index % 6]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '1rem', 
                            border: 'none', 
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                            color: isDarkMode ? '#fff' : '#000',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                          itemStyle={{ color: isDarkMode ? '#fff' : '#000', fontSize: '10px', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    {dashboardStats?.lineDistributionData?.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-xl" style={{ backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#10b981'][index % 6] }} />
                        <span className="text-[9px] font-black uppercase opacity-60">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className={`${cardClass} p-8 flex flex-col gap-6`}>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                    <BarChart3 className="w-3 h-3 text-purple-500" /> {t.chartTop10Title}
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardStats?.top10ProjectsData || []} margin={{ bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          tick={{fontSize: 11, fontWeight: 'bold', fill: isDarkMode ? '#a1a1aa' : '#3f3f46'}} 
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold'}} />
                        <Tooltip 
                          cursor={{fill: 'rgba(59, 130, 246, 0.05)'}} 
                          contentStyle={{borderRadius: '1rem', border: 'none', backgroundColor: isDarkMode ? '#111' : '#fff', fontSize: '12px'}} 
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={25} fill="#a855f7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <Card className={`${cardClass} p-8 md:p-10 border-none`}>
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-10 pb-8 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{t.govTitle}</h2>
                      <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{t.govSubtitle}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full md:w-64 group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-30 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        value={projectSearch} 
                        onChange={e => { setProjectSearch(e.target.value); setGovPage(1); }} 
                        placeholder={t.govSearchPlaceholder} 
                        className={`w-full pl-10 h-10 text-xs rounded-xl border transition-all outline-none ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-black/10 shadow-inner'}`} 
                      />
                    </div>
                    <Button onClick={() => {
                      const headers = ['ID', 'Projeto', 'Issues'];
                      const rows = projects.map(p => [p.id, p.name, issues.filter(i => i.project_id.toString() === p.id.toString()).length]);
                      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = 'governança_projetos.csv'; a.click();
                    }} className="h-10 px-6 rounded-xl font-black text-[10px] uppercase gap-2 bg-zinc-900 dark:bg-white dark:text-black shrink-0">
                      <RefreshCw className="w-3.5 h-3.5" /> {t.exportCsvBtn}
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className={`text-[10px] font-black uppercase tracking-[0.2em] border-b ${isDarkMode ? 'border-white/10 text-zinc-500' : 'border-black/10 text-zinc-400'}`}>
                        <th className="px-6 py-4 text-left">{t.govTableHeaderModel}</th>
                        <th className="px-6 py-4 text-center">{t.govTableHeaderDate}</th>
                        <th className="px-6 py-4 text-center">{t.govTableHeaderVolume}</th>
                        <th className="px-6 py-4 text-right">{t.govTableHeaderActions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {paginatedProjectsGov.length === 0 ? (
                        <tr><td colSpan={4} className="py-12 text-center opacity-30 font-black uppercase tracking-widest text-[10px]">{t.govNoProjects}</td></tr>
                      ) : (
                        paginatedProjectsGov.map(p => {
                          const count = issues.filter(i => i.project_id.toString() === p.id.toString()).length;
                          return (
                            <tr key={p.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5 group">
                              <td className="px-6 py-4 font-black uppercase text-sm tracking-tight">{p.name}</td>
                              <td className="px-6 py-4 text-center opacity-40 text-xs font-bold">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '---'}</td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black border inline-flex items-center gap-2 ${count > 0 ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'}`}>
                                  {count} {t.govOccurrences}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="ghost" onClick={async () => {
                                  if(count > 0) return showToast("Remova as issues antes de deletar o projeto.", "warning");
                                  if(!confirm("Deletar projeto permanentemente?")) return;
                                  const res = await fetch(`${getApiBaseUrl()}/daily-projects/${p.id}`, { method: 'DELETE' });
                                  if(res.ok) { setProjects(projects.filter(proj => proj.id !== p.id)); showToast("Projeto removido."); }
                                }} className="text-rose-500 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {totalGovPages > 1 && (
                  <div className="flex justify-center items-center gap-4 pt-6 border-t border-black/5 dark:border-white/5">
                    <button disabled={govPage === 1} onClick={() => setGovPage(govPage - 1)} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-10 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                    <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase opacity-40">{t.page}</span><span className="text-sm font-black text-blue-500">{govPage}</span><span className="text-[10px] font-black uppercase opacity-40">{t.pageOf} {totalGovPages}</span></div>
                    <button disabled={govPage === totalGovPages} onClick={() => setGovPage(govPage + 1)} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-10 transition-all"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                )}
              </Card>
            </div>
          )}
        </main>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128, 128, 128, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default function DailyIssuesPage() {
  const { isDarkMode } = useTheme();
  // Nota: o fallback deve ser estático ou usar uma tradução padrão já que Suspense roda antes do client render
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase opacity-20 tracking-widest">Iniciando Daily...</div>}>
      <DailyIssuesContent />
    </Suspense>
  );
}