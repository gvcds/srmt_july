'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  Activity, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Navbar } from "@/components/navbar";
import { useTheme } from "@/components/theme-provider";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// --- TYPES ---
interface TeamBoardArea {
  id: number;
  name: string;
}

interface TeamBoardMember {
  id: number;
  area_id: number;
  name: string;
  status: string;
}

interface Absence {
  id: number;
  member_id: number;
  date: string;
  reason: string;
}

// --- API ---
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") return `${window.location.protocol}//${window.location.hostname}:8001`;
  return "http://localhost:8001";
};

// --- BACKGROUND ---
const AIBackground = ({ isDarkMode }: { isDarkMode: boolean }) => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-lg blur-[120px] opacity-20 animate-pulse 
            ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
            style={{ animationDuration: '8s' }} 
        />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-lg blur-[120px] opacity-20 animate-pulse
            ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-400'}`} 
            style={{ animationDuration: '12s', animationDelay: '2s' }} 
        />
    </div>
);

export default function WorkloadPage() {
  const { isDarkMode } = useTheme();

  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [areas, setAreas] = useState<TeamBoardArea[]>([]);
  const [members, setMembers] = useState<TeamBoardMember[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch Areas & Members
      const boardRes = await fetch(`${getApiBaseUrl()}/team-board/all?tab=fixed`);
      if (boardRes.ok) {
        const boardData = await boardRes.json();
        setAreas(boardData.areas || []);
        setMembers(boardData.members || []);
      }

      // Fetch Absences
      const absenceRes = await fetch(`${getApiBaseUrl()}/team-board/absences`);
      if (absenceRes.ok) {
        const absenceData = await absenceRes.json();
        setAbsences(absenceData || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do workload:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- PROCESSING ---
  const absencesForDate = absences.filter(a => a.date === selectedDate);
  const absentMemberIds = new Set(absencesForDate.map(a => a.member_id));

  let totalHours = 0;
  const teamStats: Record<number, { name: string, total: number, members: any[] }> = {};

  areas.forEach(area => {
    teamStats[area.id] = { name: area.name, total: 0, members: [] };
  });

  members.forEach(member => {
    const isAbsent = absentMemberIds.has(member.id);
    const hours = isAbsent ? 0 : 7; // Regra: 7 horas por pessoa se estiver presente
    
    // Ignorar posições de vagas vazias ou placeholders se houver (geralmente status normal/intern tem nomes)
    if (!member.name.toLowerCase().includes('vaga')) {
        if (teamStats[member.area_id]) {
            teamStats[member.area_id].members.push({ ...member, isAbsent, hours });
            teamStats[member.area_id].total += hours;
        }
        totalHours += hours;
    }
  });

  // Somente times que possuem membros
  const activeTeams = Object.values(teamStats).filter(team => team.members.length > 0);

  // --- RENDER ---
  const mainBgClass = isDarkMode 
    ? "bg-[#050505] text-gray-200" 
    : "bg-[#f5f5f7] text-gray-800";

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center transition-colors duration-1000 ${mainBgClass}`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />

      <div className="w-full max-w-7xl px-4 pt-32 pb-12 relative z-10 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 animate-in slide-in-from-bottom-4 duration-700 fade-in">
            <div className="text-center md:text-left">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-4 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Capacidade e Planejamento</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                    Workload <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Geral</span>
                </h1>
                <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tempo de trabalho disponível descontando as faltas.
                </p>
            </div>

            {/* SELETOR DE DATA */}
            <div className={`flex items-center gap-3 p-2 rounded-2xl border backdrop-blur-xl shadow-xl ${isDarkMode ? 'bg-[#111]/80 border-white/10' : 'bg-white/90 border-gray-200'}`}>
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-black'}`}>
                    <Calendar className="w-5 h-5" />
                </div>
                <div className="flex flex-col pr-4">
                    <label className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Data Analisada
                    </label>
                    <Input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className={`h-8 px-2 py-1 text-sm border-0 font-bold focus-visible:ring-0 p-0 shadow-none bg-transparent ${isDarkMode ? 'text-white' : 'text-black'}`}
                    />
                </div>
            </div>
        </div>

        {isLoading ? (
            <div className="flex items-center justify-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
            </div>
        ) : (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                {/* BIG CARD - GERAL */}
                <Card className={`relative overflow-hidden rounded-[2rem] border p-8 md:p-12 shadow-2xl transition-all ${isDarkMode ? 'bg-gradient-to-br from-[#111] to-[#1a1a1a] border-white/10 shadow-black/50' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-gray-200/50'}`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Clock className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                        <h2 className={`text-lg font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Capacidade Total (Geral)
                        </h2>
                        <div className="flex items-end gap-3">
                            <span className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-blue-500 to-purple-600">
                                {totalHours}
                            </span>
                            <span className={`text-2xl font-bold mb-3 md:mb-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>horas</span>
                        </div>
                        <p className={`mt-4 font-medium flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Users className="w-4 h-4" /> {members.filter(m => !absentMemberIds.has(m.id)).length} colaboradores presentes
                        </p>
                    </div>
                </Card>

                {/* TEAMS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTeams.map(team => (
                        <Card key={team.name} className={`flex flex-col h-full rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-[#111]/60 border-white/10 hover:border-white/20' : 'bg-white/80 border-gray-200 hover:border-gray-300'}`}>
                            {/* TEAM HEADER */}
                            <div className={`p-6 border-b ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-black flex items-center gap-2">
                                        <Briefcase className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        {team.name}
                                    </h3>
                                </div>
                                <div className="flex items-end gap-1.5">
                                    <span className="text-4xl font-black">{team.total}</span>
                                    <span className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>hrs</span>
                                </div>
                            </div>
                            
                            {/* MEMBERS LIST */}
                            <div className="p-4 flex-grow flex flex-col gap-2">
                                {team.members.map(member => (
                                    <div 
                                        key={member.id} 
                                        className={`flex justify-between items-center p-3 rounded-xl border transition-colors ${
                                            member.isAbsent 
                                                ? (isDarkMode ? 'bg-white/5 border-white/5 opacity-50' : 'bg-gray-100 border-gray-100 opacity-60')
                                                : (isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200 shadow-sm')
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                                member.isAbsent
                                                    ? (isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-300 text-gray-500')
                                                    : (isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')
                                            }`}>
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`text-sm font-bold ${member.isAbsent && (isDarkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through')}`}>
                                                {member.name.split(' ')[0]} {member.name.split(' ').length > 1 ? member.name.split(' ')[member.name.split(' ').length - 1] : ''}
                                            </span>
                                        </div>

                                        <div className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${
                                            member.isAbsent
                                                ? (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
                                                : (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
                                        }`}>
                                            {member.isAbsent ? (
                                                <>
                                                    <AlertCircle className="w-3 h-3" /> Falta (0h)
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-3 h-3" /> 7h
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}