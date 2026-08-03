'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle,
  Search,
  Save,
  ChevronDown,
  X,
  AlertCircle,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Database,
  FileText,
  Info
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from '@/components/navbar';
import { useTheme } from '@/components/theme-provider';

// --- COMPONENTE DE FUNDO ANIMADO (PADRÃO DO SISTEMA) ---
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
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-lg blur-[120px] opacity-20 animate-pulse 
        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '8s' }} 
      />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-lg blur-[120px] opacity-20 animate-pulse
        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
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

// ==========================================
// 1. COMPONENTE TOAST
// ==========================================

function CustomToast({ message, type, isVisible, onClose, isDarkMode }: any) {
  if (!isVisible) return null;
  const glassStyle = isDarkMode ? 'bg-black/80 border-white/10 text-gray-100' : 'bg-white/80 border-white/40 text-gray-800';
  let iconColor = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-orange-500';
  let Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : AlertTriangle;

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 max-w-sm ${glassStyle}`}>
      <div className={`p-2 rounded-lg bg-opacity-10 ${iconColor.replace('text-', 'bg-')}`}><Icon className={`w-5 h-5 ${iconColor}`} /></div>
      <div className="flex-1"><p className="text-sm font-medium leading-tight">{message}</p></div>
      <button onClick={onClose}><X className="w-4 h-4 opacity-60" /></button>
    </div>
  );
}

// ==========================================
// 2. UTILITÁRIOS E CONFIGURAÇÃO
// ==========================================

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:8001`;
  }
  return 'http://localhost:8001';
};

const API_URL = getApiUrl();

const getTodayISO = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const formatDateForOutput = (isoDate: string, separator = '/', fullYear = false) => {
    if (!isoDate) return '';
    try {
        const [yyyy, mm, dd] = isoDate.split('-');
        const yy = fullYear ? yyyy : yyyy.slice(-2);
        return `${dd}${separator}${mm}${separator}${yy}`;
    } catch (e) {
        return isoDate;
    }
};

const formatToTime = (val: string) => {
    if (!val) return '';
    const clean = val.replace(/[^0-9:]/g, '');
    if (!clean) return '';

    let hours = 0;
    let minutes = 0;

    if (clean.includes(':')) {
        const parts = clean.split(':');
        hours = parseInt(parts[0], 10) || 0;
        minutes = parseInt(parts[1], 10) || 0;
    } else {
        hours = parseInt(clean, 10) || 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Clipboard API failed', err);
        }
    }
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    } catch (err) {
        console.error('Fallback copy failed', err);
        return false;
    }
};

type Language = 'pt' | 'en' | 'ko';

const translations = {
  pt: {
    badge: "Data Quality",
    title: "Remarks",
    titleAccent: "SVP",
    subtitle: "Unificação e governança de registros técnicos para auditoria.",
    cardTitle: "Gerador de Remarks",
    cardSubtitle: "Relatórios automatizados e padronizados.",
    btnCopy: "Copiar Saída",
    btnCopiado: "Copiado!",
    labelGenerated: "Saída Gerada",
    teamSelection: "Selecione seu Time Especialista",
    generalInfo: "Informações Gerais",
    dailyHistory: "Histórico Diário",
    reportedIssues: "Problemas Reportados",
    referencedIssues: "Problemas Referenciados",
    appsVersions: "Apps & Versões",
    selectTestItem: "Selecione o Item de Teste",
    addBtn: "Adicionar",
    addRow: "Adicionar Linha",
    addDay: "Adicionar Dia",
    addApp: "Adicionar App",
    totals: "Totais",
    validationError: "Por favor, preencha todos os campos obrigatórios antes de copiar.",
    copySuccess: "Relatório copiado para a área de transferência!",
    historySubtitle: "Controle de execução e produtividade",
    tester: "Testador",
    date: "Data",
    plmExecution: "Execução PLM",
    spreadsheetExecution: "Execução Planilha",
    timeSpent: "Tempo Gasto",
    dailyResult: "Resultado do Dia",
    autoCalculation: "Cálculo Automático",
    consolidatedGeneral: "Consolidado Geral",
    sumPlmSpreadsheet: "Soma PLM + Planilha",
    totalAccumulated: "Total acumulado dos dias",
    totalTime: "Tempo Total",
    appName: "NOME DO APP",
    version: "VERSÃO",
    criticality: "CRITIC.",
    issueId: "ID PROBLEMA",
    bugDescription: "DESCRIÇÃO DO BUG / COMPORTAMENTO",
    testerResponsible: "Responsável pelo Teste",
    executionDate: "Data da Execução",
    executionMetric: "Métrica de Execução",
    hoursMinutes: "Horas : Minutos",
    timeFormat: "Formato HH:MM"
  },
  en: {
    badge: "Data Quality",
    title: "Remarks",
    titleAccent: "SVP",
    subtitle: "Technical log unification and governance for auditing.",
    cardTitle: "Remarks Generator",
    cardSubtitle: "Automated and standardized reports.",
    btnCopy: "Copy Output",
    btnCopiado: "Copied!",
    labelGenerated: "Generated Output",
    teamSelection: "Select your Specialist Team",
    generalInfo: "General Information",
    dailyHistory: "Daily History",
    reportedIssues: "Reported Issues",
    referencedIssues: "Referenced Issues",
    appsVersions: "Apps & Versions",
    selectTestItem: "Select Test Item",
    addBtn: "Add",
    addRow: "Add Row",
    addDay: "Add Day",
    addApp: "Add App",
    totals: "Totals",
    validationError: "Please fill in all required fields before copying.",
    copySuccess: "Report copied to clipboard!",
    historySubtitle: "Execution and productivity control",
    tester: "Tester",
    date: "Date",
    plmExecution: "PLM Execution",
    spreadsheetExecution: "Spreadsheet Execution",
    timeSpent: "Time Spent",
    dailyResult: "Daily Result",
    autoCalculation: "Auto Calculation",
    consolidatedGeneral: "General Consolidated",
    sumPlmSpreadsheet: "Sum PLM + Spreadsheet",
    totalAccumulated: "Accumulated total of days",
    totalTime: "Total Time",
    appName: "APP NAME",
    version: "VERSION",
    criticality: "CRITIC.",
    issueId: "ISSUE ID",
    bugDescription: "BUG DESCRIPTION / BEHAVIOR",
    testerResponsible: "Testing Responsible",
    executionDate: "Execution Date",
    executionMetric: "Execution Metric",
    hoursMinutes: "Hours : Minutes",
    timeFormat: "HH:MM Format"
  },
  ko: {
    badge: "데이터 품질",
    title: "비고",
    titleAccent: "표준화",
    subtitle: "감사를 위한 기술 로그 통합 및 거버넌스.",
    cardTitle: "비고 생성기",
    cardSubtitle: "자동화 및 표준화된 보고서.",
    btnCopy: "출력 복사",
    btnCopiado: "복사됨!",
    labelGenerated: "생성된 출력",
    teamSelection: "전문가 팀 선택",
    generalInfo: "일반 정보",
    dailyHistory: "일일 이력",
    reportedIssues: "보고된 문제",
    referencedIssues: "참조된 문제",
    appsVersions: "앱 및 버전",
    selectTestItem: "테스트 항목 선택",
    addBtn: "추가",
    addRow: "행 추가",
    addDay: "날짜 추가",
    addApp: "앱 추가",
    totals: "총계",
    validationError: "복사하기 전에 모든 필수 필드를 채워주세요.",
    copySuccess: "보고서가 클립보드에 복사되었습니다!",
    historySubtitle: "실행 및 생산성 제어",
    tester: "테스터",
    date: "날짜",
    plmExecution: "PLM 실행",
    spreadsheetExecution: "스프레드시트 실행",
    timeSpent: "소요 시간",
    dailyResult: "일일 결과",
    autoCalculation: "자동 계산",
    consolidatedGeneral: "일반 통합",
    sumPlmSpreadsheet: "PLM + 스프레드시트 합계",
    totalAccumulated: "누적 총 일수",
    totalTime: "총 시간",
    appName: "앱 이름",
    version: "버전",
    criticality: "심각도",
    issueId: "이슈 ID",
    bugDescription: "버그 설명 / 동작",
    testerResponsible: "테스트 책임자",
    executionDate: "실행 날짜",
    executionMetric: "실행 지표",
    hoursMinutes: "시 : 분",
    timeFormat: "HH:MM 형식"
  }
};

// --- GENERATORS ---
const generateRemark = (team: string, data: any) => {
    const formatList = (items: any[]) => {
        if (!items || items.length === 0) return '';
        return items.map(i => i.value).filter(v => v.trim() !== '').join(', ');
    };

    const formatIssues = (issues: any[], teamName: string) => {
        const hasContent = issues.some((item: any) => item.criticality || item.issueId);
        if (!hasContent) return '';

        return issues.map((item: any, index: number) => {
            if (!item.criticality && !item.issueId) return null;
            const critVal = item.criticality.trim();
            const idVal = item.issueId.trim();
            const descVal = item.description.trim();
            let line = '';

            if (teamName === 'Multimidia') {
                const cleanCrit = critVal.replace(/[\[\]]/g, '');
                const cleanId = idVal.replace(/[\[\]]/g, '');
                line = `${cleanCrit} - ${cleanId}${descVal ? ' - ' + descVal : ''}`; 
            } else {
                const crit = critVal.startsWith('[') ? critVal : `[${critVal}]`;
                const id = idVal.startsWith('[') ? idVal : `[${idVal}]`;
                line = `${crit}${id} ${descVal}`;
                if (['Apps1', 'Apps2'].includes(teamName)) {
                    line = `${index + 1}. ${line}`;
                }
            }
            return line;
        }).filter(Boolean).join('\n\n');
    };

    const formatHistory = (history: any[], teamName: string) => {
        if (!history || history.length === 0) return '';
        const separator = ['Apps1', 'Apps2'].includes(teamName) ? '.' : '/';
        
        return history.map((day: any, idx: number) => {
            const testerStr = day.tester || '';
            const timeStr = day.time ? formatToTime(day.time) : '';
            const noTestStr = day.noTestingTime ? ` (${formatToTime(day.noTestingTime)})` : '';
            
            const pass = day.pass !== '' ? day.pass : '0';
            const fail = day.fail !== '' ? day.fail : '0';
            const na = day.na !== '' ? day.na : '0';

            if (teamName === 'PhoneSettings') {
                const fullDate = formatDateForOutput(day.date, '/', true); 
                const type = idx === history.length - 1 ? 'Result' : 'Parcial';
                return `# [${fullDate}][${type}]\nTesting time: ${timeStr}\n[Pass: ${pass}][NA: ${na}][Fail: ${fail}]`;
            } 
            else if (['Apps1', 'Apps2'].includes(teamName)) {
                const dateStr = formatDateForOutput(day.date, separator);
                return `${testerStr} - ${dateStr} - Pass/Fail/NA: ${pass}/${fail}/${na} - ${timeStr}${noTestStr}`;
            } 
            else if (teamName === 'Multimidia') {
                const dateStr = formatDateForOutput(day.date, separator);
                return `${testerStr} - ${dateStr}: ${pass}/${fail}/${na} - ${timeStr}${noTestStr}`;
            } 
            else {
                const dateStr = formatDateForOutput(day.date, separator);
                return `${testerStr} ${dateStr} - ${timeStr}${noTestStr} - (${pass}/${fail}/${na})`;
            }
        }).join('\n\n');
    };

    const formatApps = (apps: any[], style = 'default') => {
        if (!apps || apps.length === 0) return '';
        return apps.map((app: any) => {
            if(!app.name && !app.version) return null;
            if (style === 'brackets') return `${app.name}[${app.version}]`;
            return `${app.name}: ${app.version}`;
        }).filter(Boolean).join('\n');
    };

    const calculateStats = (historyItems: any[]) => {
        let totalMinutes = 0;
        let totalPass = 0;
        let totalFail = 0;
        let totalNa = 0;

        if (!historyItems) return { time: '00:00', pass: 0, fail: 0, na: 0 };

        historyItems.forEach(day => {
            totalPass += Math.max(0, parseInt(day.pass, 10) || 0);
            totalFail += Math.max(0, parseInt(day.fail, 10) || 0);
            totalNa += Math.max(0, parseInt(day.na, 10) || 0);
            
            if (day.time) {
                let h = 0, m = 0;
                if (day.time.includes(':')) {
                    const parts = day.time.split(':');
                    h = parseInt(parts[0], 10) || 0;
                    m = parseInt(parts[1], 10) || 0;
                } else if (!isNaN(parseInt(day.time, 10))) {
                    h = parseInt(day.time, 10) || 0;
                }
                totalMinutes += (h * 60) + m;
            }
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        return { time: timeStr, pass: totalPass, fail: totalFail, na: totalNa };
    };

    const commonHeader = `[${team}]`;
    const issuesReportedStr = formatIssues(data.issuesRep, team);
    const issuesReferencedStr = formatIssues(data.issuesRef, team);
    const historyStr = formatHistory(data.testHistory, team);
    const totalStats = calculateStats(data.testHistory);

    if (team === 'Multimidia') {
        const appsSection = formatApps(data.multimidiaApps);
        const testersMap: any = {};
        const uniqueTestersList: string[] = [];

        data.testHistory.forEach((h: any) => {
            if (!h.tester) return;
            if (!testersMap[h.tester]) {
                testersMap[h.tester] = [];
                uniqueTestersList.push(h.tester);
            }
            testersMap[h.tester].push(h);
        });

        const testersBlocks = uniqueTestersList.map((testerName, index) => {
            const tStats = calculateStats(testersMap[testerName]);
            const sample = data.sampleIds[index]?.value || (data.sampleIds[0]?.value || '');
            const account = data.accounts[index]?.value || (data.accounts[0]?.value || '');
            const sim = data.simCards[index]?.value || (data.simCards[0]?.value || '');
            const infoParts = [];
            if (sample) infoParts.push(sample);
            if (account) infoParts.push(account);
            if (sim) infoParts.push(sim);
            return `${testerName}: ${infoParts.join(', ')}\nPASS/FAIL/NA: ${tStats.pass}/${tStats.fail}/${tStats.na}\nTime: ${tStats.time}`;
        }).join('\n\n');

        return `${commonHeader}\nTotal Result\nTime: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}\n\n${testersBlocks}\n\nTest History\n${historyStr}\n\nIssue Reported:\n${issuesReportedStr}\n\nIssue Ref:\n${issuesReferencedStr}\n\nApps Ver:\n${appsSection}`;
    }

    if (['Wearables', 'Sanity'].includes(team)) {
        let remarksContent = '';
        const deviceIdStr = formatList(data.deviceIds);
        if (team === 'Wearables') {
            let remarksLines = [`#1. Device ID: ${deviceIdStr}`];
            if (data.wearableApps?.length > 0) {
                data.wearableApps.forEach((app: any, index: number) => {
                    if (app.name || app.version) remarksLines.push(`#${2 + index}. ${app.name}: ${app.version}`);
                });
            }
            remarksContent = remarksLines.join('\n') + `\n#${remarksLines.length + 1}. Tester history (Pass/Fail/NA):\n${historyStr}\n\nTime Total: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}`;
        } else {
            const googleStr = formatList(data.accounts);
            const samsungStr = formatList(data.samsungAccounts);
            const simStr = formatList(data.simCards);
            const extras = `#2. Google account: ${googleStr}\n#3. Samsung account: ${samsungStr}\n#4. SIM card: ${simStr}`;
            remarksContent = `#1. Device ID: ${deviceIdStr}\n${extras}\n#5. Tester history (Pass/Fail/NA):\n${historyStr}\n\nTime Total: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}`;
        }
        return `${commonHeader}\n[Issue reported]\n${issuesReportedStr}\n\n[Issue referenced]\n${issuesReferencedStr}\n\n[REMARKS]\n${remarksContent}`;
    }

    if (team === 'Apps2') {
        const appsSection = formatApps(data.generalApps);
        const deviceIdStr = formatList(data.deviceIds);
        const googleStr = formatList(data.accounts);
        const samsungStr = formatList(data.samsungAccounts);
        const simStr = formatList(data.simCards);
        const extras = `#2. Google account: ${googleStr}\n#3. Samsung account: ${samsungStr}\n#4. SIM card: ${simStr}`;
        return `${commonHeader}\n\n[Issue reported]\n${issuesReportedStr}\n\n[Issue referenced]\n${issuesReferencedStr}\n\n[REMARKS]\n#1. Device ID: ${deviceIdStr}\n${extras}\n#5. Tester history (Pass/Fail/NA):\n${historyStr}\n\nTime Total: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}\n\n\n[APPS VERSION]\n${appsSection}`;
    }

    if (team === 'PhoneSettings') {
        const appsSection = formatApps(data.generalApps, 'brackets');
        const formattedIssuesRef = issuesReferencedStr ? `\n${issuesReferencedStr}` : ' [0]';
        const formattedIssuesRep = issuesReportedStr ? `\n${issuesReportedStr}` : ' [00]';
        const uniqueTesters = [...new Set(data.testHistory.map((d: any) => d.tester).filter((t: any) => t))].join(', ');
        const devId = data.deviceIds.map((d: any) => d.value ? (d.value.startsWith('[') ? d.value : `[${d.value}]`) : '').join('');
        const accountStr = formatList(data.accounts);
        const samsungAccountStr = formatList(data.samsungAccounts);
        const simStr = data.simCards.map((i: any) => i.value).filter((v: any) => v.trim()).join('\n');
        return `${commonHeader}\nGoogle Account: ${accountStr}\nSamsung Account: ${samsungAccountStr}\nTester: ${uniqueTesters}\nDevices ID :${devId || '[]'}\nIssue ID Referenced: ${formattedIssuesRef}\nIssue ID: ${formattedIssuesRep}\n\n${simStr}\nApps:\n${appsSection}\n${historyStr}\n\nTime Total: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}`;
    }

    if (team === 'Apps1') {
        const appsSection = formatApps(data.generalApps);
        const mainTester = data.testHistory[0]?.tester || '';
        const devStr = `Device ID/HW: ${formatList(data.deviceIds)}`;
        const googleStr = `Google account: ${formatList(data.accounts)}`;
        const samsungStr = `Samsung account: ${formatList(data.samsungAccounts)}`;
        const simStr = `SIM Card: ${formatList(data.simCards)}`;
        return `${commonHeader}\n[Remarks]\nTester ID: ${mainTester}\n${devStr}\n${googleStr}\n${samsungStr}\n${simStr}\nTime Total: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}\n\n[App versions]\n${appsSection}\n\n[Test history]\n${historyStr}\n\n[Issue reported]\n${issuesReportedStr}\n\n[Issue referenced]\n${issuesReferencedStr}\n`;
    }
    return "Selecione um time.";
};

const APPS1_TEST_ITEMS: Record<string, string[]> = {
  "Accessibility": ["Accessibility", "Talkback", "TTS"],
  "GMS": ["Google", "Maps", "Play Store"],
  "Samsung Account": ["Samsung Account"],
  "Find My Mobile": ["Find My Mobile"],
  "Basic Apps": ["Facebook", "Telegram", "Whatsapp", "Whatsapp Business", "TikTok", "Snapchat", "Messenger", "X", "Instagram", "Secure Folder"],
  "Home Test": ["Home Test"],
  "S finder": ["S finder"],
  "Edge Test": ["Edge Test"],
  "Mobile Service Manager": ["Mobile Service Manager"]
};

// ==========================================
// 3. SUB-COMPONENTES (DESIGN LIQUID GLASS)
// ==========================================

const getBaseInputStyle = (isDark: boolean) => 
    `w-full p-3 text-sm transition-all duration-300 rounded-xl outline-none backdrop-blur-md shadow-sm
    ${isDark 
        ? 'bg-black/40 border border-white/10 text-gray-100 placeholder-gray-500 focus:bg-black focus:ring-2 focus:ring-blue-500/20' 
        : 'bg-white/60 border border-white/50 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10'
    }`;

const getLabelStyle = (isDark: boolean) => 
    `block text-[10px] font-bold tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2 uppercase ml-1`;

const getSectionStyle = (isDark: boolean) =>
    `mb-8 p-6 rounded-xl transition-all duration-500 relative backdrop-blur-2xl border
    ${isDark 
        ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 focus-within:z-20' 
        : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 focus-within:z-20'
    }`;

const AutocompleteInput = ({ label, name, value, onChange, placeholder, className = "", isDarkMode, t }: any) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (value.length < 3) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }
            try {
                const res = await fetch(`${API_URL}/search?field=${name}&query=${value}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                    if (data.length > 0) setShowSuggestions(true);
                }
            } catch (err) {}
        };
        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [value, name]);

    const handleSelect = (val: string) => {
        onChange({ target: { name, value: val } });
        setShowSuggestions(false);
    };

    return (
        <div className={`w-full relative overflow-visible ${className}`} ref={wrapperRef}>
            {label && <label className={getLabelStyle(isDarkMode)}>{label}</label>}
            <div className="relative group">
                <input 
                    type="text" 
                    name={name} 
                    value={value} 
                    onChange={onChange} 
                    onFocus={() => { if (value.length >= 3 && suggestions.length > 0) setShowSuggestions(true); }}
                    placeholder={placeholder}
                    className={getBaseInputStyle(isDarkMode)}
                    autoComplete="off"
                />
                <Search className={`absolute right-3 top-3.5 h-4 w-4 transition-colors ${isDarkMode ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className={`absolute z-[9999] w-full bottom-full mb-2 max-h-60 overflow-y-auto rounded-lg border backdrop-blur-xl shadow-2xl p-1
                        ${isDarkMode ? 'bg-[#1a1a1a]/95 border-white/10' : 'bg-white/95 border-white/60'}`}>
                        {suggestions.map((s, idx) => (
                            <li key={idx} onClick={() => handleSelect(s)} className={`p-2.5 text-sm cursor-pointer rounded-lg transition-all ${isDarkMode ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-black/5'}`}>
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

const DynamicInputList = ({ label, name, items, onUpdate, onAdd, onRemove, placeholder, isDarkMode, zIndexBase = 50, t }: any) => (
    <div className="mb-6 relative">
        <div className={`flex justify-between items-end border-b pb-2 mb-4 ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
            <label className={`text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>
            <button onClick={onAdd} className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-all rounded-lg px-3 py-1 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-black/5'}`}>
                <Plus className="h-3 w-3" /> {t.addBtn}
            </button>
        </div>
        {items.map((item: any, index: number) => (
            <div key={item.id} className="flex gap-3 mb-3 items-center group relative !focus-within:z-[100]" style={{ zIndex: zIndexBase - index }}>
                <div className="flex-grow">
                    <AutocompleteInput name={name} value={item.value} onChange={(e: any) => onUpdate(item.id, e.target.value)} placeholder={placeholder} isDarkMode={isDarkMode} t={t} />
                </div>
                <button onClick={() => onRemove(item.id)} className={`p-3 rounded-lg transition-all opacity-60 group-hover:opacity-100 ${isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        ))}
    </div>
);

const DynamicIssueList = ({ label, items, onUpdate, onAdd, onRemove, isDarkMode, t }: any) => (
    <div className={getSectionStyle(isDarkMode)}>
        <div className={`flex justify-between items-end border-b pb-4 mb-6 ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
            <label className={`text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>
            <button onClick={onAdd} className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-all rounded-lg px-3 py-1 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-black/5'}`}>
                <Plus className="h-3 w-3" /> {t.addRow}
            </button>
        </div>
        <div className="flex gap-3 text-[10px] font-bold tracking-wide mb-2 px-2 text-gray-500">
            <div className="w-24 text-center">{t.criticality}</div>
            <div className="w-36 text-center">{t.issueId}</div>
            <div className="flex-grow">{t.bugDescription}</div>
            <div className="w-10"></div>
        </div>
        {items.map((item: any) => (
            <div key={item.id} className="flex gap-3 mb-3 items-center group">
                <div className="w-24 relative">
                    <select value={item.criticality} onChange={(e) => onUpdate(item.id, 'criticality', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} text-center font-mono cursor-pointer appearance-none`}>
                        <option value="" className="text-gray-500">-</option>
                        <option value="[A]">[A]</option>
                        <option value="[B]">[B]</option>
                        <option value="[C]">[C]</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-3.5 h-3 w-3 pointer-events-none opacity-50" />
                </div>
                <div className="w-36">
                    <input type="text" value={item.issueId} onChange={(e) => onUpdate(item.id, 'issueId', e.target.value)} placeholder="P..." className={`${getBaseInputStyle(isDarkMode)} text-center font-mono`} />
                </div>
                <div className="flex-grow">
                    <input type="text" value={item.description} onChange={(e) => onUpdate(item.id, 'description', e.target.value)} placeholder={`${t.bugDescription}...`} className={getBaseInputStyle(isDarkMode)} />
                </div>
                <button onClick={() => onRemove(item.id)} className={`p-3 rounded-lg transition-all opacity-60 group-hover:opacity-100 ${isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        ))}
    </div>
);

const DynamicHistoryList = ({ items, onUpdate, onAdd, onRemove, isDarkMode, t, team }: any) => {
    const handleTimeChange = (id: number, field: string, value: string) => {
        const nums = value.replace(/[^0-9]/g, '');
        let formatted = nums;
        if (nums.length > 2) formatted = `${nums.slice(0, 2)}:${nums.slice(2, 4)}`;
        onUpdate(id, field, formatted);
    };
    const handleNumberChange = (id: number, field: string, value: string) => {
        if (value === '') { onUpdate(id, field, value); return; }
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 0 && num <= 999) { onUpdate(id, field, value); }
    };
    const totals = items.reduce((acc: any, curr: any) => {
        acc.pass += Math.max(0, parseInt(curr.pass, 10) || 0);
        acc.fail += Math.max(0, parseInt(curr.fail, 10) || 0);
        acc.na += Math.max(0, parseInt(curr.na, 10) || 0);
        if (curr.time) {
            let h = 0, m = 0;
            if (curr.time.includes(':')) { const parts = curr.time.split(':'); h = parseInt(parts[0], 10) || 0; m = parseInt(parts[1], 10) || 0; } 
            else if (!isNaN(parseInt(curr.time, 10))) { h = parseInt(curr.time, 10) || 0; }
            acc.minutes += (h * 60) + m;
        }
        return acc;
    }, { pass: 0, fail: 0, na: 0, minutes: 0 });
    const totalHours = Math.floor(totals.minutes / 60);
    const totalMins = totals.minutes % 60;
    const totalTimeStr = `${String(totalHours).padStart(2, '0')}:${String(totalMins).padStart(2, '0')}`;

    const isMultimidia = team === 'Multimidia';

    return (
    <div className={getSectionStyle(isDarkMode)}>
        <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
                <label className={`text-sm font-black tracking-widest uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.dailyHistory}</label>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{t.historySubtitle}</p>
            </div>
            <button onClick={onAdd} className={`text-[10px] uppercase font-black tracking-widest flex items-center gap-2 transition-all rounded-lg px-5 py-2.5 shadow-sm border ${isDarkMode ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500' : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-blue-600/10'}`}>
                <Plus className="h-3.5 w-3.5" /> {t.addDay}
            </button>
        </div>

        <div className="space-y-6">
            {items.map((item: any, index: number) => (
                <div key={item.id} className={`p-6 rounded-xl border transition-all duration-500 group relative !focus-within:z-[100] ${isDarkMode ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-gray-50/50 border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/5'}`} style={{ zIndex: 100 - index }}>
                    <button onClick={() => onRemove(item.id)} className={`absolute -top-2 -right-2 p-2 rounded-lg shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-red-500 text-white' : 'bg-red-600 text-white'}`}>
                        <X className="h-3.5 w-3.5" />
                    </button>

                    {isMultimidia ? (
                        <div className="flex flex-col gap-6">
                            {/* Header: Tester & Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase opacity-30 tracking-[0.2em] ml-1">{t.testerResponsible}</label>
                                    <AutocompleteInput name="testerId" value={item.tester} onChange={(e: any) => onUpdate(item.id, 'tester', e.target.value)} placeholder={t.tester} isDarkMode={isDarkMode} t={t} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase opacity-30 tracking-[0.2em] ml-1">{t.executionDate}</label>
                                    <input type="date" value={item.date} onChange={(e) => onUpdate(item.id, 'date', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} text-xs font-bold px-4 h-11`} />
                                </div>
                            </div>

                            {/* Cards: PLM | Planilha | Consolidado */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* PLM Card */}
                                <div className={`p-5 rounded-lg border flex flex-col gap-5 ${isDarkMode ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50/50 border-blue-100'}`}>
                                    <div className="flex items-center gap-2 opacity-60">
                                        <Database size={14} className="text-blue-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t.plmExecution}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input type="number" value={item.plmPass} onChange={(e) => handleNumberChange(item.id, 'plmPass', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} h-10 text-center text-xs font-black text-green-500 bg-green-500/5 border-green-500/10`} placeholder="P" title="Pass" />
                                        <input type="number" value={item.plmFail} onChange={(e) => handleNumberChange(item.id, 'plmFail', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} h-10 text-center text-xs font-black text-red-500 bg-red-500/5 border-red-500/10`} placeholder="F" title="Fail" />
                                        <input type="number" value={item.plmNa} onChange={(e) => handleNumberChange(item.id, 'plmNa', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} h-10 text-center text-xs font-black text-yellow-500 bg-yellow-500/5 border-yellow-500/10`} placeholder="N" title="NA" />
                                    </div>
                                    <div className="relative">
                                        <label className="text-[8px] font-black uppercase opacity-40 tracking-widest block mb-1.5 ml-1">{t.timeSpent}</label>
                                        <input type="text" value={item.plmTime} onChange={(e) => handleTimeChange(item.id, 'plmTime', e.target.value)} onBlur={(e) => onUpdate(item.id, 'plmTime', formatToTime(e.target.value))} placeholder="00:00" className={`${getBaseInputStyle(isDarkMode)} text-center font-black tracking-widest h-10 pl-8`} maxLength={5} />
                                        <Clock size={12} className="absolute left-3 bottom-3.5 opacity-20" />
                                    </div>
                                </div>

                                {/* Planilha Card */}
                                <div className={`p-5 rounded-lg border flex flex-col gap-5 ${isDarkMode ? 'bg-purple-500/5 border-purple-500/10' : 'bg-purple-50/50 border-purple-100'}`}>
                                    <div className="flex items-center gap-2 opacity-60">
                                        <FileText size={14} className="text-purple-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t.spreadsheetExecution}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input type="number" value={item.extPass} onChange={(e) => handleNumberChange(item.id, 'extPass', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} h-10 text-center text-xs font-black text-green-500 bg-green-500/5 border-green-500/10`} placeholder="P" title="Pass" />
                                        <input type="number" value={item.extFail} onChange={(e) => handleNumberChange(item.id, 'extFail', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} h-10 text-center text-xs font-black text-red-500 bg-red-500/5 border-red-500/10`} placeholder="F" title="Fail" />
                                        <input type="number" value={item.extNa} onChange={(e) => handleNumberChange(item.id, 'extNa', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} h-10 text-center text-xs font-black text-yellow-500 bg-yellow-500/5 border-yellow-500/10`} placeholder="N" title="NA" />
                                    </div>
                                    <div className="relative">
                                        <label className="text-[8px] font-black uppercase opacity-40 tracking-widest block mb-1.5 ml-1">{t.timeSpent}</label>
                                        <input type="text" value={item.extTime} onChange={(e) => handleTimeChange(item.id, 'extTime', e.target.value)} onBlur={(e) => onUpdate(item.id, 'extTime', formatToTime(e.target.value))} placeholder="00:00" className={`${getBaseInputStyle(isDarkMode)} text-center font-black tracking-widest h-10 pl-8`} maxLength={5} />
                                        <Clock size={12} className="absolute left-3 bottom-3.5 opacity-20" />
                                    </div>
                                </div>

                                {/* Consolidado Card */}
                                <div className={`p-5 rounded-lg border flex flex-col justify-between ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/10 shadow-lg shadow-emerald-500/5' : 'bg-emerald-50/50 border-emerald-100'}`}>
                                    <div className="flex items-center gap-2 opacity-60">
                                        <Zap size={14} className="text-emerald-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t.dailyResult}</span>
                                    </div>
                                    <div className="space-y-4 py-2">
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[9px] font-black uppercase opacity-40">Pass/Fail/NA</span>
                                            <span className="text-sm font-black tracking-tighter text-emerald-600 dark:text-emerald-400">
                                                {item.pass || 0}/{item.fail || 0}/{item.na || 0}
                                            </span>
                                        </div>
                                        <div className="h-px bg-emerald-500/10 w-full" />
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[9px] font-black uppercase opacity-40">{t.totalTime}</span>
                                            <span className="text-base font-black tracking-widest text-blue-600 dark:text-blue-400">
                                                {item.time || '00:00'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-[8px] font-bold text-center opacity-30 uppercase tracking-[0.2em]">{t.autoCalculation}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {/* Header: Tester & Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase opacity-30 tracking-[0.2em] ml-1">{t.testerResponsible}</label>
                                    <AutocompleteInput name="testerId" value={item.tester} onChange={(e: any) => onUpdate(item.id, 'tester', e.target.value)} placeholder={t.tester} isDarkMode={isDarkMode} t={t} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase opacity-30 tracking-[0.2em] ml-1">{t.executionDate}</label>
                                    <input type="date" value={item.date} onChange={(e) => onUpdate(item.id, 'date', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} text-xs font-bold px-4 h-11`} />
                                </div>
                            </div>

                            {/* Main Content: Metrics and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Execution Metrics Card */}
                                <div className={`md:col-span-2 p-5 rounded-lg border flex flex-col gap-5 ${isDarkMode ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50/50 border-blue-100'}`}>
                                    <div className="flex items-center gap-2 opacity-60">
                                        <Zap size={14} className="text-blue-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t.executionMetric}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black uppercase text-green-500 opacity-60 text-center block tracking-widest">Pass</label>
                                            <input type="number" value={item.pass} onChange={(e) => handleNumberChange(item.id, 'pass', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} h-12 text-center text-base font-black text-green-500 bg-green-500/5 border-green-500/10 focus:ring-green-500/20`} placeholder="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black uppercase text-red-500 opacity-60 text-center block tracking-widest">Fail</label>
                                            <input type="number" value={item.fail} onChange={(e) => handleNumberChange(item.id, 'fail', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} h-12 text-center text-base font-black text-red-500 bg-red-500/5 border-red-500/10 focus:ring-red-500/20`} placeholder="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black uppercase text-yellow-500 opacity-60 text-center block tracking-widest">Na</label>
                                            <input type="number" value={item.na} onChange={(e) => handleNumberChange(item.id, 'na', e.target.value)} className={`${getBaseInputStyle(isDarkMode)} h-12 text-center text-base font-black text-yellow-500 bg-yellow-500/5 border-yellow-500/10 focus:ring-yellow-500/20`} placeholder="0" />
                                        </div>
                                    </div>
                                </div>

                                {/* Test Time Card */}
                                <div className={`p-5 rounded-lg border flex flex-col gap-5 ${isDarkMode ? 'bg-purple-500/5 border-purple-500/10' : 'bg-purple-50/50 border-purple-100'}`}>
                                    <div className="flex items-center gap-2 opacity-60">
                                        <Clock size={14} className="text-purple-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t.totalTime}</span>
                                    </div>
                                    <div className="flex-grow flex flex-col justify-center relative">
                                        <label className="text-[8px] font-black uppercase opacity-40 tracking-widest block mb-2 ml-1 text-center">{t.hoursMinutes}</label>
                                        <div className="relative">
                                            <input type="text" value={item.time} onChange={(e) => handleTimeChange(item.id, 'time', e.target.value)} onBlur={(e) => onUpdate(item.id, 'time', formatToTime(e.target.value))} placeholder="05:00" className={`${getBaseInputStyle(isDarkMode)} text-center text-xl font-black tracking-[0.2em] h-14 pl-10`} maxLength={5} />
                                            <Clock size={18} className="absolute left-4 top-4.5 opacity-20" />
                                        </div>
                                    </div>
                                    <div className="text-[8px] font-bold text-center opacity-30 uppercase tracking-[0.2em]">{t.timeFormat}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Rodapé de Totais */}
        <div className={`mt-10 p-8 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500 ${isDarkMode ? 'bg-blue-600/10 border-blue-500/20 shadow-2xl shadow-blue-900/20' : 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/30'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-white/20 text-white'}`}>
                    <Zap size={28} />
                </div>
                <div>
                    <h4 className={`text-xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-white'}`}>{t.consolidatedGeneral}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 ${isDarkMode ? 'text-blue-400' : 'text-blue-100'}`}>{isMultimidia ? t.sumPlmSpreadsheet : t.totalAccumulated}</p>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-10">
                <div className="text-center space-y-1">
                    <p className={`text-[9px] font-black uppercase tracking-widest opacity-50 ${!isDarkMode && 'text-blue-100'}`}>Pass</p>
                    <p className="text-3xl font-black tracking-tighter">{totals.pass}</p>
                </div>
                <div className="text-center space-y-1">
                    <p className={`text-[9px] font-black uppercase tracking-widest opacity-50 ${!isDarkMode && 'text-blue-100'}`}>Fail</p>
                    <p className="text-3xl font-black tracking-tighter">{totals.fail}</p>
                </div>
                <div className="text-center space-y-1">
                    <p className={`text-[9px] font-black uppercase tracking-widest opacity-50 ${!isDarkMode && 'text-blue-100'}`}>NA</p>
                    <p className="text-3xl font-black tracking-tighter">{totals.na}</p>
                </div>
                <div className={`w-px h-12 my-auto hidden md:block ${isDarkMode ? 'bg-white/10' : 'bg-white/20'}`} />
                <div className="text-center space-y-1">
                    <p className={`text-[9px] font-black uppercase tracking-widest opacity-50 ${!isDarkMode && 'text-blue-100'}`}>{t.totalTime}</p>
                    <p className="text-3xl font-black tracking-tighter text-blue-400 dark:text-blue-400">{totalTimeStr}</p>
                </div>
            </div>
        </div>
    </div>
    );
};

const DynamicAppList = ({ items, onUpdate, onAdd, onRemove, isDarkMode, t }: any) => (
    <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
        <div className="flex justify-between items-end mb-4">
            <label className={`text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.appsVersions}</label>
            <button onClick={onAdd} className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-all rounded-lg px-3 py-1 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-black/5'}`}>
                <Plus className="h-3 w-3" /> {t.addApp}
            </button>
        </div>
        <div className="flex gap-4 text-[10px] font-bold tracking-wide mb-2 px-2 text-gray-500">
            <div className="w-1/2 uppercase">{t.appName}</div>
            <div className="w-1/2 uppercase">{t.version}</div>
            <div className="w-10"></div>
        </div>
        {items.map((item: any, index: number) => (
            <div key={item.id} className="flex gap-4 mb-3 items-center group relative !focus-within:z-[100]" style={{ zIndex: 100 - index }}>
                <div className="w-1/2">
                    <AutocompleteInput name="appName" value={item.name} onChange={(e: any) => onUpdate(item.id, 'name', e.target.value)} placeholder={t.appName} isDarkMode={isDarkMode} t={t} />
                </div>
                <input type="text" value={item.version} onChange={(e) => onUpdate(item.id, 'version', e.target.value)} placeholder="v1.0..." className={`${getBaseInputStyle(isDarkMode)} w-1/2`} />
                <button onClick={() => onRemove(item.id)} className={`p-3 rounded-lg transition-all opacity-60 group-hover:opacity-100 ${isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        ))}
    </div>
);

// --- COMPONENTE DE BOLINHA FLUTUANTE (SAÍDA) ---
const FloatingOutputFAB = ({ onOpen, isDarkMode, t }: any) => (
  <div 
    onClick={onOpen}
    className="fixed bottom-10 right-10 z-[8000] cursor-pointer group animate-in zoom-in duration-500"
  >
    <div className={`relative w-16 h-16 rounded-lg flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 
      ${isDarkMode ? 'bg-blue-600 shadow-blue-500/20' : 'bg-blue-600 shadow-blue-600/30'}`}>
      <FileText className="w-8 h-8 text-white" />
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-black/80 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {t.labelGenerated}
      </div>
    </div>
  </div>
);

// --- COMPONENTE DE MODAL DE SAÍDA ---
const GeneratedOutputModal = ({ isOpen, onClose, generatedText, onCopy, copied, isDarkMode, t }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <Card className={`relative w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col z-10 border-none shadow-2xl animate-in zoom-in-95 duration-200
        ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-gray-900'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <Save className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold tracking-tight uppercase">{t.labelGenerated}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={onCopy} className={`h-10 px-6 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'}`}>
                {copied ? <CheckCircle className="mr-2" size={14} /> : <Copy className="mr-2" size={14} />}
                {copied ? t.btnCopiado : t.btnCopy}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-lg h-8 w-8 p-0"><X className="w-5 h-5" /></Button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-8 custom-scrollbar bg-black/5 dark:bg-white/5">
            <div className={`p-8 rounded-xl border font-mono text-xs leading-relaxed select-text ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-black/5 text-gray-800'}`}>
                <pre className="whitespace-pre-wrap font-inherit bg-transparent border-none p-0 m-0 opacity-90">{generatedText}</pre>
            </div>
        </div>
      </Card>
    </div>
  );
};

// ==========================================
// 4. COMPONENTE PRINCIPAL (PAGE)
// ==========================================

export default function RemarksPage() {
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
    window.dispatchEvent(new Event('storage'));
  };

  const [team, setTeam] = useState('Multimidia');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedTestItems, setSelectedTestItems] = useState<string[]>([]);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    deviceIds: [{ id: 1, value: '' }],
    sampleIds: [{ id: 1, value: '' }],
    accounts: [{ id: 1, value: '' }],
    samsungAccounts: [{ id: 1, value: '' }],
    simCards: [{ id: 1, value: '' }],
    pluginVer: '',
    appVersions: '',
    issuesRep: [{ id: 1, criticality: '', issueId: '', description: '' }],
    issuesRef: [{ id: 1, criticality: '', issueId: '', description: '' }],
    testHistory: [{ id: 1, tester: '', date: getTodayISO(), pass: '', fail: '', na: '', time: '', plmPass: '', plmFail: '', plmNa: '', extPass: '', extFail: '', extNa: '', plmTime: '', extTime: '' }],
    multimidiaApps: [ { id: 1, name: '', version: '' } ],
    wearableApps: [ { id: 1, name: '', version: '' } ],
    generalApps: [ { id: 1, name: '', version: '' } ]
  });

  useEffect(() => { setSelectedTestItems([]); }, [team]);

  const toggleTestItem = (item: string) => {
    const isSelected = selectedTestItems.includes(item);
    if (isSelected) {
      setSelectedTestItems([]);
      const appsToRemove = APPS1_TEST_ITEMS[item] || [];
      setFormData(prev => ({ ...prev, generalApps: prev.generalApps.filter(app => !appsToRemove.includes(app.name)) }));
    } else {
      setSelectedTestItems([item]);
      const appsToAdd = (APPS1_TEST_ITEMS[item] || []).map(name => ({ id: Math.random(), name, version: '' }));
      setFormData(prev => {
        const appsToRemove = selectedTestItems.flatMap(prevItem => APPS1_TEST_ITEMS[prevItem] || []);
        const currentApps = prev.generalApps.filter(app => !appsToRemove.includes(app.name) && app.name !== '');
        return { ...prev, generalApps: [...currentApps, ...appsToAdd] };
      });
    }
  };
  
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info', visible: boolean}>({
    message: '', type: 'info', visible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  useEffect(() => { setGeneratedText(generateRemark(team, formData)); setCopied(false); }, [team, formData]);

  const addListItem = (field: keyof typeof formData) => setFormData(prev => ({ ...prev, [field]: [...(prev[field] as any[]), { id: Date.now(), value: '' }] }));
  const updateListItem = (field: keyof typeof formData, id: number, newValue: string) => setFormData(prev => ({ ...prev, [field]: (prev[field] as any[]).map(item => item.id === id ? { ...item, value: newValue } : item) }));
  const removeListItem = (field: keyof typeof formData, id: number) => setFormData(prev => ({ ...prev, [field]: (prev[field] as any[]).filter(item => item.id !== id) }));
  const addIssue = (field: 'issuesRep' | 'issuesRef') => setFormData(prev => ({ ...prev, [field]: [...prev[field], { id: Date.now(), criticality: '', issueId: '', description: '' }] }));
  const updateIssue = (field: 'issuesRep' | 'issuesRef', id: number, key: string, value: string) => setFormData(prev => ({ ...prev, [field]: prev[field].map(item => item.id === id ? { ...item, [key]: value } : item) }));
  const removeIssue = (field: 'issuesRep' | 'issuesRef', id: number) => setFormData(prev => ({ ...prev, [field]: prev[field].filter(item => item.id !== id) }));
  
  const addHistoryDay = () => setFormData(prev => ({ ...prev, testHistory: [...prev.testHistory, { id: Date.now(), tester: prev.testHistory[0]?.tester || '', date: getTodayISO(), pass: '', fail: '', na: '', time: '', plmPass: '', plmFail: '', plmNa: '', extPass: '', extFail: '', extNa: '', plmTime: '', extTime: '' }] }));
  
  const updateHistory = (id: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      testHistory: prev.testHistory.map(item => {
        if (item.id !== id) return item;
        const updatedItem = { ...item, [field]: value };
        
        // Se for Multimidia e alterou um campo de sub-execução, recalcula o total
        if (team === 'Multimidia' && (field.startsWith('plm') || field.startsWith('ext'))) {
          // Recalcula Pass/Fail/NA
          const p1 = parseInt(updatedItem.plmPass || '0', 10) || 0;
          const p2 = parseInt(updatedItem.extPass || '0', 10) || 0;
          updatedItem.pass = (p1 + p2).toString();

          const f1 = parseInt(updatedItem.plmFail || '0', 10) || 0;
          const f2 = parseInt(updatedItem.extFail || '0', 10) || 0;
          updatedItem.fail = (f1 + f2).toString();

          const n1 = parseInt(updatedItem.plmNa || '0', 10) || 0;
          const n2 = parseInt(updatedItem.extNa || '0', 10) || 0;
          updatedItem.na = (n1 + n2).toString();

          // Recalcula o tempo se alterou plmTime ou extTime
          const toMin = (t: string) => {
            if (!t || !t.includes(':')) return 0;
            const [h, m] = t.split(':').map(Number);
            return (h || 0) * 60 + (m || 0);
          };
          const totalMin = toMin(updatedItem.plmTime) + toMin(updatedItem.extTime);
          const h = Math.floor(totalMin / 60);
          const m = totalMin % 60;
          updatedItem.time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }
        return updatedItem;
      })
    }));
  };
  const removeHistory = (id: number) => setFormData(prev => ({ ...prev, testHistory: prev.testHistory.filter(item => item.id !== id) }));
  const addApp = (field: 'multimidiaApps' | 'wearableApps' | 'generalApps') => setFormData(prev => ({ ...prev, [field]: [...prev[field], { id: Date.now(), name: '', version: '' }] }));
  const updateApp = (field: 'multimidiaApps' | 'wearableApps' | 'generalApps', id: number, key: string, val: string) => setFormData(prev => ({ ...prev, [field]: prev[field].map(item => item.id === id ? { ...item, [key]: val } : item) }));
  const removeApp = (field: 'multimidiaApps' | 'wearableApps' | 'generalApps', id: number) => setFormData(prev => ({ ...prev, [field]: prev[field].filter(item => item.id !== id) }));

  const validateForm = () => {
    for (const day of formData.testHistory) { if (!day.tester || !day.date || day.pass === '' || day.fail === '' || day.na === '' || !day.time) return false; }
    const hasValue = (list: any[]) => list.some(i => i.value.trim() !== '');
    if (team === 'Multimidia') { if (!hasValue(formData.sampleIds) || !hasValue(formData.accounts) || !hasValue(formData.simCards)) return false; } 
    else if (team === 'Wearables') { if (!hasValue(formData.deviceIds)) return false; } 
    else { if (!hasValue(formData.deviceIds) || !hasValue(formData.accounts) || !hasValue(formData.samsungAccounts) || !hasValue(formData.simCards)) return false; }
    return true;
  };

  const handleCopy = async () => {
    if (!validateForm()) { showToast(t.validationError, "error"); return; }
    const success = await copyToClipboard(generatedText);
    if (success) { setCopied(true); showToast(t.copySuccess, "success"); setTimeout(() => setCopied(false), 2000); } 
    else { showToast("Não foi possível copiar automaticamente.", "warning"); }
    try {
        const issuesToSave: any[] = [];
        formData.issuesRep.forEach((issue: any) => { if (issue.issueId || issue.description) { issuesToSave.push({ type: 'reported', criticality: issue.criticality || '[C]', issue_id: issue.issueId || 'N/A', description: issue.description || '', team: team, app_name: formData.generalApps[0]?.name || formData.multimidiaApps[0]?.name || '' }); } });
        formData.issuesRef.forEach((issue: any) => { if (issue.issueId || issue.description) { issuesToSave.push({ type: 'referenced', criticality: issue.criticality || '[C]', issue_id: issue.issueId || 'N/A', description: issue.description || '', team: team, app_name: formData.generalApps[0]?.name || formData.multimidiaApps[0]?.name || '' }); } });
        if (issuesToSave.length > 0) { await fetch(`${API_URL}/remark-issues`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(issuesToSave) }); }
        
        const allApps = [...formData.multimidiaApps, ...formData.wearableApps, ...formData.generalApps].map(a => a.name).filter(n => n && n.trim().length > 0);
        const uniqueApps = [...new Set(allApps)];
        const allTesters = formData.testHistory.map(t => t.tester).filter(t => t && t.trim().length > 0);
        const uniqueTesters = [...new Set(allTesters)];
        const uniqueSamples = [...new Set(formData.sampleIds.map(s => s.value).filter(v => v && v.trim().length > 0))];
        const uniqueDevices = [...new Set(formData.deviceIds.map(d => d.value).filter(v => v && v.trim().length > 0))];
        const uniqueAccounts = [...new Set(formData.accounts.map(a => a.value).filter(v => v && v.trim().length > 0))];
        const uniqueSamsungAccounts = [...new Set(formData.samsungAccounts.map(a => a.value).filter(v => v && v.trim().length > 0))];
        const uniqueSimCards = [...new Set(formData.simCards.map(s => s.value).filter(v => v && v.trim().length > 0))];

        await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                team: team,
                testerId: uniqueTesters[0] || '',
                testerIds: uniqueTesters,
                appNames: uniqueApps,
                sampleIds: uniqueSamples,
                deviceIds: uniqueDevices,
                accounts: uniqueAccounts,
                samsungAccounts: uniqueSamsungAccounts,
                simCards: uniqueSimCards,
                full_form_data: formData
            })
        });
    } catch (err) {}
  };

  const mainBgClass = isDarkMode ? "bg-[#050505] text-zinc-300" : "bg-[#f5f5f7] text-zinc-800";
  const cardClass = getSectionStyle(isDarkMode);

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-10 transition-colors duration-1000 ${mainBgClass} overflow-x-hidden pb-20`}>
      
      <AIBackground isDarkMode={isDarkMode} />

      <Navbar />
      
      <CustomToast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast(prev => ({ ...prev, visible: false }))} isDarkMode={isDarkMode} />

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
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${lang === l.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'}`}
            >
              <span>{l.icon}</span> {l.label}
            </button>
          ))}
        </div>

        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border-b border-black/5 dark:border-white/5 pb-8 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" /> {t.badge}
            </div>
            <h1 className={`text-4xl lg:text-5xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{t.titleAccent}</span>
            </h1>
            <p className="text-sm font-bold opacity-50 max-w-md leading-tight">{t.subtitle}</p>
          </div>
        </header>

        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in duration-500">
              <div className={cardClass}>
                  <label className={getLabelStyle(isDarkMode)}>{t.teamSelection}</label>
                  <div className="flex flex-wrap gap-3 mt-4">
                      {['Multimidia', 'Wearables', 'Apps1', 'Apps2', 'PhoneSettings', 'Sanity'].map(tName => (
                          <button key={tName} onClick={() => setTeam(tName)} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-500 border shadow-sm ${team === tName ? (isDarkMode ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20') : (isDarkMode ? 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300' : 'bg-gray-50 border-black/5 text-gray-400 hover:bg-white hover:text-gray-600 hover:border-black/10')}`}>
                              {tName}
                          </button>
                      ))}
                  </div>
              </div>

              <div className={cardClass}>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2 opacity-60"><Info size={14} className="text-blue-500" /> {t.generalInfo}</h3>
                  
                  {team === 'Multimidia' && (
                      <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                          <DynamicInputList label="Amostra (Sample ID)" name="sampleId" items={formData.sampleIds} onUpdate={(id: number, val: string) => updateListItem('sampleIds', id, val)} onAdd={() => addListItem('sampleIds')} onRemove={(id: number) => removeListItem('sampleIds', id)} isDarkMode={isDarkMode} placeholder="ex: SM-S938B" t={t} />
                          <DynamicInputList label="Conta Google" name="account" items={formData.accounts} onUpdate={(id: number, val: string) => updateListItem('accounts', id, val)} onAdd={() => addListItem('accounts')} onRemove={(id: number) => removeListItem('accounts', id)} isDarkMode={isDarkMode} placeholder="ex: email@gmail.com" t={t} />
                          <DynamicInputList label="Telefone / SIM / Operadora" name="simCard" items={formData.simCards} onUpdate={(id: number, val: string) => updateListItem('simCards', id, val)} onAdd={() => addListItem('simCards')} onRemove={(id: number) => removeListItem('simCards', id)} isDarkMode={isDarkMode} placeholder="ex: 929..." t={t} />
                          <DynamicAppList items={formData.multimidiaApps} onAdd={() => addApp('multimidiaApps')} onUpdate={(id: number, key: string, val: string) => updateApp('multimidiaApps', id, key, val)} onRemove={(id: number) => removeApp('multimidiaApps', id)} isDarkMode={isDarkMode} t={t} />
                          <DynamicHistoryList items={formData.testHistory} onAdd={addHistoryDay} onUpdate={updateHistory} onRemove={removeHistory} isDarkMode={isDarkMode} t={t} team={team} />
                      </div>
                  )}

                  {team === 'Wearables' && (
                      <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                          <DynamicInputList label="ID do Dispositivo (Sample ID)" name="deviceId" items={formData.deviceIds} onUpdate={(id: number, val: string) => updateListItem('deviceIds', id, val)} onAdd={() => addListItem('deviceIds')} onRemove={(id: number) => removeListItem('deviceIds', id)} isDarkMode={isDarkMode} placeholder="ex: S24..." t={t} />
                          <DynamicAppList items={formData.wearableApps} onAdd={() => addApp('wearableApps')} onUpdate={(id: number, key: string, val: string) => updateApp('wearableApps', id, key, val)} onRemove={(id: number) => removeApp('wearableApps', id)} isDarkMode={isDarkMode} t={t} />
                          <DynamicHistoryList items={formData.testHistory} onAdd={addHistoryDay} onUpdate={updateHistory} onRemove={removeHistory} isDarkMode={isDarkMode} t={t} team={team} />
                      </div>
                  )}

                  {team === 'Sanity' && (
                      <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                          <DynamicInputList label="ID do Dispositivo" name="deviceId" items={formData.deviceIds} onUpdate={(id: number, val: string) => updateListItem('deviceIds', id, val)} onAdd={() => addListItem('deviceIds')} onRemove={(id: number) => removeListItem('deviceIds', id)} isDarkMode={isDarkMode} placeholder="ex: S24..." t={t} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <DynamicInputList label="Conta Google" name="account" items={formData.accounts} onUpdate={(id: number, val: string) => updateListItem('accounts', id, val)} onAdd={() => addListItem('accounts')} onRemove={(id: number) => removeListItem('accounts', id)} isDarkMode={isDarkMode} placeholder="ex: email@gmail.com" t={t} />
                              <DynamicInputList label="Conta Samsung" name="samsungAccount" items={formData.samsungAccounts} onUpdate={(id: number, val: string) => updateListItem('samsungAccounts', id, val)} onAdd={() => addListItem('samsungAccounts')} onRemove={(id: number) => removeListItem('samsungAccounts', id)} isDarkMode={isDarkMode} placeholder="ex: email@gmail.com" t={t} />
                          </div>
                          <DynamicInputList label="Telefone / SIM" name="simCard" items={formData.simCards} onUpdate={(id: number, val: string) => updateListItem('simCards', id, val)} onAdd={() => addListItem('simCards')} onRemove={(id: number) => removeListItem('simCards', id)} isDarkMode={isDarkMode} placeholder="ex: 929..." t={t} />
                          <DynamicHistoryList items={formData.testHistory} onAdd={addHistoryDay} onUpdate={updateHistory} onRemove={removeHistory} isDarkMode={isDarkMode} t={t} team={team} />
                      </div>
                  )}

                  {['Apps1', 'Apps2', 'PhoneSettings'].includes(team) && (
                      <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                          {team === 'Apps1' && (
                            <div className="space-y-4">
                              <label className={getLabelStyle(isDarkMode)}>{t.selectTestItem}</label>
                              <div className="flex flex-wrap gap-2">
                                {Object.keys(APPS1_TEST_ITEMS).map(item => (
                                  <button key={item} onClick={() => toggleTestItem(item)} className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300 border ${selectedTestItems.includes(item) ? (isDarkMode ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-blue-500 text-white border-blue-500 shadow-sm') : (isDarkMode ? 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10' : 'bg-gray-50 border-black/5 text-gray-400 hover:text-gray-600')}`}>
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <DynamicInputList label="ID do Dispositivo / HW" name="deviceId" items={formData.deviceIds} onUpdate={(id: number, val: string) => updateListItem('deviceIds', id, val)} onAdd={() => addListItem('deviceIds')} onRemove={(id: number) => removeListItem('deviceIds', id)} isDarkMode={isDarkMode} placeholder="ex: S24.../REV1.0" t={t} />
                              <DynamicInputList label="Telefone / SIM" name="simCard" items={formData.simCards} onUpdate={(id: number, val: string) => updateListItem('simCards', id, val)} onAdd={() => addListItem('simCards')} onRemove={(id: number) => removeListItem('simCards', id)} isDarkMode={isDarkMode} placeholder="ex: 929..." t={t} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <DynamicInputList label="Conta Google" name="account" items={formData.accounts} onUpdate={(id: number, val: string) => updateListItem('accounts', id, val)} onAdd={() => addListItem('accounts')} onRemove={(id: number) => removeListItem('accounts', id)} isDarkMode={isDarkMode} placeholder="ex: email@gmail.com" t={t} />
                              <DynamicInputList label="Conta Samsung" name="samsungAccount" items={formData.samsungAccounts} onUpdate={(id: number, val: string) => updateListItem('samsungAccounts', id, val)} onAdd={() => addListItem('samsungAccounts')} onRemove={(id: number) => removeListItem('samsungAccounts', id)} isDarkMode={isDarkMode} placeholder="ex: email@gmail.com" t={t} />
                          </div>
                          <DynamicAppList items={formData.generalApps} onAdd={() => addApp('generalApps')} onUpdate={(id: number, key: string, val: string) => updateApp('generalApps', id, key, val)} onRemove={(id: number) => removeApp('generalApps', id)} isDarkMode={isDarkMode} t={t} />
                          <DynamicHistoryList items={formData.testHistory} onAdd={addHistoryDay} onUpdate={updateHistory} onRemove={removeHistory} isDarkMode={isDarkMode} t={t} team={team} />
                      </div>
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DynamicIssueList label={t.reportedIssues} items={formData.issuesRep} onAdd={() => addIssue('issuesRep')} onUpdate={(id: number, key: string, val: string) => updateIssue('issuesRep', id, key, val)} onRemove={(id: number) => removeIssue('issuesRep', id)} isDarkMode={isDarkMode} t={t} />
                  <DynamicIssueList label={t.referencedIssues} items={formData.issuesRef} onAdd={() => addIssue('issuesRef')} onUpdate={(id: number, key: string, val: string) => updateIssue('issuesRef', id, key, val)} onRemove={(id: number) => removeIssue('issuesRef', id)} isDarkMode={isDarkMode} t={t} />
              </div>
          </div>
        </div>
      </div>
      
      <FloatingOutputFAB onOpen={() => setIsOutputModalOpen(true)} isDarkMode={isDarkMode} t={t} />
      <GeneratedOutputModal 
        isOpen={isOutputModalOpen} 
        onClose={() => setIsOutputModalOpen(false)} 
        generatedText={generatedText} 
        onCopy={handleCopy} 
        copied={copied} 
        isDarkMode={isDarkMode} 
        t={t} 
      />
    </div>
  );
}