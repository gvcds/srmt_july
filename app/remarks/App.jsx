import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme-provider';

// ==========================================
// 1. CONFIGURAÇÃO & UTILITÁRIOS
// ==========================================

// Ajuste para permitir acesso via rede (pega o IP do navegador automaticamente)
const API_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

const getFormattedDate = (separator = '/') => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    return `${dd}${separator}${mm}${separator}${yy}`;
};

// Retorna data de hoje em formato compatível com input type="date" (YYYY-MM-DD)
const getTodayISO = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

// Converte YYYY-MM-DD para DD/MM/YY ou DD.MM.YYYY (fullYear)
const formatDateForOutput = (isoDate, separator = '/', fullYear = false) => {
    if (!isoDate) return '';
    try {
        const [yyyy, mm, dd] = isoDate.split('-');
        const yy = fullYear ? yyyy : yyyy.slice(-2);
        return `${dd}${separator}${mm}${separator}${yy}`;
    } catch (e) {
        return isoDate; // Retorna original se falhar
    }
};

// Formata strings para HH:MM (Ex: "5" -> "05:00", "5:30" -> "05:30")
const formatToTime = (val) => {
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

// Função para somar o tempo total do histórico (HH:MM)
const calculateTotalTime = (history) => {
    let totalMinutes = 0;
    if (!history) return '00:00';
    
    history.forEach(day => {
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
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Função para somar PASS/FAIL/NA do histórico
const calculateTotalPassFailNa = (history) => {
    let totalPass = 0;
    let totalFail = 0;
    let totalNa = 0;

    if (!history) return '0/0/0';

    history.forEach(day => {
        totalPass += Math.max(0, parseInt(day.pass, 10) || 0);
        totalFail += Math.max(0, parseInt(day.fail, 10) || 0);
        totalNa += Math.max(0, parseInt(day.na, 10) || 0);
    });

    return `${totalPass}/${totalFail}/${totalNa}`;
};

// --- FUNÇÃO SEGURA PARA COPIAR TEXTO ---
const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Falha na Clipboard API:', err);
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
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        console.error('Falha no fallback de cópia:', err);
        return false;
    }
};

const generateRemark = (team, data) => {
    // Para Multimidia e outros, extrai TODOS os testadores únicos do histórico
    const uniqueTesters = [...new Set(data.testHistory.map(d => d.tester).filter(t => t && t.trim()))].join(', ');
    const mainTester = data.testHistory[0]?.tester || '';

    const totalTimeCalculated = calculateTotalTime(data.testHistory);
    const totalPassFailNaCalculated = calculateTotalPassFailNa(data.testHistory);

    const formatList = (items, prefix = '') => {
        if (!items || items.length === 0) return '';
        return items
            .map(i => i.value)
            .filter(v => v.trim() !== '')
            .map(v => `${prefix}${v}`)
            .join('\n');
    };

    const formatIssues = (issues, teamName) => {
        // Se a lista estiver vazia, retorna vazio
        if (!issues || issues.length === 0) return '';
        
        // Verifica se há pelo menos um item preenchido
        const hasContent = issues.some(item => item.criticality || item.issueId);
        if (!hasContent) return '';

        return issues.map((item, index) => {
            if (!item.criticality && !item.issueId) return null;

            const critVal = item.criticality.trim();
            const idVal = item.issueId.trim();
            const descVal = item.description.trim();
            let line = '';

            if (teamName === 'Multimidia') {
                const cleanCrit = critVal.replace(/[\[\]]/g, '');
                const cleanId = idVal.replace(/[\[\]]/g, '');
                line = `${cleanCrit} – ${cleanId}${descVal ? ' - ' + descVal : ''}`;
            } else {
                const crit = critVal.startsWith('[') ? critVal : `[${critVal}]`;
                const id = idVal.startsWith('[') ? idVal : `[${idVal}]`;
                line = `${crit}${id} ${descVal}`;

                if (['Apps1', 'Apps2'].includes(teamName)) {
                    line = `${index + 1}. ${line}`;
                }
            }
            return line;
        }).filter(l => l !== null).join('\n\n');
    };

    const formatHistory = (history, teamName) => {
        if (!history || history.length === 0) return '';
        const separator = ['Apps1', 'Apps2'].includes(teamName) ? '.' : '/';
        
        return history.map((day, idx) => {
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
                // Apps1/2: tester - date - Pass/Fail/NA - Time
                return `${testerStr} - ${dateStr} - Pass/Fail/NA: ${pass}/${fail}/${na} - ${timeStr}${noTestStr}`;
            } 
            else if (teamName === 'Multimidia') {
                const dateStr = formatDateForOutput(day.date, separator);
                return `${testerStr} ${dateStr} - ${pass}/${fail}/${na} - ${timeStr}${noTestStr}`;
            } 
            else {
                // Wearables/Sanity/Default
                const dateStr = formatDateForOutput(day.date, separator);
                return `${testerStr} ${dateStr} - ${timeStr}${noTestStr} - (${pass}/${fail}/${na})`;
            }
        }).join('\n\n');
    };

    const formatApps = (apps, style = 'default') => {
        if (!apps || apps.length === 0) return '';
        return apps.map(app => {
            if(!app.name && !app.version) return null;
            if (style === 'brackets') {
                return `${app.name}[${app.version}]`;
            }
            return `${app.name}: ${app.version}`;
        }).filter(Boolean).join('\n');
    };

    const commonHeader = `[${team}]`;
    const issuesReportedStr = formatIssues(data.issuesRep, team);
    const issuesReferencedStr = formatIssues(data.issuesRef, team);
    const historyStr = formatHistory(data.testHistory, team);
    
    // --- LÓGICA MULTIMIDIA ---
    if (team === 'Multimidia') {
        const historySection = historyStr ? `\nPartial Result:\n${historyStr}` : '';
        const appsSection = formatApps(data.multimidiaApps);
        
        const formatMultiField = (label, items) => {
            const values = items.map(i => i.value).filter(v => v.trim());
            if (values.length === 0) return `${label}: `;
            return `${label}: ${values.join(', ')}`;
        };

        const sampleIdStr = formatMultiField('Sample ID/HW', data.sampleIds);
        const accountStr = formatMultiField('Account', data.accounts);
        const simStr = formatMultiField('SIMCard/Number', data.simCards);

        // AQUI: Tester ID usa uniqueTesters (lista de todos)
        const testersMap = {};
        data.testHistory.forEach(h => {
            if (!h.tester) return;
            if (!testersMap[h.tester]) testersMap[h.tester] = [];
            testersMap[h.tester].push(h);
        });

        const testersBlocks = Object.keys(testersMap).map((testerName, index) => {
            const tStats = calculateStats(testersMap[testerName]);
            const sample = data.sampleIds[index] ? data.sampleIds[index].value : (data.sampleIds[0]?.value || '');
            const account = data.accounts[index] ? data.accounts[index].value : (data.accounts[0]?.value || '');
            const sim = data.simCards[index] ? data.simCards[index].value : (data.simCards[0]?.value || '');

            return `${testerName}: ${sample}, ${account}, ${sim}\n\nPASS/FAIL/NA: ${tStats.pass}/${tStats.fail}/${tStats.na}\n\nTime: ${tStats.time}`;
        }).join('\n\n');

        const totalStats = calculateStats(data.testHistory);

        return `${commonHeader}\n\nTotal Result\n\nTime: ${totalStats.time}\n\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}\n\n${testersBlocks}\n\nTest History\n\n${historyStr}\n\nIssue Reported:\n\n${issuesReportedStr}\n\nIssue Ref:\n\n${issuesReferencedStr}\n\nApps Ver:\n\n${appsSection}`;
    }

    // --- LÓGICA WEARABLES / SANITY ---
    if (['Wearables', 'Sanity'].includes(team)) {
        let remarksContent = '';
        const deviceIdStr = data.deviceIds.map(d => d.value).filter(v => v).join(', ');
        
        const totalStats = calculateStats(data.testHistory);

        if (team === 'Wearables') {
            let remarksLines = [`#1. Device ID: ${deviceIdStr}`];
            if (data.wearableApps && data.wearableApps.length > 0) {
                data.wearableApps.forEach((app, index) => {
                    if (app.name || app.version) remarksLines.push(`#${2 + index}. ${app.name}: ${app.version}`);
                });
            }
            const histNum = remarksLines.length + 1;
            remarksContent = remarksLines.join('\n') + `\n#${histNum}. Tester history (Pass/Fail/NA):\n${historyStr}\n\nTime Total: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}`;
        } else {
            const googleStr = data.accounts.map(a => a.value).filter(v => v).join(', ');
            const samsungStr = data.samsungAccounts.map(a => a.value).filter(v => v).join(', ');
            const simStr = data.simCards.map(s => s.value).filter(v => v).join(', ');

            const extras = `#2. Google account: ${googleStr}\n#3. Samsung account: ${samsungStr}\n#4. SIM card: ${simStr}`;
            remarksContent = `#1. Device ID: ${deviceIdStr}\n${extras}\n#5. Tester history (Pass/Fail/NA):\n${historyStr}\n\nTime Total: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}`;
        }
        return `${commonHeader}\n[Issue reported]\n${issuesReportedStr}\n\n[Issue referenced]\n${issuesReferencedStr}\n\n[REMARKS]\n${remarksContent}`;
    }

    // --- LÓGICA APPS2 ---
    if (team === 'Apps2') {
        const appsSection = formatApps(data.generalApps);
        const totalStats = calculateStats(data.testHistory);
        const deviceIdStr = data.deviceIds.map(d => d.value).filter(v => v).join(', ');
        const googleStr = data.accounts.map(a => a.value).filter(v => v).join(', ');
        const samsungStr = data.samsungAccounts.map(a => a.value).filter(v => v).join(', ');
        const simStr = data.simCards.map(s => s.value).filter(v => v).join(', ');

        const extras = `#2. Google account: ${googleStr}\n#3. Samsung account: ${samsungStr}\n#4. SIM card: ${simStr}`;
        
        return `${commonHeader}\n\n[Issue reported]\n${issuesReportedStr}\n\n[Issue referenced]\n${issuesReferencedStr}\n\n[REMARKS]\n#1. Device ID: ${deviceIdStr}\n${extras}\n#5. Tester history (Pass/Fail/NA):\n${historyStr}\n\nTime Total: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}\n\n\n[APPS VERSION]\n${appsSection}`;
    }

    // --- LÓGICA PHONESETTINGS ---
    if (team === 'PhoneSettings') {
        const appsSection = formatApps(data.generalApps, 'brackets');
        const totalStats = calculateStats(data.testHistory);
        const formattedIssuesRef = issuesReferencedStr ? `\n${issuesReferencedStr}` : ' [0]';
        const formattedIssuesRep = issuesReportedStr ? `\n${issuesReportedStr}` : ' [00]';
        const uniqueTesters = [...new Set(data.testHistory.map(d => d.tester).filter(t => t))].join(', ');
        
        const devId = data.deviceIds.map(d => d.value ? (d.value.startsWith('[') ? d.value : `[${d.value}]`) : '').join('');
        const accountStr = data.accounts.map(a => a.value).filter(v => v).join(', ');
        const samsungAccountStr = data.samsungAccounts.map(a => a.value).filter(v => v).join(', ');
        const simStr = formatList(data.simCards); 

        return `${commonHeader}\nAccount: ${accountStr}\nSamsung account: ${samsungAccountStr}\nTester: ${uniqueTesters}\nDevices ID :${devId || '[]'}\nIssue ID Referenced: ${formattedIssuesRef}\nIssue ID: ${formattedIssuesRep}\n\n${simStr}\nApps:\n${appsSection}\n${historyStr}\n\nTime Total: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}`;
    }

    // --- LÓGICA APPS1 ---
    if (team === 'Apps1') {
        const appsSection = formatApps(data.generalApps);
        const totalStats = calculateStats(data.testHistory);
        const mainTester = data.testHistory[0]?.tester || '';
        
        const formatLines = (label, items) => {
            const values = items.map(i => i.value).filter(v => v.trim());
            if (values.length === 0) return `${label}: `;
            return `${label}: ${values.join(', ')}`;
        };

        const devStr = formatLines('Device ID/HW', data.deviceIds);
        const googleStr = formatLines('Google account', data.accounts);
        const samsungStr = formatLines('Samsung account', data.samsungAccounts);
        const simStr = formatLines('SIM Card', data.simCards);

        return `${commonHeader}\n[Remarks]\nTester ID: ${mainTester}\n${devStr}\n${googleStr}\n${samsungStr}\n${simStr}\nTime Total: ${totalStats.time}\nPASS/FAIL/NA: ${totalStats.pass}/${totalStats.fail}/${totalStats.na}\n\n[App versions]\n${appsSection}\n\n[Test history]\n${historyStr}\n\n[Issue reported]\n${issuesReportedStr}\n\n[Issue referenced]\n${issuesReferencedStr}\n`;
    }
    return "Selecione um time.";
};

// Calcula estatísticas (Time, Pass, Fail, NA) de uma lista de itens do histórico
const calculateStats = (historyItems) => {
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

// ==========================================
// 2. COMPONENTES VISUAIS (Clean / Light)
// ==========================================

const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const MoonIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>);
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>);

// Helpers de Estilo Dinâmico
const getBaseInputStyle = (isDark) => 
    `w-full p-2.5 ${isDark ? 'bg-[#1a1a1a] border-gray-700 text-gray-200 placeholder-gray-600 focus:border-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'} border text-sm focus:ring-1 focus:outline-none transition-all rounded-md shadow-sm`;

const getLabelStyle = (isDark) => 
    `block text-xs font-bold tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-600'} mb-1.5 uppercase`;

const getSectionStyle = (isDark) =>
    `${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'} mb-8 border p-5 rounded-lg shadow-sm transition-colors`;

// --- AUTOCOMPLETE INPUT ---
const AutocompleteInput = ({ label, name, value, onChange, placeholder, className = "", isDarkMode }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

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
            } catch (err) {
                console.error("Erro ao buscar sugestões:", err);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [value, name]);

    const handleSelect = (val) => {
        const event = { target: { name: name, value: val } };
        onChange(event);
        setShowSuggestions(false);
    };

    const inputClass = getBaseInputStyle(isDarkMode);
    const dropdownClass = isDarkMode 
        ? "bg-[#1e1e1e] border-gray-600 shadow-2xl" 
        : "bg-white border-gray-200 shadow-xl ring-1 ring-black ring-opacity-5";
    const itemClass = isDarkMode
        ? "text-gray-200 hover:bg-[#333] hover:text-white border-gray-700"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-gray-100";

    return (
        <div className={`w-full relative ${className}`} ref={wrapperRef}>
            {label && <label className={getLabelStyle(isDarkMode)}>{label}</label>}
            <input 
                type="text" 
                name={name} 
                value={value} 
                onChange={onChange} 
                onFocus={() => {
                    if (value.length >= 3 && suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder={placeholder}
                className={inputClass}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className={`absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border ${dropdownClass}`}>
                    {suggestions.map((s, idx) => (
                        <li 
                            key={idx} 
                            onClick={() => handleSelect(s)}
                            className={`p-3 text-sm cursor-pointer border-b last:border-0 transition-colors ${itemClass}`}
                        >
                            {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const Input = ({ label, name, value, onChange, placeholder, type = "text", className="", isDarkMode }) => (
  <div className={`mb-5 w-full ${className}`}>
    {label && <label className={getLabelStyle(isDarkMode)}>{label}</label>}
    <input 
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className={getBaseInputStyle(isDarkMode)}
    />
  </div>
);

const TextArea = ({ label, name, value, onChange, placeholder, isDarkMode }) => (
  <div className="mb-5 w-full">
    <label className={getLabelStyle(isDarkMode)}>{label}</label>
    <textarea 
      name={name} value={value} onChange={onChange} placeholder={placeholder} rows="4"
      className={getBaseInputStyle(isDarkMode)}
    />
  </div>
);

// --- COMPONENTE DE LISTA DINÂMICA PARA INPUTS ---
const DynamicInputList = ({ label, name, items, onUpdate, onAdd, onRemove, placeholder, isDarkMode, className = "" }) => {
    const btnColor = isDarkMode ? "text-gray-400 hover:text-white" : "text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-full";
    const borderColor = isDarkMode ? "border-gray-800" : "border-gray-200";
    const labelColor = isDarkMode ? "text-gray-400" : "text-gray-500";

    return (
        <div className={`mb-6 ${className}`}>
            <div className={`flex justify-between items-end border-b ${borderColor} pb-2 mb-3`}>
                <label className={`text-xs font-bold tracking-widest uppercase ${labelColor}`}>{label}</label>
                <button onClick={onAdd} className={`text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center gap-1 ${btnColor}`}><PlusIcon /> Add</button>
            </div>
            {items.map((item) => (
                <div key={item.id} className="flex gap-2 mb-2 items-center">
                    <div className="flex-grow">
                        <AutocompleteInput 
                            name={name}
                            value={item.value} 
                            onChange={(e) => onUpdate(item.id, e.target.value)} 
                            placeholder={placeholder} 
                            isDarkMode={isDarkMode}
                            className="!mb-0"
                        />
                    </div>
                    <button onClick={() => onRemove(item.id)} className={`p-2.5 mt-0.5 transition-colors ${isDarkMode ? 'text-gray-600 hover:text-red-500' : 'text-gray-400 hover:text-red-600'}`}><TrashIcon /></button>
                </div>
            ))}
        </div>
    );
};

const DynamicIssueList = ({ label, items, onUpdate, onAdd, onRemove, isDarkMode }) => {
    const inputClass = getBaseInputStyle(isDarkMode);
    const labelColor = isDarkMode ? "text-gray-400" : "text-gray-500";
    const headerColor = isDarkMode ? "text-gray-500" : "text-gray-500";
    const borderColor = isDarkMode ? "border-gray-800" : "border-gray-200";
    const btnColor = isDarkMode ? "text-gray-400 hover:text-white" : "text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-full";

    return (
        <div className="mb-8 p-0">
            <div className={`flex justify-between items-end border-b ${borderColor} pb-2 mb-4`}>
                <label className={`text-xs font-bold tracking-widest uppercase ${labelColor}`}>{label}</label>
                <button onClick={onAdd} className={`text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center gap-1 ${btnColor}`}><PlusIcon /> Adicionar Linha</button>
            </div>
            <div className={`flex gap-2 text-[10px] font-bold tracking-wide mb-1 px-1 ${headerColor}`}>
                <div className="w-20 text-center">CRITIC.</div>
                <div className="w-32 text-center">ID PROBLEMA</div>
                <div className="flex-grow">NOME / DESCRIÇÃO</div>
                <div className="w-8"></div>
            </div>
            {items.map((item) => (
                <div key={item.id} className="flex gap-2 mb-2 items-center">
                    <select
                        value={item.criticality}
                        onChange={(e) => onUpdate(item.id, 'criticality', e.target.value)}
                        className={`${inputClass} w-20 text-center font-mono cursor-pointer`}
                    >
                        <option value="" className="text-gray-500">-</option>
                        <option value="[A]">[A]</option>
                        <option value="[B]">[B]</option>
                        <option value="[C]">[C]</option>
                    </select>
                    <input type="text" value={item.issueId} onChange={(e) => onUpdate(item.id, 'issueId', e.target.value)} placeholder="P..." className={`${inputClass} w-32 text-center font-mono`} />
                    <input type="text" value={item.description} onChange={(e) => onUpdate(item.id, 'description', e.target.value)} placeholder="Descrição..." className={`${inputClass} flex-grow`} />
                    <button onClick={() => onRemove(item.id)} className={`p-2.5 transition-colors ${isDarkMode ? 'text-gray-600 hover:text-red-500' : 'text-gray-400 hover:text-red-600'}`}><TrashIcon /></button>
                </div>
            ))}
        </div>
    );
};

const DynamicHistoryList = ({ items, onUpdate, onAdd, onRemove, isDarkMode }) => {
    // Máscara de tempo enquanto digita
    const handleTimeChange = (id, field, value) => {
        const nums = value.replace(/[^0-9]/g, '');
        let formatted = nums;
        if (nums.length > 2) formatted = `${nums.slice(0, 2)}:${nums.slice(2, 4)}`;
        onUpdate(id, field, formatted);
    };

    // Validação para impedir números negativos e limitar a 999
    const handleNumberChange = (id, field, value) => {
        if (value < 0) return; 
        if (value > 999) return; 
        onUpdate(id, field, value);
    };

    const containerClass = getSectionStyle(isDarkMode);
    const labelColor = isDarkMode ? "text-gray-400" : "text-gray-500";
    const headerColor = isDarkMode ? "text-gray-500" : "text-gray-500";
    const btnColor = isDarkMode ? "text-gray-400 hover:text-white" : "text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-full";
    const inputClass = getBaseInputStyle(isDarkMode);

    // Calcular totais
    const totals = items.reduce((acc, curr) => {
        acc.pass += Math.max(0, parseInt(curr.pass, 10) || 0);
        acc.fail += Math.max(0, parseInt(curr.fail, 10) || 0);
        acc.na += Math.max(0, parseInt(curr.na, 10) || 0);
        
        if (curr.time) {
            let h = 0, m = 0;
            if (curr.time.includes(':')) {
                const parts = curr.time.split(':');
                h = parseInt(parts[0], 10) || 0;
                m = parseInt(parts[1], 10) || 0;
            } else if (!isNaN(parseInt(curr.time, 10))) {
                h = parseInt(curr.time, 10) || 0;
            }
            acc.minutes += (h * 60) + m;
        }
        return acc;
    }, { pass: 0, fail: 0, na: 0, minutes: 0 });

    const totalHours = Math.floor(totals.minutes / 60);
    const totalMins = totals.minutes % 60;
    const totalTimeStr = `${String(totalHours).padStart(2, '0')}:${String(totalMins).padStart(2, '0')}`;

    return (
    <div className={containerClass}>
        <div className="flex justify-between items-center mb-4">
            <label className={`text-xs font-bold tracking-widest uppercase ${labelColor}`}>Histórico Diário</label>
            <button onClick={onAdd} className={`text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center gap-1 ${btnColor}`}><PlusIcon /> Adicionar Dia</button>
        </div>
        <div className={`grid grid-cols-12 gap-2 text-[10px] font-bold tracking-wide mb-2 px-1 ${headerColor}`}>
            <div className="col-span-3">TESTADOR</div>
            <div className="col-span-2">DATA</div>
            <div className="col-span-1 text-center">PASS</div>
            <div className="col-span-1 text-center">FAIL</div>
            <div className="col-span-1 text-center">NA</div>
            <div className="col-span-3 text-center">TEMPO</div>
            <div className="col-span-1"></div>
        </div>
        {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-3">
                    <AutocompleteInput 
                        name="testerId" 
                        value={item.tester} 
                        onChange={(e) => onUpdate(item.id, 'tester', e.target.value)} 
                        placeholder="ID" 
                        className="!mb-0" 
                        isDarkMode={isDarkMode}
                    />
                </div>
                <div className="col-span-2">
                    <input 
                        type="date" 
                        value={item.date} 
                        onChange={(e) => onUpdate(item.id, 'date', e.target.value)} 
                        className={`${inputClass} text-xs text-center`} 
                    />
                </div>
                <div className="col-span-1">
                    <input 
                        type="number" 
                        min="0"
                        max="999"
                        value={item.pass} 
                        onChange={(e) => handleNumberChange(item.id, 'pass', e.target.value)} 
                        className={`${inputClass} text-xs text-center`} 
                    />
                </div>
                <div className="col-span-1">
                    <input 
                        type="number" 
                        min="0"
                        max="999"
                        value={item.fail} 
                        onChange={(e) => handleNumberChange(item.id, 'fail', e.target.value)} 
                        className={`${inputClass} text-xs text-center`} 
                    />
                </div>
                <div className="col-span-1">
                    <input 
                        type="number" 
                        min="0"
                        max="999"
                        value={item.na} 
                        onChange={(e) => handleNumberChange(item.id, 'na', e.target.value)} 
                        className={`${inputClass} text-xs text-center`} 
                    />
                </div>
                <div className="col-span-3">
                    <input 
                        type="text" 
                        value={item.time} 
                        onChange={(e) => handleTimeChange(item.id, 'time', e.target.value)} 
                        onBlur={(e) => onUpdate(item.id, 'time', formatToTime(e.target.value))}
                        placeholder="05:00" 
                        className={`${inputClass} text-xs text-center`} 
                        maxLength={5}
                    />
                </div>
                <div className="col-span-1 flex justify-center"><button onClick={() => onRemove(item.id)} className={`p-2 transition-colors ${isDarkMode ? 'text-gray-600 hover:text-red-500' : 'text-gray-400 hover:text-red-600'}`}><TrashIcon /></button></div>
            </div>
        ))}
        {/* LINHA DE TOTAIS */}
        <div className={`grid grid-cols-12 gap-2 mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} text-xs font-bold tracking-wide ${headerColor}`}>
            <div className="col-span-5 text-right pr-4 uppercase tracking-widest">Totais:</div>
            <div className="col-span-1 text-center text-green-600">{totals.pass}</div>
            <div className="col-span-1 text-center text-red-600">{totals.fail}</div>
            <div className="col-span-1 text-center text-yellow-600">{totals.na}</div>
            <div className="col-span-3 text-center text-blue-600">{totalTimeStr}</div>
            <div className="col-span-1"></div>
        </div>
    </div>
    );
};

const DynamicAppList = ({ items, onUpdate, onAdd, onRemove, isDarkMode }) => {
    const borderColor = isDarkMode ? "border-gray-800" : "border-gray-200";
    const labelColor = isDarkMode ? "text-gray-400" : "text-gray-500";
    const btnColor = isDarkMode ? "text-gray-400 hover:text-white" : "text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-full";
    const headerColor = isDarkMode ? "text-gray-500" : "text-gray-500";
    const inputClass = getBaseInputStyle(isDarkMode);

    return (
        <div className={`mb-8 border-t ${borderColor} pt-5`}>
            <div className="flex justify-between items-end mb-3">
                <label className={`text-xs font-bold tracking-widest uppercase ${labelColor}`}>Apps & Versões</label>
                <button onClick={onAdd} className={`text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center gap-1 ${btnColor}`}><PlusIcon /> Adicionar App</button>
            </div>
            <div className={`flex gap-4 text-[10px] font-bold tracking-wide mb-1 px-1 ${headerColor}`}>
                <div className="w-1/2">NOME DO APP</div>
                <div className="w-1/2">VERSÃO</div>
                <div className="w-8"></div>
            </div>
            {items.map((item) => (
                <div key={item.id} className="flex gap-4 mb-2 items-center">
                    <div className="w-1/2">
                        {/* AQUI: MUDANÇA PARA AUTOCOMPLETE NO NOME DO APP */}
                        <AutocompleteInput 
                            name="appName"
                            value={item.name} 
                            onChange={(e) => onUpdate(item.id, 'name', e.target.value)} 
                            placeholder="Nome" 
                            isDarkMode={isDarkMode}
                            className="!mb-0"
                        />
                    </div>
                    <input type="text" value={item.version} onChange={(e) => onUpdate(item.id, 'version', e.target.value)} placeholder="v1.0..." className={`${inputClass} w-1/2`} />
                    <button onClick={() => onRemove(item.id)} className={`p-2 transition-colors ${isDarkMode ? 'text-gray-600 hover:text-red-500' : 'text-gray-400 hover:text-red-600'}`}><TrashIcon /></button>
                </div>
            ))}
        </div>
    );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL (APP)
// ==========================================

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [team, setTeam] = useState('Multimidia');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  // ESTADO MODIFICADO PARA SUPORTAR LISTAS
  const [formData, setFormData] = useState({
    deviceIds: [{ id: 1, value: '' }],
    sampleIds: [{ id: 1, value: '' }],
    accounts: [{ id: 1, value: '' }],
    samsungAccounts: [{ id: 1, value: '' }],
    simCards: [{ id: 1, value: '' }],
    
    // Outros campos mantidos
    pluginVer: '',
    appVersions: '',
    issuesRep: [{ id: 1, criticality: '', issueId: '', description: '' }],
    issuesRef: [{ id: 1, criticality: '', issueId: '', description: '' }],
    testHistory: [{ id: 1, tester: '', date: getTodayISO(), pass: '', fail: '', na: '', time: '' }],
    multimidiaApps: [ { id: 1, name: '', version: '' } ],
    wearableApps: [ { id: 1, name: '', version: '' } ],
    generalApps: [ { id: 1, name: '', version: '' } ]
  });

  useEffect(() => {
    setGeneratedText(generateRemark(team, formData));
    setCopied(false);
  }, [team, formData]);

  const handleChange = (e) => {
    // Para inputs simples remanescentes
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // HANDLERS GENÉRICOS PARA LISTAS DE INPUTS (Contas, IDs, etc)
  const addListItem = (field) => {
    setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], { id: Date.now(), value: '' }]
    }));
  };

  const updateListItem = (field, id, newValue) => {
    setFormData(prev => ({
        ...prev,
        [field]: prev[field].map(item => item.id === id ? { ...item, value: newValue } : item)
    }));
  };

  const removeListItem = (field, id) => {
    setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter(item => item.id !== id)
    }));
  };

  const addIssue = (field) => setFormData(prev => ({ ...prev, [field]: [...prev[field], { id: Date.now(), criticality: '', issueId: '', description: '' }] }));
  const updateIssue = (field, id, key, value) => setFormData(prev => ({ ...prev, [field]: prev[field].map(item => item.id === id ? { ...item, [key]: value } : item) }));
  const removeIssue = (field, id) => setFormData(prev => ({ ...prev, [field]: prev[field].filter(item => item.id !== id) }));

  const addHistoryDay = () => {
    setFormData(prev => ({
        ...prev,
        testHistory: [...prev.testHistory, { id: Date.now(), tester: prev.testHistory[0]?.tester || '', date: getTodayISO(), pass: '', fail: '', na: '', time: '' }]
    }));
  };
  const updateHistory = (id, field, value) => setFormData(prev => ({ ...prev, testHistory: prev.testHistory.map(item => item.id === id ? { ...item, [field]: value } : item) }));
  const removeHistory = (id) => setFormData(prev => ({ ...prev, testHistory: prev.testHistory.filter(item => item.id !== id) }));

  const addApp = (field) => setFormData(prev => ({ ...prev, [field]: [...prev[field], { id: Date.now(), name: '', version: '' }] }));
  const updateApp = (field, id, key, value) => setFormData(prev => ({ ...prev, [field]: prev[field].map(item => item.id === id ? { ...item, [key]: value } : item) }));
  const removeApp = (field, id) => setFormData(prev => ({ ...prev, [field]: prev[field].filter(item => item.id !== id) }));

  // Validação Desativada (O testador mesmo revisa)
  const validateForm = () => {
    return true;
  };

  const handleCopy = async () => {
    if (!validateForm()) {
        alert("Por favor, preencha todos os campos obrigatórios antes de copiar.");
        return;
    }

    const success = await copyToClipboard(generatedText);
    if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } else {
        alert("Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.");
    }

    const uniqueTesters = [...new Set(formData.testHistory.map(t => t.tester).filter(t => t && t.trim().length > 0))];
    
    // Coleta nomes de apps únicos para salvar
    const allApps = [
        ...formData.multimidiaApps, 
        ...formData.wearableApps, 
        ...formData.generalApps
    ].map(a => a.name).filter(n => n && n.trim().length > 0);
    
    const uniqueApps = [...new Set(allApps)];

    // Salva apps
    uniqueApps.forEach(async (app) => {
        try {
            await fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appName: app,
                    // Dados dummy para passar no validador se necessário (dependendo do backend)
                    team: team,
                    testerId: '',
                    full_form_data: {}
                })
            });
        } catch (err) {
            console.error("Erro ao salvar app:", err);
        }
    });

    // Coleta IDs de amostra e dispositivo
    const allSamples = formData.sampleIds.map(s => s.value).filter(v => v && v.trim().length > 0);
    const uniqueSamples = [...new Set(allSamples)];
    
    const allDevices = formData.deviceIds.map(d => d.value).filter(v => v && v.trim().length > 0);
    const uniqueDevices = [...new Set(allDevices)];

    // Salva samples
    uniqueSamples.forEach(async (sample) => {
        try {
            await fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sampleId: sample, 
                    team: team,
                    full_form_data: {}
                })
            });
        } catch (err) { console.error(err); }
    });

    // Salva devices
    uniqueDevices.forEach(async (device) => {
        try {
            await fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deviceId: device,
                    team: team,
                    full_form_data: {}
                })
            });
        } catch (err) { console.error(err); }
    });

    // Salva testers e dados completos
    uniqueTesters.forEach(async (tester) => {
        try {
            await fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    team: team,
                    testerId: tester,
                    account: formData.accounts[0]?.value || '',
                    samsungAccount: formData.samsungAccounts[0]?.value || '',
                    simCard: formData.simCards[0]?.value || '',
                    full_form_data: formData
                })
            });
        } catch (err) {
            console.error("Erro ao salvar dados:", err);
        }
    });
  };

  // Estilos Gerais
  const mainBgClass = isDarkMode ? "bg-[#0a0a0a] text-gray-300 selection:bg-white selection:text-black" : "bg-gray-50 text-gray-800 selection:bg-blue-100 selection:text-blue-900";
  const cardClass = isDarkMode ? "bg-[#111] border border-gray-800" : "bg-white border border-gray-200 shadow-lg";
  const headerTextClass = isDarkMode ? "text-white" : "text-gray-900";
  const subTextClass = isDarkMode ? "text-gray-500" : "text-gray-500";
  const outputBgClass = isDarkMode ? "bg-[#0f0f0f] text-gray-300" : "bg-white text-gray-800";
  const outputHeaderBgClass = isDarkMode ? "bg-[#1a1a1a] border-gray-800" : "bg-gray-50 border-gray-200";

  return (
    <div className={`min-h-screen font-sans flex justify-center p-8 transition-colors duration-300 ${mainBgClass}`}>
      
      <div className="w-full max-w-7xl flex flex-col gap-12">
        
        {/* SEÇÃO DE INPUTS */}
        <div className="flex flex-col gap-8 w-full">
            
            <div className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} pb-6 flex justify-between items-start`}>
                <div>
                    <h1 className={`text-2xl font-semibold tracking-tight uppercase mb-1 ${headerTextClass}`}>Gerador de Remarks</h1>
                    <p className={`text-xs font-medium tracking-wider ${subTextClass}`}>Ferramenta de Relatório Interno v6.0</p>
                </div>
                <button 
                    onClick={toggleTheme}
                    className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-[#222] text-yellow-400 hover:bg-[#333]' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                    title={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
                >
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>

            <div>
                <label className={getLabelStyle(isDarkMode)}>Departamento / Time</label>
                <div className="relative">
                    <select 
                        value={team} onChange={(e) => setTeam(e.target.value)}
                        className={`w-full p-3 border appearance-none rounded-md focus:outline-none cursor-pointer uppercase tracking-wider text-sm shadow-sm font-medium transition-colors ${isDarkMode ? 'bg-[#111] border-gray-700 text-white focus:border-gray-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`}
                    >
                        {['Multimidia', 'Wearables', 'Sanity', 'Apps1', 'Apps2', 'PhoneSettings'].map(t => (<option key={t} value={t}>{t}</option>))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                
                {team === 'Multimidia' && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Sample ID e Conta */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DynamicInputList 
                                label="ID da Amostra / HW" 
                                name="sampleId" // Usado apenas para ref interna se necessario
                                items={formData.sampleIds}
                                onUpdate={(id, val) => updateListItem('sampleIds', id, val)}
                                onAdd={() => addListItem('sampleIds')}
                                onRemove={(id) => removeListItem('sampleIds', id)}
                                isDarkMode={isDarkMode}
                                placeholder="ex: S2410300433/REV0.6"
                            />
                            <DynamicInputList 
                                label="Conta" 
                                name="account"
                                items={formData.accounts}
                                onUpdate={(id, val) => updateListItem('accounts', id, val)}
                                onAdd={() => addListItem('accounts')}
                                onRemove={(id) => removeListItem('accounts', id)}
                                isDarkMode={isDarkMode}
                                placeholder="ex: email@gmail.com"
                            />
                        </div>
                        
                        {/* Chip e Tempo (Tempo removido, sobra espaco) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DynamicInputList 
                                label="Cartão SIM" 
                                name="simCard"
                                items={formData.simCards}
                                onUpdate={(id, val) => updateListItem('simCards', id, val)}
                                onAdd={() => addListItem('simCards')}
                                onRemove={(id) => removeListItem('simCards', id)}
                                isDarkMode={isDarkMode}
                                placeholder="ex: 929..."
                            />
                            {/* Espaço para futuro ou layout */}
                        </div>

                        <DynamicHistoryList items={formData.testHistory} onAdd={addHistoryDay} onUpdate={updateHistory} onRemove={removeHistory} isDarkMode={isDarkMode} />
                        
                        <DynamicAppList 
                            items={formData.multimidiaApps}
                            onAdd={() => addApp('multimidiaApps')}
                            onUpdate={(id, key, val) => updateApp('multimidiaApps', id, key, val)}
                            onRemove={(id) => removeApp('multimidiaApps', id)}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                )}

                {['Wearables', 'Sanity'].includes(team) && (
                    <div className="space-y-4 animate-fade-in">
                        <DynamicInputList 
                            label="ID do Dispositivo" 
                            name="deviceId"
                            items={formData.deviceIds}
                            onUpdate={(id, val) => updateListItem('deviceIds', id, val)}
                            onAdd={() => addListItem('deviceIds')}
                            onRemove={(id) => removeListItem('deviceIds', id)}
                            isDarkMode={isDarkMode}
                            placeholder="ex: S24..."
                        />

                        {team === 'Sanity' ? (
                            <div className="grid grid-cols-1 gap-6">
                                <DynamicInputList 
                                    label="Conta Google" 
                                    name="account"
                                    items={formData.accounts}
                                    onUpdate={(id, val) => updateListItem('accounts', id, val)}
                                    onAdd={() => addListItem('accounts')}
                                    onRemove={(id) => removeListItem('accounts', id)}
                                    isDarkMode={isDarkMode}
                                    placeholder="ex: email@gmail.com"
                                />
                                <DynamicInputList 
                                    label="Conta Samsung" 
                                    name="samsungAccount"
                                    items={formData.samsungAccounts}
                                    onUpdate={(id, val) => updateListItem('samsungAccounts', id, val)}
                                    onAdd={() => addListItem('samsungAccounts')}
                                    onRemove={(id) => removeListItem('samsungAccounts', id)}
                                    isDarkMode={isDarkMode}
                                    placeholder="ex: email@gmail.com"
                                />
                                <DynamicInputList 
                                    label="Cartão SIM" 
                                    name="simCard"
                                    items={formData.simCards}
                                    onUpdate={(id, val) => updateListItem('simCards', id, val)}
                                    onAdd={() => addListItem('simCards')}
                                    onRemove={(id) => removeListItem('simCards', id)}
                                    isDarkMode={isDarkMode}
                                    placeholder="ex: 929..."
                                />
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <DynamicAppList 
                                        items={formData.wearableApps}
                                        onAdd={() => addApp('wearableApps')}
                                        onUpdate={(id, key, val) => updateApp('wearableApps', id, key, val)}
                                        onRemove={(id) => removeApp('wearableApps', id)}
                                        isDarkMode={isDarkMode}
                                    />
                                </div>
                            </div>
                        )}
                        <DynamicHistoryList items={formData.testHistory} onAdd={addHistoryDay} onUpdate={updateHistory} onRemove={removeHistory} isDarkMode={isDarkMode} />
                    </div>
                )}

                {['Apps1', 'Apps2', 'PhoneSettings'].includes(team) && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-6">
                             <DynamicInputList 
                                label="ID do Dispositivo / HW" 
                                name="deviceId"
                                items={formData.deviceIds}
                                onUpdate={(id, val) => updateListItem('deviceIds', id, val)}
                                onAdd={() => addListItem('deviceIds')}
                                onRemove={(id) => removeListItem('deviceIds', id)}
                                isDarkMode={isDarkMode}
                                placeholder="ex: S24.../REV1.0"
                            />
                             <DynamicInputList 
                                label="Cartão SIM" 
                                name="simCard"
                                items={formData.simCards}
                                onUpdate={(id, val) => updateListItem('simCards', id, val)}
                                onAdd={() => addListItem('simCards')}
                                onRemove={(id) => removeListItem('simCards', id)}
                                isDarkMode={isDarkMode}
                                placeholder="ex: 929..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                             <DynamicInputList 
                                label="Conta Google" 
                                name="account"
                                items={formData.accounts}
                                onUpdate={(id, val) => updateListItem('accounts', id, val)}
                                onAdd={() => addListItem('accounts')}
                                onRemove={(id) => removeListItem('accounts', id)}
                                isDarkMode={isDarkMode}
                                placeholder="ex: email@gmail.com"
                            />
                             <DynamicInputList 
                                label="Conta Samsung" 
                                name="samsungAccount"
                                items={formData.samsungAccounts}
                                onUpdate={(id, val) => updateListItem('samsungAccounts', id, val)}
                                onAdd={() => addListItem('samsungAccounts')}
                                onRemove={(id) => removeListItem('samsungAccounts', id)}
                                isDarkMode={isDarkMode}
                                placeholder="ex: email@gmail.com"
                            />
                        </div>
                        
                        <DynamicAppList 
                            items={formData.generalApps}
                            onAdd={() => addApp('generalApps')}
                            onUpdate={(id, key, val) => updateApp('generalApps', id, key, val)}
                            onRemove={(id) => removeApp('generalApps', id)}
                            isDarkMode={isDarkMode}
                        />

                        <DynamicHistoryList items={formData.testHistory} onAdd={addHistoryDay} onUpdate={updateHistory} onRemove={removeHistory} isDarkMode={isDarkMode} />
                    </div>
                )}

                <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} pt-6`}>
                    <DynamicIssueList label="Problemas Reportados" items={formData.issuesRep} onAdd={() => addIssue('issuesRep')} onUpdate={(id, key, val) => updateIssue('issuesRep', id, key, val)} onRemove={(id) => removeIssue('issuesRep', id)} isDarkMode={isDarkMode} />
                    <DynamicIssueList label="Problemas Referenciados" items={formData.issuesRef} onAdd={() => addIssue('issuesRef')} onUpdate={(id, key, val) => updateIssue('issuesRef', id, key, val)} onRemove={(id) => removeIssue('issuesRef', id)} isDarkMode={isDarkMode} />
                </div>
            </div>
        </div>

        {/* SEÇÃO DE OUTPUT (AGORA ABAIXO) */}
        <div className="w-full relative z-10">
            <div className={`${cardClass} overflow-hidden flex flex-col min-h-[400px] rounded-lg transition-colors`}>
                <div className={`${outputHeaderBgClass} p-4 flex justify-between items-center border-b transition-colors`}>
                    <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">Saída Gerada</span>
                    <button 
                        onClick={handleCopy}
                        className={`text-[10px] uppercase font-bold tracking-widest px-4 py-2 border rounded-full transition-all shadow-sm ${
                            copied 
                                ? 'bg-green-500 text-white border-green-500' 
                                : isDarkMode 
                                    ? 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-400 hover:text-white' 
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-900 hover:shadow-md'
                        }`}
                    >
                        {copied ? 'Copiado!' : 'Copiar e Salvar'}
                    </button>
                </div>
                <div 
                    className={`flex-grow w-full p-6 font-mono text-xs overflow-auto custom-scrollbar transition-colors select-none ${outputBgClass}`}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', cursor: 'default' }}
                >
                    <pre className="whitespace-pre-wrap font-inherit bg-transparent border-none p-0 m-0">{generatedText}</pre>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default App;