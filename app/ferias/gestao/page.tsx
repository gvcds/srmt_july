'use client';

import React, { useCallback, useEffect, useMemo, useState, Suspense } from 'react';
import { 
  CheckCircle2, AlertCircle, X, Search, 
  BarChart3, PieChart as PieChartIcon, 
  Users, Calendar, Sparkles, ListOrdered, Clock, ArrowRight, Sun
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from '@/components/navbar';
import { useTheme } from '@/components/theme-provider';
import Link from 'next/link';

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

function CustomToast({ message, type, isVisible, onClose, isDarkMode }: any) {
  if (!isVisible) return null;
  const glassStyle = isDarkMode ? 'bg-black/80 border-white/10 text-gray-100' : 'bg-white/80 border-white/40 text-gray-800';
  return (
    <div className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 max-w-sm ${glassStyle}`}>
      <div className={`p-2 rounded-lg bg-opacity-10 ${type === 'success' ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500'}`}>
        {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-40 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
}

function GestaoFeriasContent() {
  const { isDarkMode } = useTheme();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserTeam, setCurrentUserTeam] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  const API_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8001` : '';

  const fetchTeam = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`);
      if (res.ok) {
        const allUsers = await res.json();
        setMembers(allUsers);

        // Fetch latest cell for the logged-in user directly from the updated list
        const stored = localStorage.getItem('user_srmt');
        if (stored) {
          const u = JSON.parse(stored);
          const activeUser = allUsers.find((user: any) => String(user.id) === String(u.id));
          if (activeUser) {
            setCurrentUserTeam(activeUser.cell || '');
          } else {
            setCurrentUserTeam(u.cell || '');
          }
        }
      }
    } catch (e) {} finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => { 
    fetchTeam(); 
  }, [fetchTeam]);

  const teamMembers = useMemo(() => {
    if (!currentUserTeam) return members;
    return members.filter(m => m.cell === currentUserTeam);
  }, [members, currentUserTeam]);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.cell || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teamMembers, searchTerm]);

  const stats = useMemo(() => {
    if (!teamMembers.length) return null;
    const allVacations = teamMembers.flatMap(m => m.vacations || []);
    const approved = allVacations.filter((v: any) => v.status === 'approved').length;
    const pending = allVacations.filter((v: any) => v.status === 'pending').length;
    const dayOffs = allVacations.filter((v: any) => v.category === 'day-off').length;
    const urgent = allVacations.filter((v: any) => v.category === 'urgent').length;
    const ausencias = allVacations.filter((v: any) => v.category === 'ausencia').length;
    const regular = allVacations.filter((v: any) => v.category === 'vacation' || !v.category).length;

    // Dados por Área
    const areaMap: Record<string, number> = {};
    teamMembers.forEach(m => {
      const area = m.cell || 'Outros';
      areaMap[area] = (areaMap[area] || 0) + (m.vacations?.length || 0);
    });
    const areaData = Object.entries(areaMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    return {
      totalMembers: teamMembers.length,
      approved,
      pending,
      dayOffs,
      urgent,
      ausencias,
      regular,
      areaData,
      statusData: [
        { name: 'Aprovadas', value: approved, color: '#22c55e' },
        { name: 'Pendentes', value: pending, color: '#f97316' }
      ],
      categoryData: [
        { name: 'Férias', value: regular, color: '#3b82f6' },
        { name: 'Urgência', value: urgent, color: '#f43f5e' },
        { name: 'Day Off', value: dayOffs, color: '#a855f7' },
        { name: 'Ausência', value: ausencias, color: '#ec4899' }
      ]
    };
  }, [teamMembers]);

  const mainBgClass = isDarkMode ? "bg-[#050505] text-zinc-300" : "bg-[#f5f5f7] text-zinc-800";
  const cardClass = `relative overflow-hidden rounded-xl border transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`;

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-10 lg:p-12 transition-colors duration-1000 ${mainBgClass} overflow-x-hidden pb-20`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />
      <CustomToast {...toast} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} isDarkMode={isDarkMode} />

      <div className="w-full max-w-7xl relative z-10 space-y-10">
        <header className="flex flex-col items-center gap-6 pb-10 text-center">
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-4 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
              <Sparkles className="w-4 h-4 animate-pulse" /> Inteligência de Escala
            </div>
            <h1 className={`text-4xl md:text-6xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Gestão de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Ausências</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto opacity-60 font-medium leading-tight">Métricas avançadas e controle de disponibilidade do time.</p>
          </div>

          <div className={`flex p-1.5 rounded-lg border backdrop-blur-3xl shadow-2xl ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-black/5'}`}>
            <Link href="/ferias" className="px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider opacity-40 hover:opacity-100 transition-all">Solicitar</Link>
            <div className={`w-px h-6 my-auto mx-2 ${isDarkMode ? 'bg-white/20' : 'bg-black/10'}`} />
            <div className={`px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider bg-blue-600 text-white shadow-xl`}>Gestão</div>
            <Link href="/ferias/aprovacao" className="px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider opacity-40 hover:opacity-100 transition-all">Aprovações</Link>
          </div>
        </header>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { label: 'Time Total', val: stats.totalMembers, icon: Users, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
              { label: 'Solicitações', val: stats.approved + stats.pending, icon: Calendar, gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20' },
              { label: 'Day Offs', val: stats.dayOffs, icon: Sun, gradient: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/20' },
              { label: 'Ausências', val: stats.ausencias, icon: AlertCircle, gradient: 'from-pink-500 to-rose-600', shadow: 'shadow-rose-500/20' },
              { label: 'Urgências', val: stats.urgent, icon: AlertCircle, gradient: 'from-orange-400 to-rose-500', shadow: 'shadow-orange-500/20' }
            ].map((kpi, i) => (
              <Card key={i} className={`${cardClass} p-6 flex items-center justify-between group transition-all duration-300`}>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">{kpi.label}</p>
                  <p className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{kpi.val}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${kpi.gradient} shadow-lg ${kpi.shadow} transition-transform duration-500`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className={`${cardClass} lg:col-span-8 p-8 flex flex-col`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                <BarChart3 className="w-3 h-3 text-blue-500" /> Ausências por Equipe
              </h3>
              <span className="text-[8px] font-black uppercase bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg">Visão por Squad</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.areaData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: isDarkMode ? '#71717a' : '#71717a' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#71717a' }} />
                  <Tooltip 
                    cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '0.75rem', border: 'none', fontWeight: 'black', backgroundColor: isDarkMode ? '#111' : '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {(stats?.areaData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className={`${cardClass} lg:col-span-4 p-8 flex flex-col`}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 mb-6">
              <PieChartIcon className="w-3 h-3 text-purple-500" /> Mix de Solicitações
            </h3>
            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats?.categoryData || []} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value" stroke="none" cornerRadius={6}>
                    {(stats?.categoryData || []).map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '0.75rem', border: 'none', fontWeight: 'black' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black tracking-tighter">{(stats?.approved || 0) + (stats?.pending || 0)}</span>
                <span className="text-[8px] font-black uppercase opacity-30">Total</span>
              </div>
            </div>
            <div className="space-y-2 mt-4 text-xs">
              {stats?.categoryData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-transparent hover:border-white/10 transition-all font-black uppercase tracking-widest text-[9px]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="opacity-60">{item.name}</span>
                  </div>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className={`${cardClass} p-8 md:p-10 flex flex-col`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <ListOrdered className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-xl font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Lista de Time</h2>
                <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Saldo e frequência individual</p>
              </div>
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:text-blue-500 transition-colors" />
              <input 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Filtrar colaborador..." 
                className={`w-full pl-12 h-12 text-sm rounded-lg border transition-all duration-300 outline-none
                  ${isDarkMode 
                    ? 'bg-black/50 border-white/10 text-white focus:border-blue-500/50' 
                    : 'bg-white/50 border-black/10 text-gray-900 focus:border-blue-500/50'}`} 
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`text-[10px] font-black uppercase tracking-[0.2em] border-b ${isDarkMode ? 'border-white/10 text-zinc-500' : 'border-black/10 text-zinc-400'}`}>
                  <th className="px-6 py-4 text-left">Colaborador</th>
                  <th className="px-6 py-4 text-center">Férias</th>
                  <th className="px-6 py-4 text-center">Day-offs</th>
                  <th className="px-6 py-4 text-center">Ausências</th>
                  <th className="px-6 py-4 text-center">Urgências</th>
                  <th className="px-6 py-4 text-right">Perfil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {filteredMembers.map(m => {
                  const vacts = (m.vacations || []).filter((v:any) => v.category === 'vacation' || !v.category).length;
                  const days = (m.vacations || []).filter((v:any) => v.category === 'day-off').length;
                  const ausencias = (m.vacations || []).filter((v:any) => v.category === 'ausencia').length;
                  const urgs = (m.vacations || []).filter((v:any) => v.category === 'urgent').length;
                  return (
                    <tr key={m.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500 flex items-center justify-center overflow-hidden font-black text-sm border border-blue-500/20">
                            {m.avatar ? (
                               <img src={m.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                               m.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className={`font-black uppercase tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{m.name}</p>
                            <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{m.cell || 'Sem Célula'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black border inline-flex items-center gap-2 ${vacts > 0 ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'}`}>
                          <Calendar className="w-3 h-3" /> {vacts}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black border inline-flex items-center gap-2 ${days > 0 ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'}`}>
                          <Sun className="w-3 h-3" /> {days}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black border inline-flex items-center gap-2 ${ausencias > 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'}`}>
                          <AlertCircle className="w-3 h-3" /> {ausencias}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black border inline-flex items-center gap-2 ${urgs > 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'}`}>
                          <AlertCircle className="w-3 h-3" /> {urgs}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 hover:text-white">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128, 128, 128, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(128, 128, 128, 0.4); }
      `}</style>
    </div>
  );
}

export default function GestaoFeriasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase opacity-20 tracking-widest">Iniciando Gestão...</div>}>
      <GestaoFeriasContent />
    </Suspense>
  );
}