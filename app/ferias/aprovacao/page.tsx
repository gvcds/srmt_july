'use client';

import React, { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Inbox,
  ArrowRight,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Ticket as TicketIcon,
  BarChart3,
  CalendarRange,
  X,
  User as UserIcon,
  Trash2,
  ListOrdered,
  Download
} from 'lucide-react';
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

function AprovaFeriasContent() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });
  const [isAuthorized, setIsAuthorized] = useState(false);

  const API_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8001` : '';

  useEffect(() => {
    const userStr = localStorage.getItem('user_srmt');
    if (userStr) {
      const user = JSON.parse(userStr);
      const name = (user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      
      if (name.includes('wallid') || name.includes('ivan') || email.includes('wallid') || email.includes('ivan')|| name.includes('gilmar') || email.includes('gilmar')) {
        setIsAuthorized(true);
      } else {
        router.push('/ferias');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchRequests = useCallback(async () => {
    if (!isAuthorized) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/vacations`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {} finally {
      setIsLoading(false);
    }
  }, [API_URL, isAuthorized]);

  useEffect(() => { 
    if (isAuthorized) {
      fetchRequests(); 
    }
  }, [fetchRequests, isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-black uppercase opacity-20 tracking-widest ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f5f5f7] text-black'}`}>
        Acesso Restrito
      </div>
    );
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja apagar esta solicitação?")) return;
    try {
      const res = await fetch(`${API_URL}/vacations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast({ message: "Solicitação removida com sucesso!", type: 'success', visible: true });
        fetchRequests();
      }
    } catch (e) {
      setToast({ message: 'Erro ao remover.', type: 'error', visible: true });
    }
  };

  const handleAction = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/vacations/${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const msg = status === 'rejected' ? 'Solicitação rejeitada e apagada!' : `Status atualizado para ${status.toUpperCase()}!`;
        setToast({ message: msg, type: 'success', visible: true });
        fetchRequests();
      }
    } catch (e) {
      setToast({ message: 'Erro ao processar ação.', type: 'error', visible: true });
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'conflict': return { label: 'Conflito', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
      case 'pending': return { label: 'Agendado', color: 'bg-yellow-400/10 text-yellow-600 border-yellow-400/20' };
      case 'approved': return { label: 'Confirmado', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
      case 'fluig_approved': return { label: 'Fluig Aprovado', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
      case 'downloaded': return { label: 'Download Confirmado', color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' };
      default: return { label: s, color: 'bg-zinc-500/10 text-zinc-500' };
    }
  };

  const mainBgClass = isDarkMode ? "bg-[#050505] text-gray-300" : "bg-[#f5f5f7] text-gray-800";
  const cardClass = `relative overflow-hidden rounded-xl border transition-all duration-500 backdrop-blur-2xl ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`;

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-10 lg:p-12 transition-colors duration-1000 ${mainBgClass} overflow-x-hidden pb-20`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />
      <CustomToast {...toast} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} isDarkMode={isDarkMode} />

      <div className="w-full max-w-5xl relative z-10 space-y-12">
        <header className="flex flex-col items-center gap-6 pb-10 text-center">
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-4 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
              <ShieldAlert className="w-3 h-3" /> Painel de Auditoria
            </div>
            <h1 className={`text-4xl md:text-6xl font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Central de <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Aprovações</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto opacity-60 font-medium leading-tight">Revise e autorize as solicitações de ausência do time.</p>
          </div>

          <div className={`flex p-1.5 rounded-lg border backdrop-blur-3xl shadow-2xl ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-black/5'}`}>
            <Link href="/ferias" className="px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider opacity-40 hover:opacity-100 transition-all">Solicitar</Link>
            <Link href="/ferias/gestao" className="px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider opacity-40 hover:opacity-100 transition-all">Gestão</Link>
            <div className={`w-px h-6 my-auto mx-2 ${isDarkMode ? 'bg-white/20' : 'bg-black/10'}`} />
            <div className={`px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider bg-orange-600 text-white shadow-xl`}>Aprovações</div>
          </div>
        </header>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center opacity-30 gap-4"><RefreshCw className="w-10 h-10 animate-spin" /><p className="font-black uppercase tracking-widest text-[10px]">Carregando Auditoria...</p></div>
        ) : requests.length === 0 ? (
          <Card className={`${cardClass} p-20 flex flex-col items-center justify-center text-center opacity-40 border-none shadow-none grayscale`}><Inbox className="w-20 h-24 mb-6 opacity-20" /><h3 className="text-xl font-black uppercase tracking-widest">Tudo em dia</h3><p className="text-sm font-medium">Nenhuma solicitação pendente no momento.</p></Card>
        ) : (
          <div className="space-y-6">
            {requests.map((r: any) => {
              const status = getStatusLabel(r.status);
              return (
                <Card key={r.id} className={`${cardClass} p-8 md:p-10 border-none shadow-2xl transition-all duration-500 flex flex-col md:flex-row items-center gap-10`}>
                  <div className="flex-grow flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden font-black text-white text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg border border-blue-500/20 shadow-blue-500/10 shrink-0">
                      {r.userAvatar ? (
                        <img src={r.userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        r.userName?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <h3 className="text-2xl font-black tracking-tight">{r.userName}</h3>
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${status.color}`}>{status.label}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="px-3 py-1 rounded-lg bg-black/10 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest opacity-60">Projeto: {r.kp || 'N/A'}</span>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${r.category === 'day-off' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : r.category === 'ausencia' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : r.category === 'urgent' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                          {r.category === 'day-off' ? 'Day Off / BH' : r.category === 'ausencia' ? 'Ausência' : r.category === 'urgent' ? 'Urgência' : 'Férias'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-2 px-8 border-x border-black/5 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase opacity-30 tracking-widest">Período Solicitado</p>
                    <div className="flex items-center gap-3 font-black text-lg tracking-tighter">
                      {new Date(`${r.start}T00:00:00`).toLocaleDateString('pt-BR')} <ArrowRight className="w-4 h-4 opacity-20" /> {new Date(`${r.end}T00:00:00`).toLocaleDateString('pt-BR')}
                    </div>
                    <span className="text-blue-500 font-black text-sm uppercase tracking-tighter">{Math.floor((new Date(r.end).getTime() - new Date(r.start).getTime()) / 86400000) + 1} dias totais</span>
                  </div>

                  <div className="flex gap-4">
                    {/* Botão EXCLUIR (Manual) */}
                    <button onClick={() => handleDelete(r.id)} className="w-14 h-14 rounded-xl flex items-center justify-center bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 hover:bg-zinc-500 hover:text-white transition-all shadow-lg active:scale-95" title="Apagar Registro"><Trash2 className="w-6 h-6" /></button>

                    {/* Botão REJEITAR (Sempre visível enquanto não rejeitado) */}
                    <button onClick={() => handleAction(r.id, 'rejected')} className="w-14 h-14 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95" title="Rejeitar"><XCircle className="w-6 h-6" /></button>
                    
                    {/* Botão CONFIRMAR (Se for Dayoff, Pendente ou Conflito) */}
                    {(r.status === 'pending' || r.status === 'conflict') && (
                      <button onClick={() => handleAction(r.id, 'approved')} className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95 shadow-emerald-500/20" title="Confirmar (Fica Verde)"><CheckCircle2 className="w-6 h-6" /></button>
                    )}

                    {/* Botão FLUIG (Se já estiver Confirmado) */}
                    {r.status === 'approved' && r.category !== 'day-off' && r.category !== 'ausencia' && (
                      <button onClick={() => handleAction(r.id, 'fluig_approved')} className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95 shadow-blue-500/20" title="Aprovar Fluig (Fica Azul)"><RefreshCw className="w-6 h-6" /></button>
                    )}

                    {/* Botão DOWNLOAD (Se já estiver no Fluig) */}
                    {r.status === 'fluig_approved' && (
                      <button onClick={() => handleAction(r.id, 'downloaded')} className="w-14 h-14 rounded-xl flex items-center justify-center bg-pink-500/10 text-pink-500 border border-pink-500/20 hover:bg-pink-500 hover:text-white transition-all shadow-lg active:scale-95 shadow-pink-500/20" title="Confirmar Download (Fica Rosa)"><Download className="w-6 h-6" /></button>
                    )}

                    {/* Feedback para Download concluído */}
                    {r.status === 'downloaded' && (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-pink-500 text-white shadow-lg shadow-pink-500/20 border border-pink-400"><CheckCircle2 className="w-6 h-6" /></div>
                    )}

                    {/* Feedback para Dayoff já confirmado */}
                    {r.status === 'approved' && r.category === 'day-off' && (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-purple-500 text-white shadow-lg shadow-purple-500/20 border border-purple-400"><CheckCircle2 className="w-6 h-6" /></div>
                    )}

                    {/* Feedback para Ausência já confirmada */}
                    {r.status === 'approved' && r.category === 'ausencia' && (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-rose-500 text-white shadow-lg shadow-rose-500/20 border border-rose-400"><CheckCircle2 className="w-6 h-6" /></div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AprovaFeriasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase opacity-20 tracking-widest">Iniciando Auditoria...</div>}>
      <AprovaFeriasContent />
    </Suspense>
  );
}