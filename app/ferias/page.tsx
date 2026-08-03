'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plane,
  CalendarRange,
  ShieldAlert,
  X,
  AlertCircle,
  LayoutGrid,
  CalendarDays,
  Search,
  Trash2,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  MapPin,
  Settings,
  Users,
  Download,
  Check,
  TrendingUp
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Navbar } from '@/components/navbar';
import { useTheme } from '@/components/theme-provider';

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
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[80px] md:blur-[120px] opacity-20 animate-pulse transition-colors duration-500 will-change-transform
        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '8s', transform: 'translateZ(0)' }} 
      />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[80px] md:blur-[120px] opacity-20 animate-pulse transition-colors duration-500 will-change-transform
        ${isDarkMode ? 'bg-purple-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '12s', animationDelay: '2s', transform: 'translateZ(0)' }} 
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

type VacationPeriod = { start: string; end: string; status: string; category?: string };

const HOLIDAYS_2026: Record<string, string> = {
  '2026-04-03': 'Paixão de Cristo',
  '2026-04-05': 'Páscoa',
  '2026-04-20': 'Tiradentes (Mudança)',
  '2026-05-01': 'Dia do Trabalhador',
  '2026-06-04': 'Corpus Christi',
  '2026-06-05': 'Corpus Christi (Ponte)',
  '2026-09-05': 'Elevação do Amazonas',
  '2026-09-07': 'Independência do Brasil',
  '2026-10-12': 'N. Sra. Aparecida',
  '2026-10-24': 'Aniversário de Manaus',
  '2026-11-02': 'Finados',
  '2026-11-15': 'Proclamação da República',
  '2026-11-20': 'Consciência Negra',
  '2026-12-07': 'N. Sra. Conceição (Ponte)',
  '2026-12-08': 'N. Sra. da Conceição',
  '2026-12-24': 'Véspera de Natal (Ponte)',
  '2026-12-25': 'Natal',
  '2026-12-31': 'Véspera de Ano Novo (Ponte)'
};

// Pequena correção no objeto para garantir consistência
HOLIDAYS_2026['2026-12-31'] = 'Véspera de Ano Novo (Ponte)';

function CustomToast({ message, type, isVisible, onClose, isDarkMode }: any) {
  if (!isVisible) return null;
  const glassStyle = isDarkMode ? 'bg-black/80 border-white/10 text-gray-100' : 'bg-white/80 border-white/40 text-gray-800';
  let iconColor = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-orange-500';
  let Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : AlertTriangle;

  return (
    <div className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 max-w-sm ${glassStyle}`}>
      <div className={`p-2 rounded-full bg-opacity-10 ${iconColor.replace('text-', 'bg-')}`}><Icon className={`w-5 h-5 ${iconColor}`} /></div>
      <div className="flex-1"><p className="text-sm font-medium leading-tight">{message}</p></div>
      <button onClick={onClose}><X className="w-4 h-4 opacity-60" /></button>
    </div>
  );
}

interface TeamCalendarContainerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  isDarkMode: boolean;
  viewType: 'calendar' | 'year';
  onSelectDate: (date: Date) => void;
  onShowDetails: (date: Date) => void;
  selectionStart: Date | null;
  selectionEnd: Date | null;
  members: any[];
  groupedMembers?: Record<string, any[]>;
  getVacationBadgeClass: (v?: any) => string;
}

const TeamCalendarContainer = ({
  currentDate, onDateChange, isDarkMode, viewType, onSelectDate, onShowDetails,
  selectionStart, selectionEnd, members, groupedMembers, getVacationBadgeClass
}: TeamCalendarContainerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navigate = (dir: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'year') newDate.setFullYear(newDate.getFullYear() + (dir === 'next' ? 1 : -1));
    else newDate.setMonth(newDate.getMonth() + (dir === 'next' ? 1 : -1));
    onDateChange(newDate);
  };

  const timelineDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const days: Date[] = [];
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        days.push(new Date(year, m, d));
      }
    }
    return days;
  }, [currentDate]);

  const scrollToToday = () => {
    const today = new Date();
    const index = timelineDays.findIndex(d => d.toDateString() === today.toDateString());
    if (index !== -1 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = index * cellWidth - (scrollContainerRef.current.clientWidth / 2) + sidebarWidth;
    }
  };

  const isVacation = (date: Date, vacations: VacationPeriod[]) => {
    if (!vacations) return undefined;
    const dStr = date.toISOString().split('T')[0];
    return vacations.find(v => v.status !== 'rejected' && dStr >= v.start && dStr <= v.end);
  };

  const getHoliday = (date: Date) => {
    const dStr = date.toISOString().split('T')[0];
    return HOLIDAYS_2026[dStr];
  };

  const getDayVacations = (date: Date) => {
    if (!members) return [];
    return members.reduce((acc, member) => {
      const v = isVacation(date, member.vacations || []);
      if (v) acc.push({ member, vacation: v });
      return acc;
    }, [] as any[]);
  };

  const isInSelectionRange = (date: Date) => {
    if (!selectionStart) return false;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const s = new Date(selectionStart.getFullYear(), selectionStart.getMonth(), selectionStart.getDate()).getTime();
    if (selectionEnd) {
      const e = new Date(selectionEnd.getFullYear(), selectionEnd.getMonth(), selectionEnd.getDate()).getTime();
      return d >= Math.min(s, e) && d <= Math.max(s, e);
    }
    return d === s;
  };

  const cellWidth = 40;
  const sidebarWidth = 280;
  const rowHeight = 60;
  const headerHeight = 80;

  const renderTimeline = () => {
    const todayStr = new Date().toDateString();

    return (
      <div className="flex-grow flex flex-col overflow-hidden relative group/timeline">
        <div ref={scrollContainerRef} className="flex-grow overflow-auto custom-scrollbar relative bg-transparent">
          <div className="inline-block min-w-full">
            <div className="sticky top-0 z-[60] flex">
              <div className={`sticky left-0 z-[70] flex-shrink-0 border-b border-r ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/10'}`} style={{ width: sidebarWidth, height: headerHeight }}>
                <div className="flex flex-col h-full justify-center px-6"><span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Timeline</span><span className="text-[8px] opacity-40 font-black uppercase tracking-widest mt-1">SVP • {currentDate.getFullYear()}</span></div>
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex h-10 border-b border-black/10 dark:border-white/10">
                  {Array.from({ length: 12 }).map((_, m) => {
                    const monthDate = new Date(currentDate.getFullYear(), m, 1);
                    const daysInMonth = new Date(currentDate.getFullYear(), m + 1, 0).getDate();
                    return (<div key={m} className={`flex-shrink-0 flex items-center px-4 border-r border-black/5 dark:border-white/5 font-black text-[10px] uppercase tracking-[0.2em] ${isDarkMode ? 'bg-[#0a0a0a]/90 text-white/60' : 'bg-white/90 text-black/60'} backdrop-blur-md`} style={{ width: daysInMonth * cellWidth }}>{monthDate.toLocaleString('pt-BR', { month: 'long' })}</div>);
                  })}
                </div>
                <div className="flex h-10">
                  {timelineDays.map((d, i) => {
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    const isToday = d.toDateString() === todayStr;
                    const isSelected = isInSelectionRange(d);
                    const holiday = getHoliday(d);
                    return (<div key={i} onClick={() => onSelectDate(d)} className={`flex-shrink-0 flex items-center justify-center border-r border-b border-black/5 dark:border-white/5 text-[9px] font-black cursor-pointer transition-all ${isSelected ? '!bg-blue-600 !text-white !opacity-100 z-20 shadow-[0_0_15px_rgba(37,99,235,0.7)] scale-110' : (isDarkMode ? 'bg-[#0a0a0a]/80 backdrop-blur-md' : 'bg-white backdrop-blur-md')} ${isWeekend && !isSelected ? 'bg-black/[0.05] dark:bg-white/[0.05] opacity-40' : ''} ${holiday && !isSelected ? 'text-red-500 bg-red-500/5' : ''} ${isToday && !isSelected ? 'text-blue-600 font-black border-b-2 border-blue-600 z-10' : ''}`} style={{ width: cellWidth }} title={holiday}>{holiday ? '•' : d.getDate()}</div>);
                  })}
                </div>
              </div>
            </div>
            {Object.entries(groupedMembers || {}).map(([teamName, teamMembers]) => (
              <div key={teamName} className="flex flex-col">
                <div className="flex sticky top-[80px] z-50">
                   <div className={`sticky left-0 flex-shrink-0 flex items-center px-6 border-b border-r h-8 ${isDarkMode ? 'bg-blue-900/20 border-white/10' : 'bg-blue-50 border-black/10'}`} style={{ width: sidebarWidth }}><Users className="w-3 h-3 text-blue-500 mr-2" /><span className="text-[9px] font-black uppercase tracking-widest text-blue-600">{teamName}</span></div>
                  <div className={`flex-grow h-8 border-b ${isDarkMode ? 'bg-blue-900/10 border-white/10' : 'bg-blue-50/50 border-black/10'}`} style={{ width: timelineDays.length * cellWidth }} />
                </div>
                {teamMembers.map(member => (
                  <div key={member.id} className="flex group/row">
                    <div className={`sticky left-0 z-40 flex-shrink-0 flex items-center px-6 border-b border-r transition-colors ${isDarkMode ? 'bg-[#0a0a0a] border-white/10 group-hover/row:bg-white/5' : 'bg-white border-black/10 group-hover/row:bg-black/5'}`} style={{ width: sidebarWidth, height: rowHeight }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center text-[10px] font-black text-blue-500 border border-blue-500/20">{member.name.charAt(0)}</div>
                        <div className="flex flex-col truncate"><span className="text-[11px] font-bold truncate tracking-tight">{member.name}</span><span className="text-[7px] font-black opacity-30 uppercase tracking-widest">{member.role || 'SVP Team'}</span></div>
                      </div>
                    </div>
                    <div className="flex">
                      {timelineDays.map((d, i) => {
                        const vacation = isVacation(d, member.vacations || []);
                        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                        const isSelected = isInSelectionRange(d);
                        const isToday = d.toDateString() === todayStr;
                        return (
                          <div key={i} onClick={() => onSelectDate(d)} className={`flex-shrink-0 border-b border-r border-black/5 dark:border-white/5 relative cursor-pointer transition-colors ${isWeekend ? 'bg-black/[0.03] dark:bg-white/[0.02]' : ''} ${isSelected ? 'bg-blue-600/10' : 'hover:bg-blue-500/[0.05]'}`} style={{ width: cellWidth, height: rowHeight }}>
                            {isToday && <div className="absolute inset-y-0 left-1/2 w-px bg-blue-500/20 z-0" />}
                            {vacation && (
                              <div className={`absolute inset-y-2 inset-x-0.5 rounded-lg z-10 shadow-lg border border-white/10 flex items-center justify-center overflow-hidden group/badge ${getVacationBadgeClass(vacation)}`}>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                                <span className="text-[7px] font-black uppercase tracking-tighter text-center px-1 opacity-0 group-hover/badge:opacity-100 transition-all scale-75 group-hover/badge:scale-100">{vacation.status === 'approved' ? 'OK' : '...'}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 px-8 py-4 rounded-xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl opacity-0 group-hover/timeline:opacity-100 transition-all duration-500 scale-90 group-hover/timeline:scale-100">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[8px] font-black uppercase text-white/60">Aprovado</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400" /><span className="text-[8px] font-black uppercase text-white/60">Pendente</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[8px] font-black uppercase text-white/60">Fluig</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /><span className="text-[8px] font-black uppercase text-white/60">DayOff</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-[8px] font-black uppercase text-white/60">Ausência</span></div>
        </div>
      </div>
    );
  };

  const renderMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const first = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = first - 1; i >= 0; i--) days.push({ date: new Date(year, month, -i), current: false });
    for (let i = 1; i <= new Date(year, month + 1, 0).getDate(); i++) days.push({ date: new Date(year, month, i), current: true });
    while (days.length < 42) days.push({ date: new Date(year, month + 1, days.length - (new Date(year, month + 1, 0).getDate() + first) + 1), current: false });

    return (
      <div className="flex-grow p-6 pt-2 grid grid-cols-7 gap-3" style={{ gridTemplateRows: 'auto repeat(6, 1fr)' }}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-0">{d}</div>)}
        {days.map((dObj, i) => {
          const vList = getDayVacations(dObj.date);
          const holiday = getHoliday(dObj.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isPast = dObj.date < today;

          return (
            <div key={i} onClick={() => onSelectDate(dObj.date)} onDoubleClick={() => onShowDetails(dObj.date)} className={`relative rounded-xl border p-3 min-h-[100px] transition-all duration-500 cursor-pointer ${dObj.current ? '' : 'opacity-20'} ${isPast ? 'opacity-40 grayscale-[0.5]' : ''} ${isInSelectionRange(dObj.date) ? 'ring-2 ring-blue-500 bg-blue-500/10' : isDarkMode ? 'bg-black/20 border-white/5 hover:bg-black/40' : 'bg-white border-black/5 hover:bg-gray-50'} ${holiday ? 'bg-red-500/5 border-red-500/20' : ''}`} title={holiday}>
              <div className="flex justify-between items-start">
                <span className={`text-sm font-black ${new Date().toDateString() === dObj.date.toDateString() ? 'text-blue-500' : ''} ${holiday ? 'text-red-500' : ''}`}>{dObj.date.getDate()}</span>
                {holiday && <span className="text-[7px] font-black uppercase text-red-500/60 leading-tight text-right max-w-[60px]">{holiday}</span>}
              </div>
              <div className="mt-2 flex flex-col gap-1">
                {vList.slice(0, 3).map((v: any, j: number) => (<div key={j} className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase truncate shadow-sm ${getVacationBadgeClass(v.vacation)}`}>{v.member.name}</div>))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearGrid = () => {
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-grow p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {months.map((monthDate, idx) => {
              const firstDay = new Date(year, idx, 1).getDay();
              const daysInMonth = new Date(year, idx + 1, 0).getDate();
              const days = Array.from({ length: daysInMonth }, (_, d) => new Date(year, idx, d + 1));
              return (
                <div key={idx} className={`p-5 rounded-xl border transition-all duration-500 hover:scale-[1.02] ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-blue-500">{monthDate.toLocaleString('pt-BR', { month: 'long' })}</h3>
                  <div className="grid grid-cols-7 gap-1">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={`${idx}-${d}-${i}`} className="text-center text-[7px] font-black opacity-20">{d}</div>)}
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${idx}-${i}`} />)}
                    {days.map(d => {
                      const vList = getDayVacations(d);
                      const isToday = d.toDateString() === new Date().toDateString();
                      const isSelected = isInSelectionRange(d);
                      const holiday = getHoliday(d);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const isPast = d < today;
                      
                      const tooltipText = [];
                      if (holiday) tooltipText.push(holiday);
                      if (vList.length > 0) tooltipText.push(`Férias: ${vList.map((v: any) => v.member.name).join(', ')}`);                      
                      return (<div key={d.toISOString()} onClick={() => onSelectDate(d)} onDoubleClick={() => onShowDetails(d)} className={`aspect-square flex flex-col items-center justify-center rounded-lg text-[9px] font-bold cursor-pointer transition-all relative ${isSelected ? 'bg-blue-600 text-white shadow-lg scale-110 z-10' : vList.length > 0 ? getVacationBadgeClass(vList[0].vacation) : isToday ? 'text-blue-500 ring-1 ring-blue-500' : holiday ? 'text-red-500 bg-red-500/10' : 'hover:bg-blue-500/10'} ${isPast ? 'opacity-30 grayscale' : ''}`} title={tooltipText.join(' | ')}>{d.getDate()}{holiday && <div className="w-1 h-1 rounded-full bg-red-500 mt-0.5" />}</div>);
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legenda Year View */}
        <div className={`p-6 border-t flex flex-wrap items-center justify-center gap-8 ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-blue-500 shadow-sm" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Ausência Programada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-emerald-500 shadow-sm" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Aprovado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-amber-500 shadow-sm" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-purple-500 shadow-sm" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Day-Off</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-rose-500 shadow-sm" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Ausência</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-red-500/20 ring-1 ring-red-500/40" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 text-red-500">Feriado</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={`flex flex-col h-full w-full border-none shadow-2xl backdrop-blur-3xl rounded-xl overflow-hidden ${isDarkMode ? 'bg-black/30' : 'bg-white/40 shadow-black/5'}`}>
      <div className={`p-5 border-b flex flex-col md:flex-row justify-between items-center gap-6 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-black tracking-tighter capitalize w-[250px] text-center">{viewType === 'year' ? currentDate.getFullYear() : currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
          <div className={`flex gap-2 p-1 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
            <Button variant="ghost" size="sm" onClick={() => navigate('prev')} className="h-8 w-8 p-0 rounded-lg"><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => { onDateChange(new Date()); }} className="px-3 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-500/10 hover:text-blue-500 transition-all">Hoje</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('next')} className="h-8 w-8 p-0 rounded-lg"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
      {viewType === 'year' ? renderYearGrid() : renderMonthGrid()}
    </Card>
  );
};

function FeriasContent() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewType, setViewType] = useState<'calendar' | 'year'>('calendar');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [periods, setPeriods] = useState<any[]>([]);
  const [requestCategory, setRequestCategory] = useState<'vacation' | 'day-off' | 'ausencia'>('vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vacationDays, setVacationDays] = useState('');
  const [sellDays, setSellDays] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [selectedDayDetails, setSelectedDayDetails] = useState<any>(null);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  // Efeito para esconder o toast automaticamente após 3 segundos
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (name: string) => {
    setSearchTerm(name);
  };

  const stats = useMemo(() => {
    const year = currentMonth.getFullYear().toString();
    const myData = teamMembers.find(m => m.name === currentUserName);
    
    // Se não encontrar o usuário (ex: primeiro acesso ou erro de carga), assume saldo padrão
    const scheduledVacations = myData?.vacations?.filter((v: any) => v.category !== 'day-off' && v.category !== 'ausencia' && v.status !== 'rejected' && v.start.startsWith(year)) || [];
    const daysScheduled = scheduledVacations.reduce((acc: number, v: any) => {
      const s = new Date(`${v.start}T00:00:00`);
      const e = new Date(`${v.end}T00:00:00`);
      return acc + (Math.floor((e.getTime() - s.getTime()) / 86400000) + 1);
    }, 0);
    
    const daysInCart = periods.filter(p => p.category !== 'day-off' && p.category !== 'ausencia' && p.start.startsWith(year)).reduce((a, p) => a + p.days, 0);
    const totalVacationUsed = daysScheduled + daysInCart;
    const currentAllowance = sellDays ? 20 : 30;
    
    const scheduledDayOffs = myData?.vacations?.filter((v: any) => v.category === 'day-off' && v.status !== 'rejected' && v.start.startsWith(year)) || [];
    const dayOffInCart = periods.filter(p => p.category === 'day-off' && p.start.startsWith(year)).length;
    const totalDayOffUsed = scheduledDayOffs.length + dayOffInCart;
    
    const isAvailable = totalDayOffUsed === 0;

    const scheduledAusencias = myData?.vacations?.filter((v: any) => v.category === 'ausencia' && v.status !== 'rejected' && v.start.startsWith(year)) || [];
    const ausenciaInCart = periods.filter(p => p.category === 'ausencia' && p.start.startsWith(year)).length;
    const totalAusenciaUsed = scheduledAusencias.length + ausenciaInCart;

    return {
      vacation: { 
        total: currentAllowance, 
        used: totalVacationUsed, 
        remaining: Math.max(0, currentAllowance - totalVacationUsed) 
      },
      dayOff: { 
        total: 1, 
        used: totalDayOffUsed, 
        available: isAvailable 
      },
      ausencia: {
        used: totalAusenciaUsed
      }
    };
  }, [teamMembers, currentUserName, periods, sellDays, currentMonth]);

  const yearProgress = useMemo(() => {
    const today = new Date();
    const viewingYear = currentMonth.getFullYear();
    const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    const totalDays = isLeapYear(viewingYear) ? 366 : 365;

    if (viewingYear < today.getFullYear()) {
      return { daysPassed: totalDays, daysRemaining: 0, monthsPassed: 12, monthsRemaining: 0, percent: 100 };
    }
    if (viewingYear > today.getFullYear()) {
      return { daysPassed: 0, daysRemaining: totalDays, monthsPassed: 0, monthsRemaining: 12, percent: 0 };
    }

    const startOfYear = new Date(viewingYear, 0, 1);
    const diff = today.getTime() - startOfYear.getTime();
    const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    const daysRemaining = Math.max(0, totalDays - daysPassed);
    const monthsPassed = today.getMonth();
    const monthsRemaining = 11 - today.getMonth();
    const percent = Math.min(100, Math.round((daysPassed / totalDays) * 100));

    return { daysPassed, daysRemaining, monthsPassed, monthsRemaining, percent };
  }, [currentMonth]);

  const nextHoliday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const holidayDates = Object.keys(HOLIDAYS_2026)
      .map(d => ({ date: new Date(`${d}T00:00:00`), original: d }))
      .filter(h => !isNaN(h.date.getTime()) && h.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (holidayDates.length > 0) {
      const next = holidayDates[0];
      const diffTime = next.date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        name: HOLIDAYS_2026[next.original],
        days: diffDays === 0 ? 'Hoje' : `Em ${diffDays} dias`
      };
    }
    return null;
  }, []);

  const teams = useMemo(() => {
    const t = new Set(teamMembers.map(m => m.area || m.team || 'Sem Time'));
    return ['all', ...Array.from(t)].sort();
  }, [teamMembers]);

  const groupedMembers = useMemo(() => {
    let filtered = teamMembers;
    if (selectedTeam !== 'all') filtered = filtered.filter(m => (m.area || m.team) === selectedTeam);
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(m => m.name?.toLowerCase().includes(term));
    }
    const groups: Record<string, any[]> = {};
    filtered.forEach(m => {
      const t = m.area || m.team || 'Sem Time';
      if (!groups[t]) groups[t] = [];
      groups[t].push(m);
    });
    return groups;
  }, [teamMembers, selectedTeam, searchTerm]);

  const vacationPolicy = [
    "Verifique o calendário do time antes de requisitar.",
    "Programe com no mínimo 3 meses de antecedência e alinhe com o gestor.",
    "O fracionamento deve ter um período de no mínimo 14 dias e os demais 5 dias.",
    "Com abono pecuniário (vender 10 dias), o saldo é de 20 dias em até 2 períodos.",
    "KP Especialista/Projeto e seus backups não podem sair simultaneamente.",
    "O Fluig deve ser enviado em até 30 dias antes do gozo das férias."
  ];

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/users`);
      if (res.ok) setTeamMembers(await res.json());
    } catch (e) { }
  }, []);

  useEffect(() => {
    fetchUsers();
    const stored = localStorage.getItem('user_srmt');
    if (stored) { const u = JSON.parse(stored); setCurrentUserName(u.name); }
    const handleView = (e: any) => setViewType(e.detail);
    window.addEventListener('changeView', handleView);
    return () => window.removeEventListener('changeView', handleView);
  }, [fetchUsers]);

  const handleStartDateChange = (v: string) => {
    if (v) {
      const selected = new Date(`${v}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        setToast({ message: "Não é possível selecionar datas passadas.", type: "error", visible: true });
        return;
      }
    }
    setStartDate(v);
    if (v) {
      if (requestCategory === 'day-off' || requestCategory === 'ausencia') { setEndDate(v); setVacationDays('1'); }
      else if (vacationDays) {
        const d = new Date(`${v}T00:00:00`);
        d.setDate(d.getDate() + (parseInt(vacationDays) - 1));
        setEndDate(d.toISOString().split('T')[0]);
      }
    }
  };

  const handleVacationDaysChange = (v: string) => {
    if (v === '') { setVacationDays(''); setEndDate(''); return; }
    const val = v.replace(/^0+(?=\d)/, '');
    const n = parseInt(val, 10);
    if (requestCategory === 'day-off' || requestCategory === 'ausencia') { setVacationDays('1'); if (startDate) setEndDate(startDate); return; }
    if (!isNaN(n) && n >= 0 && n <= 30 && val.length <= 2) {
      setVacationDays(val);
      if (startDate && n > 0) {
        const d = new Date(`${startDate}T00:00:00`);
        d.setDate(d.getDate() + (n - 1));
        setEndDate(d.toISOString().split('T')[0]);
      } else if (startDate && n === 0) { setEndDate(''); }
    }
  };

  const validateFractioning = () => {
    const vPeriods = periods.filter(p => p.category !== 'day-off');
    if (vPeriods.length === 0) return true;
    const allDays = vPeriods.map(p => p.days);
    const has14 = allDays.some(d => d >= 14);
    if (sellDays) {
      if (vPeriods.length > 2) return "Com venda de 10 dias, use no máximo 2 períodos.";
      if (vPeriods.length === 2 && !has14) return "Um dos períodos deve ter no mínimo 14 dias.";
    } else {
      if (vPeriods.length > 3) return "Máximo de 3 períodos permitido.";
      if (vPeriods.length >= 2 && !has14) return "Pelo menos um período deve ter no mínimo 14 dias.";
      if (vPeriods.length === 3) {
        const idx14 = allDays.findIndex(d => d >= 14);
        const others = allDays.filter((_, i) => i !== idx14);
        if (!others.some(d => d >= 5)) return "Ao dividir em 3, um deve ser 14+ e outro 5+ dias.";
      }
    }
    return true;
  };

  const handleAddPeriod = () => {
    if (!startDate || !endDate) return setToast({ message: 'Selecione as datas de início e fim.', type: 'error', visible: true });
    
    const s = new Date(`${startDate}T00:00:00`);
    const e = new Date(`${endDate}T00:00:00`);
    
    if (s > e) return setToast({ message: 'A data de início não pode ser posterior à data de término.', type: 'error', visible: true });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (s < today) return setToast({ message: 'Não é possível marcar ausências em datas passadas.', type: 'error', visible: true });

    // VALIDAÇÃO DE ANTECEDÊNCIA DE 3 MESES (POLÍTICA SVP)
    if (requestCategory === 'vacation') {
      const minNoticeDate = new Date();
      minNoticeDate.setMonth(minNoticeDate.getMonth() + 3);
      minNoticeDate.setHours(0, 0, 0, 0);
      
      if (s < minNoticeDate) {
        return setToast({ 
          message: 'A política SVP exige antecedência mínima de 3 meses para o agendamento de férias regulares.', 
          type: 'error', 
          visible: true 
        });
      }
    }

    const diff = Math.floor((e.getTime() - s.getTime()) / 86400000) + 1;

    // Validação de sobreposição interna (no próprio carrinho)
    const hasOverlapInCart = periods.some(p => {
      const pStart = new Date(`${p.start}T00:00:00`);
      const pEnd = new Date(`${p.end}T00:00:00`);
      return s <= pEnd && e >= pStart;
    });
    if (hasOverlapInCart) return setToast({ message: 'Este período se sobrepõe a outro já adicionado.', type: 'error', visible: true });

    if (requestCategory !== 'day-off' && requestCategory !== 'ausencia' && diff < 5) {
      return setToast({ message: 'Período mínimo de 5 dias para férias (exceto Day-Off e Ausências).', type: 'error', visible: true });
    }

    if (requestCategory !== 'day-off' && requestCategory !== 'ausencia' && stats.vacation.remaining <= 0) {
      return setToast({ message: 'Você não possui saldo de férias disponível.', type: 'error', visible: true });
    }

    if (requestCategory !== 'day-off' && requestCategory !== 'ausencia' && diff > stats.vacation.remaining) {
      return setToast({ message: `Saldo insuficiente. Você tenta marcar ${diff} dias, mas restam apenas ${stats.vacation.remaining} dias.`, type: 'error', visible: true });
    }

    const storedUser = localStorage.getItem('user_srmt');
    const currentUserData = storedUser ? JSON.parse(storedUser) : null;
    const currentUser = teamMembers.find(m => m.name === currentUserName);

    if (currentUser && currentUserData) {
      const conflictMember = teamMembers.find(m => {
        if (m.id.toString() === currentUser.id.toString()) return false;
        const myTeam = (currentUserData.team || currentUser.area || currentUser.team || '').trim().toLowerCase();
        const otherTeam = (m.area || m.team || '').trim().toLowerCase();
        const isSameTeam = myTeam !== '' && myTeam === otherTeam;
        const isKpBackupConflict = (currentUserData.kp_type && m.kp_type === currentUserData.kp_type && (Boolean(m.is_backup) !== Boolean(currentUserData.is_backup)));
        
        if (isSameTeam || isKpBackupConflict) {
          return m.vacations?.some((v: any) => {
            if (v.status === 'rejected') return false;
            const vStart = new Date(`${v.start}T00:00:00`);
            const vEnd = new Date(`${v.end}T00:00:00`);
            return s <= vEnd && e >= vStart;
          });
        }
        return false;
      });
      if (conflictMember) return setToast({ message: `Bloqueio: ${conflictMember.name} já possui ausência neste período.`, type: 'error', visible: true });
    }

    if (requestCategory === 'day-off' && (diff !== 1 || !stats.dayOff.available)) {
      return setToast({ message: 'Limite de Day-Off (1/ano) atingido ou data inválida.', type: 'error', visible: true });
    }

    if (requestCategory === 'ausencia' && diff !== 1) {
      return setToast({ message: 'Selecione apenas 1 dia para marcar ausência.', type: 'error', visible: true });
    }

    setPeriods([...periods, { start: startDate, end: endDate, days: diff, category: requestCategory }]);
    setStartDate(''); setEndDate(''); setVacationDays('');
    setToast({ message: 'Período adicionado com sucesso!', type: 'success', visible: true });
  };

  const validationError = validateFractioning();
  const canSubmit = periods.length > 0 && validationError === true;

  const handleSubmitRequest = async () => {
    if (!canSubmit) return;
    try {
      const u = teamMembers.find(m => m.name === currentUserName);
      if (!u) return;
      const res = await fetch(`http://${window.location.hostname}:8001/vacations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u.id, periods: periods.map(p => ({ ...p, status: 'pending' })), sellDays })
      });
      if (res.ok) { setPeriods([]); setToast({ message: "Solicitação enviada!", type: "success", visible: true }); router.push('/ferias/aprovacao'); }
    } catch (e) { setToast({ message: "Erro de conexão.", type: "error", visible: true }); }
  };

  const handleShowDetails = (date: Date) => {
    const holiday = HOLIDAYS_2026[date.toISOString().split('T')[0]];
    const vacations = teamMembers.reduce((acc: any[], member: any) => {
      const v = member.vacations?.find((vac: any) => {
        if (vac.status === 'rejected') return false;
        const s = new Date(`${vac.start}T00:00:00`);
        const e = new Date(`${vac.end}T00:00:00`);
        return date >= s && date <= e;
      });
      if (v) acc.push({ member, vacation: v });
      return acc;
    }, []);
    setSelectedDayDetails({ date, holiday, vacations });
  };

  const handleCalendarSelect = (date: Date) => {
    // Bloqueia seleção de datas passadas para o formulário
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    const dateStr = date.toISOString().split('T')[0];

    // Lógica especial para Day-Off e Ausência: permite apenas um dia
    if (requestCategory === 'day-off' || requestCategory === 'ausencia') {
      if (startDate && dateStr !== startDate) {
        setToast({ message: `Para ${requestCategory === 'day-off' ? 'Day-Off' : 'Ausência'}, selecione apenas um dia. A data foi atualizada.`, type: "warning", visible: true });
      }
      setStartDate(dateStr);
      setEndDate(dateStr);
      setVacationDays('1');
      return;
    }

    if (!startDate || (startDate && endDate)) { setStartDate(dateStr); setEndDate(''); }
    else { if (dateStr >= startDate) setEndDate(dateStr); else { setStartDate(dateStr); setEndDate(''); } }
  };

  const getVacationBadgeClass = (v: any) => {
    if (!v) return '';
    if (v.category === 'day-off') return 'bg-purple-500 text-white';
    if (v.category === 'ausencia') return 'bg-rose-500 text-white';
    switch (v.status) {
      case 'conflict': return 'bg-red-500 text-white';
      case 'pending': return 'bg-yellow-400 text-black';
      case 'approved': return 'bg-emerald-500 text-white';
      case 'fluig_approved': return 'bg-blue-500 text-white';
      default: return 'bg-zinc-500 text-white';
    }
  };

  const isDark = isDarkMode;
  const cardCls = `relative overflow-hidden rounded-xl border transition-all duration-500 backdrop-blur-3xl ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/40 border-white/60 shadow-xl'}`;
  const inputCls = `rounded-xl border transition-all duration-300 ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-black/10'}`;

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-10 lg:p-12 transition-colors duration-500 ${isDark ? "bg-[#050505]" : "bg-[#f5f5f7]"} overflow-x-hidden pb-20`}>
      <AIBackground isDarkMode={isDark} />
      <Navbar />
      <CustomToast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast(p => ({ ...p, visible: false }))} isDarkMode={isDark} />

      <div className="w-full max-w-7xl relative z-10 space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 border-b border-black/5 dark:border-white/5 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2"><CalendarRange className="w-3 h-3" /> Ausências & Férias</div>
            <h1 className={`text-4xl md:text-6xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>Planejamento de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Descanso</span></h1>
            <p className="text-base font-bold opacity-40 max-w-md leading-tight">Gerencie seu saldo e visualize a escala do time.</p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-2">
              <div className={`relative ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <Input 
                  placeholder="Pesquisar por nome..." 
                  className={`${inputCls} pl-12 h-11 w-64 text-xs font-bold`}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <button onClick={() => setIsPolicyOpen(true)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 active:scale-95 shadow-lg h-11 ${isDark ? 'bg-amber-500/5 border-amber-500/20 text-amber-500 hover:bg-amber-500' : 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white'}`}><ShieldCheck className="w-3.5 h-3.5" /><span className="text-[9px] font-black uppercase tracking-widest">Política</span></button>
            </div>
            <div className={`flex p-1.5 rounded-xl border backdrop-blur-3xl shadow-2xl ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/80 border-black/5'}`}>
              <button onClick={() => setViewType('calendar')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${viewType === 'calendar' ? 'bg-blue-600 text-white shadow-xl' : 'opacity-40 hover:opacity-100'}`}>Mês</button>
              <button onClick={() => setViewType('year')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${viewType === 'year' ? 'bg-blue-600 text-white shadow-xl' : 'opacity-40 hover:opacity-100'}`}>Ano</button>
              <div className={`w-px h-6 my-auto mx-2 ${isDark ? 'bg-white/20' : 'bg-black/10'}`} /><Link href="/ferias/gestao" className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider opacity-40 hover:opacity-100 transition-all">Gestão</Link>
              <div className={`w-px h-6 my-auto mx-2 ${isDark ? 'bg-white/20' : 'bg-black/10'}`} /><Link href="/ferias/aprovacao" className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider opacity-40 hover:opacity-100 transition-all">Aprovações</Link>
            </div>
          </div>
        </header>

        <main className={`flex flex-col gap-8 transition-all duration-500 xl:flex-row`}>
          <section className={`flex transition-all duration-500 flex-col gap-6 xl:w-[350px] flex-shrink-0`}>
            <Card className={`${cardCls} p-8 h-auto`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Progresso do Ano</h3>
                <span className="text-[10px] font-black text-blue-500">{yearProgress.percent}%</span>
              </div>
              
              <div className="space-y-6">
                {/* Barra de Progresso */}
                <div className="h-1.5 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${yearProgress.percent}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[7px] font-black uppercase opacity-30 tracking-widest">Dias Passados</p>
                    <p className="text-xl font-black tracking-tighter text-blue-500">{yearProgress.daysPassed}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[7px] font-black uppercase opacity-30 tracking-widest">Dias Restantes</p>
                    <p className="text-xl font-black tracking-tighter opacity-60">{yearProgress.daysRemaining}</p>
                  </div>
                </div>

                <div className="h-px bg-black/5 dark:bg-white/5 w-full" />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[7px] font-black uppercase opacity-30 tracking-widest">Meses Passados</p>
                    <p className="text-xl font-black tracking-tighter text-indigo-500">{yearProgress.monthsPassed}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[7px] font-black uppercase opacity-30 tracking-widest">Meses Restantes</p>
                    <p className="text-xl font-black tracking-tighter opacity-60">{yearProgress.monthsRemaining}</p>
                  </div>
                </div>

                {nextHoliday && (
                  <>
                    <div className="h-px bg-black/5 dark:bg-white/5 w-full" />
                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${isDarkMode ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                          <CalendarIcon size={14} />
                        </div>
                        <div>
                          <p className="text-[7px] font-black uppercase opacity-50 tracking-widest">Próximo Feriado</p>
                          <p className="text-[10px] font-bold truncate max-w-[120px]">{nextHoliday.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black tracking-tighter text-blue-500">{nextHoliday.days}</p>
                        <p className="text-[7px] font-black uppercase opacity-40">Dias</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className={`${cardCls} p-8 h-auto`}>
              <h3 className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Saldo de Férias</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className={`font-black tracking-tighter text-5xl`}>{stats.vacation.remaining}</div>
                  <div className="text-[7px] font-black uppercase opacity-30 pb-1">Dias</div>
                </div>
                <div className="h-1 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(stats.vacation.remaining / stats.vacation.total) * 100}%` }} /></div>
              </div>
            </Card>
            <Card className={`${cardCls} p-8 h-auto`}>
              <h3 className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Saldo de Day-Off</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className={`font-black tracking-tighter text-3xl ${stats.dayOff.available ? 'text-emerald-500' : 'text-purple-500'}`}>{stats.dayOff.available ? 'Disponível' : 'Utilizado'}</div>
                  <div className="text-[7px] font-black uppercase opacity-30 pb-1">{stats.dayOff.available ? '1/1' : '0/1'}</div>
                </div>
                <div className="h-1 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${stats.dayOff.available ? 'bg-emerald-500' : 'bg-purple-500'}`} style={{ width: stats.dayOff.available ? '100%' : '0%' }} /></div>
              </div>
            </Card>
            <Card className={`${cardCls} p-8 h-auto`}>
              <h3 className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Ausências Marcadas</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className={`font-black tracking-tighter text-3xl text-rose-500`}>{stats.ausencia.used}</div>
                  <div className="text-[7px] font-black uppercase opacity-30 pb-1">Ilimitado</div>
                </div>
                <div className="h-1 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full bg-rose-500" style={{ width: '100%' }} /></div>
              </div>
            </Card>
            <Card className={`${cardCls} p-8 h-auto`}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between"><h3 className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Nova Solicitação</h3></div>

                <button onClick={() => { setSellDays(!sellDays); setPeriods([]); }} className={`w-full py-3 rounded-xl border transition-all flex items-center justify-center gap-3 mb-1 ${sellDays ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 shadow-lg shadow-amber-500/10' : 'bg-black/5 border-black/5 opacity-40'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${sellDays ? 'bg-amber-500 border-amber-500' : 'border-current'}`}>{sellDays && <Check className="w-3 h-3 text-white" />}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Vender 10 dias (Abono)</span>
                </button>

                <div className={`grid gap-4 items-center grid-cols-1`}>
                  <div className="flex p-1 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 h-8">
                    {(['vacation', 'day-off', 'ausencia'] as const).map(c => (
                      <button key={c} onClick={() => { setRequestCategory(c); if (c === 'day-off' || c === 'ausencia') { setVacationDays('1'); if (startDate) setEndDate(startDate); } }} className={`flex-1 rounded-lg text-[7px] font-black uppercase transition-all ${requestCategory === c ? 'bg-blue-600 text-white shadow-md' : 'opacity-40'}`}>
                        {c === 'vacation' ? 'Férias' : c === 'day-off' ? 'D.O' : 'Ausência'}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2"><Input type="date" value={startDate} onChange={e => handleStartDateChange(e.target.value)} className={`${inputCls} h-8 text-[9px]`} /><Input type="date" value={endDate} className={`${inputCls} h-8 text-[9px] opacity-50 cursor-not-allowed`} disabled={true} /></div>
                  <div className="flex flex-col gap-2">
                    {requestCategory !== 'day-off' && requestCategory !== 'ausencia' ? <Input type="number" value={vacationDays} onChange={e => handleVacationDaysChange(e.target.value)} className={`${inputCls} h-8 text-[9px] w-full`} placeholder="Dias" /> : <div className="w-full h-8 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-[7px] font-black opacity-20">1 Dia</div>}
                    <Button onClick={handleAddPeriod} className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                      <Plus className="w-3.5 h-3.5 mr-2" /> Incluir periodo
                    </Button>
                  </div>
                </div>

                {/* LISTA DE PERÍODOS ADICIONADOS */}
                {periods.length > 0 && (
                  <div className="space-y-2 mt-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                    {periods.map((p, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${p.category === 'day-off' ? 'bg-purple-500' : p.category === 'ausencia' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-tight">
                              {new Date(`${p.start}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} — {new Date(`${p.end}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="text-[7px] opacity-40 font-bold uppercase tracking-widest">{p.days} Dias • {p.category === 'day-off' ? 'Day-Off' : p.category === 'urgent' ? 'Urgente' : p.category === 'ausencia' ? 'Ausência' : 'Férias'}</span>
                          </div>
                        </div>
                        <button onClick={() => setPeriods(periods.filter((_, idx) => idx !== i))} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500/40 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-2">
                  {periods.length > 0 && (
                    <>
                      {validationError !== true && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold text-center leading-tight">{validationError}</div>}
                      <Button onClick={handleSubmitRequest} disabled={!canSubmit} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${canSubmit ? 'bg-blue-600 shadow-lg' : 'bg-gray-500/20'}`}>
                        Enviar Solicitação
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </section>
          <section className={`flex-grow transition-all duration-500 w-full`}>
            <TeamCalendarContainer currentDate={currentMonth} onDateChange={setCurrentMonth} isDarkMode={isDark} viewType={viewType as any} onSelectDate={handleCalendarSelect} onShowDetails={handleShowDetails} selectionStart={startDate ? new Date(`${startDate}T00:00:00`) : null} selectionEnd={endDate ? new Date(`${endDate}T00:00:00`) : null} members={teamMembers} groupedMembers={groupedMembers} getVacationBadgeClass={getVacationBadgeClass} />
          </section>
        </main>
      </div>

      {selectedDayDetails && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 backdrop-blur-2xl animate-in fade-in" onClick={() => setSelectedDayDetails(null)}>
          <Card className={`relative w-full max-w-lg rounded-xl overflow-hidden border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] ${isDark ? 'bg-[#0a0a0a]/90 ring-1 ring-white/10' : 'bg-white/90 ring-1 ring-black/5'}`} onClick={e => e.stopPropagation()}>
            <div className={`p-8 border-b flex justify-between items-center ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/[0.02]'}`}>
              <div>
                <h3 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {selectedDayDetails.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Detalhes do Dia</p>
              </div>
              <Button variant="ghost" onClick={() => setSelectedDayDetails(null)} className="h-10 w-10 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></Button>
            </div>

            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Feriado */}
              {selectedDayDetails.holiday ? (
                <div className={`p-6 rounded-xl border animate-in slide-in-from-left-4 duration-500 ${isDark ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100 text-red-600'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Feriado Nacional</p>
                      <p className="text-xl font-black tracking-tight">{selectedDayDetails.holiday}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 opacity-20 text-[10px] font-black uppercase tracking-[0.3em]">Nenhum feriado neste dia</div>
              )}

              {/* Lista de Férias */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                  <Users className="w-3 h-3" /> Ausências Programadas ({selectedDayDetails.vacations.length})
                </h4>
                
                {selectedDayDetails.vacations.length > 0 ? (
                  <div className="grid gap-3">
                    {selectedDayDetails.vacations.map((v: any, i: number) => (
                      <div key={i} className={`p-5 rounded-xl border flex items-center justify-between group transition-all hover:scale-[1.02] ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-xl ${['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-sky-500'][i % 4]}`}>
                            {v.member.name.charAt(0)}
                          </div>
                          <div>
                            <p className={`text-sm font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{v.member.name}</p>
                            <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{v.member.area || v.member.team}</p>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl border text-[8px] font-black uppercase tracking-widest ${getVacationBadgeClass(v.vacation)}`}>
                          {new Date(`${v.vacation.start}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} – {new Date(`${v.vacation.end}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`p-8 rounded-xl border border-dashed text-center ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-black/10 bg-black/[0.01]'}`}>
                    <p className="text-xs font-bold opacity-30 italic">Ninguém do time está de férias neste dia.</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`p-8 border-t ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/[0.02]'}`}>
              <Button onClick={() => setSelectedDayDetails(null)} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">Fechar Detalhes</Button>
            </div>
          </Card>
        </div>
      )}

      {isPolicyOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-2xl animate-in fade-in">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsPolicyOpen(false)} />
          <Card className={`relative w-full max-w-lg rounded-xl p-10 space-y-8 ${isDark ? 'bg-[#0a0a0a] ring-1 ring-white/10 shadow-2xl' : 'bg-white ring-1 ring-black/5 shadow-2xl'}`}>
            <div className="flex justify-between items-start"><div className="space-y-1"><div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[8px] font-black uppercase tracking-widest mb-2"><ShieldCheck className="w-3 h-3" /> Governança SVP</div><h2 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Política de Férias</h2></div><Button variant="ghost" onClick={() => setIsPolicyOpen(false)} className="h-10 w-10 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></Button></div>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">{vacationPolicy.map((rule, i) => (<div key={i} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-zinc-50 border-zinc-100'}`}><div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</div><p className={`text-xs font-bold leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>{rule}</p></div>))}</div>
            <Button onClick={() => setIsPolicyOpen(false)} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase shadow-lg">Entendido</Button>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function FeriasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase opacity-20 tracking-[0.5em]">Iniciando Calendário...</div>}>
      <FeriasContent />
    </Suspense>
  );
}