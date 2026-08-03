'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { useTheme } from '@/components/theme-provider';
import { User, Briefcase, Mail, MapPin, Hash, ShieldCheck, FileText, CalendarDays, CheckCircle2, Clock, CalendarIcon, Edit2, Check, X, Camera, Code, AlignLeft, Sparkles, Ticket, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Cropper from 'react-easy-crop';

// --- COMPONENTE DE FUNDO ANIMADO (glassmorphism) ---
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
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse transition-colors duration-500
        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '8s' }} 
      />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse transition-colors duration-500
        ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-400'}`} 
        style={{ animationDuration: '12s', animationDelay: '2s' }} 
      />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)' }}>
        <div className="stars-container relative w-full h-full">
          {stars.map((star, i) => (
            <div 
              key={i} 
              className={`absolute w-0.5 h-0.5 rounded-full ${isDarkMode ? 'bg-white' : 'bg-blue-500'}`}
              style={{
                top: star.top,
                left: star.left,
                animation: `float ${star.duration} linear infinite ${star.delay}`,
                opacity: star.opacity,
                transform: `scale(${star.scale})`
              }}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
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

// --- HELPER PARA CORTAR A IMAGEM ---
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg', 0.9);
}

export default function PerfilPage() {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [vacations, setVacations] = useState<any[]>([]);
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Avatar Cropper States
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Estados de Aviso do Sistema
  const [activeNotice, setActiveNotice] = useState<any>(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const API_URL = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8001`
    : '';

  useEffect(() => {
    setMounted(true);
    fetchActiveNotice();
    
    // Recupera os dados do usuário salvos no LocalStorage (vem do Login)
    const storedUser = localStorage.getItem('user_srmt');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserInfo(parsedUser);
        // Busca dados completos do BD (inclui bio e skills que não estão no localStorage)
        fetchFullUserData(parsedUser.id);
        fetchUserVacations(parsedUser.id);
        fetchUserTickets(parsedUser.name);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Busca o aviso do sistema ativo
  const fetchActiveNotice = async () => {
    try {
      const res = await fetch(`${API_URL}/system-notices/active`);
      if (res.ok) {
        const notice = await res.json();
        if (notice && notice.id) {
          const lastSeen = localStorage.getItem('srmt_last_notice');
          if (lastSeen !== notice.updated_at) {
            setActiveNotice(notice);
            setShowNoticeModal(true);
          }
        }
      }
    } catch (e) {
      console.error("Erro ao buscar avisos:", e);
    }
  };

  const handleCloseNotice = () => {
    if (activeNotice) {
      localStorage.setItem('srmt_last_notice', activeNotice.updated_at);
    }
    setShowNoticeModal(false);
  };

  // Busca os dados completos do usuário no BD (bio, skills, etc.)
  const fetchFullUserData = async (userId: number) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserInfo((prev: any) => ({ ...prev, ...data }));
        // Atualiza o localStorage com os dados completos
        const stored = localStorage.getItem('user_srmt');
        if (stored) {
          const merged = { ...JSON.parse(stored), ...data };
          localStorage.setItem('user_srmt', JSON.stringify(merged));
        }
      }
    } catch (e) {
      console.error("Erro ao buscar dados completos do usuário:", e);
    }
  };

  const fetchUserVacations = async (userId: any) => {
    try {
      const res = await fetch(`${API_URL}/vacations?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        const userVacations = data.filter((v: any) => String(v.userId) === String(userId) || String(v.user_id) === String(userId));
        setVacations(userVacations);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTickets = async (userName: string) => {
    try {
      const res = await fetch(`${API_URL}/tickets`);
      if (res.ok) {
        const data = await res.json();
        const filtered = data.filter((t: any) => 
          Array.isArray(t.creators) && t.creators.some((c: any) => c.name?.toLowerCase() === userName.toLowerCase())
        );
        setUserTickets(filtered);
      }
    } catch (e) {
      console.error("Erro ao carregar tickets:", e);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (e) {
      console.error("Erro ao carregar usuários:", e);
    }
  };

  useEffect(() => {
    if (mounted) fetchAllUsers();
  }, [mounted]);

  const isFirstAccess = userInfo && userInfo.first_access === true;

  const handleUserUpdate = async (field: string, newValue: any) => {
    if (isFirstAccess) {
      const updatedUser = { ...userInfo, [field]: newValue };
      setUserInfo(updatedUser);
      localStorage.setItem('user_srmt', JSON.stringify(updatedUser));
      return;
    }

    try {
      const userId = typeof userInfo.id === 'string' ? parseInt(userInfo.id, 10) : userInfo.id;
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newValue })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        alert(`Erro ao atualizar: ${errorData.detail || 'Tente novamente.'}`);
        return;
      }
      
      const updatedUser = { ...userInfo, [field]: newValue };
      setUserInfo(updatedUser);
      localStorage.setItem('user_srmt', JSON.stringify(updatedUser));
    } catch (e) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleFinalizeProfile = async () => {
    if (!userInfo.sidia_id || !userInfo.kp || !userInfo.kp_type) {
      alert("Por favor, preencha Matrícula, KP e KP Type antes de finalizar.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInfo.email,
          display_name: userInfo.name,
          team: userInfo.team || "SVP",
          cell: userInfo.cell,
          kp: userInfo.kp,
          role: userInfo.role || "LDAP",
          sidia_id: userInfo.sidia_id,
          kp_type: userInfo.kp_type,
          is_backup: userInfo.is_backup || false,
          is_specialist: userInfo.is_specialist || 0,
          avatar: userInfo.avatar || null
        })
      });

      const data = await response.json();
      if (response.ok) {
        if (data.user) {
          localStorage.setItem('user_srmt', JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            role: data.user.role,
            team: data.user.team,
            kp: data.user.kp,
            kp_type: data.user.kp_type,
            is_backup: Boolean(data.user.is_backup),
            email: data.user.email,
            sidia_id: data.user.sidia_id || data.user.department,
            avatar: data.user.avatar,
            first_access: false
          }));
          setUserInfo({ ...data.user, first_access: false });
        }
        alert("Perfil finalizado com sucesso!");
        window.location.reload(); 
      } else {
        alert(data.detail || "Erro ao finalizar perfil.");
      }
    } catch (error) {
      alert("Erro de rede ao finalizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setAvatarLoading(true);
    try {
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      const userId = typeof userInfo.id === 'string' ? parseInt(userInfo.id, 10) : userInfo.id;
      
      const res = await fetch(`${API_URL}/users/${userId}/avatar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: croppedImageBase64 })
      });
      
      if (res.ok) {
        const updatedUser = { ...userInfo, avatar: croppedImageBase64 };
        setUserInfo(updatedUser);
        localStorage.setItem('user_srmt', JSON.stringify(updatedUser));
        setIsCropModalOpen(false);
      } else {
        alert("Erro ao salvar o avatar.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro no processamento da imagem.");
    } finally {
      setAvatarLoading(false);
      setImageSrc(null);
    }
  };

  if (!mounted) return null;

  // Calculando estatísticas de férias
  const pendingVacations = vacations.filter(v => {
    const status = v.status?.toLowerCase();
    return status === 'pendente' || status === 'pending';
  }).length;
  const approvedVacations = vacations.filter(v => {
    const status = v.status?.toLowerCase();
    return status === 'aprovado' || status === 'approved' || status === 'fluig_approved' || status === 'downloaded';
  }).length;
  const rejectedVacations = vacations.filter(v => {
    const status = v.status?.toLowerCase();
    return status === 'rejeitado' || status === 'rejected';
  }).length;

  // Calculando estatísticas de tickets
  const totalTickets = userTickets.length;
  const pendingTickets = userTickets.filter(t => t.status?.toLowerCase() === 'pendente').length;
  const acceptedTickets = userTickets.filter(t => t.status?.toLowerCase() === 'aceito').length;
  const rejectedTickets = userTickets.filter(t => t.status?.toLowerCase() === 'rejeitado').length;
  const completedTickets = userTickets.filter(t => t.status?.toLowerCase() === 'concluido').length;

  // Calculando gamificação
  const skillsCount = userInfo?.skills ? userInfo.skills.split(',').map((s: string) => s.trim()).filter(Boolean).length : 0;
  const currentXP = (completedTickets * 200) + (acceptedTickets * 100) + (skillsCount * 75);

  const getLevelInfo = (xp: number) => {
    if (xp < 400) {
      return { 
        level: 1, 
        title: 'Iniciante', 
        minXp: 0, 
        maxXp: 400, 
        nextLevelTitle: 'Solucionador Aprendiz'
      };
    } else if (xp < 900) {
      return { 
        level: 2, 
        title: 'Solucionador Aprendiz', 
        minXp: 400, 
        maxXp: 900, 
        nextLevelTitle: 'Analista de Elite'
      };
    } else if (xp < 1600) {
      return { 
        level: 3, 
        title: 'Analista de Elite', 
        minXp: 900, 
        maxXp: 1600, 
        nextLevelTitle: 'Mestre da Resolução'
      };
    } else if (xp < 2500) {
      return { 
        level: 4, 
        title: 'Mestre da Resolução', 
        minXp: 1600, 
        maxXp: 2500, 
        nextLevelTitle: 'Lenda do Suporte'
      };
    } else {
      return { 
        level: 5, 
        title: 'Lenda do Suporte', 
        minXp: 2500, 
        maxXp: 2500, 
        nextLevelTitle: 'Nível Máximo'
      };
    }
  };

  const levelInfo = getLevelInfo(currentXP);
  const xpProgress = levelInfo.level === 5 ? 100 : Math.min(100, Math.max(0, ((currentXP - levelInfo.minXp) / (levelInfo.maxXp - levelInfo.minXp)) * 100));

  const badgesList = [
    { level: 1, name: 'Iniciante dos Tickets', emoji: '🎫', desc: 'Destravado no Nível 1 (0 XP)', colorClass: 'from-amber-700 to-amber-900', shadowClass: 'shadow-amber-500/20 border-amber-500/30' },
    { level: 2, name: 'Mestre das Ferramentas', emoji: '🛠️', desc: 'Destravado no Nível 2 (400 XP)', colorClass: 'from-purple-500 to-indigo-700', shadowClass: 'shadow-purple-500/20 border-purple-500/30' },
    { level: 3, name: 'Especialista Ágil', emoji: '⚡', desc: 'Destravado no Nível 3 (900 XP)', colorClass: 'from-amber-400 to-orange-600', shadowClass: 'shadow-orange-500/20 border-orange-500/30' },
    { level: 4, name: 'Guardião da Estabilidade', emoji: '🔮', desc: 'Destravado no Nível 4 (1600 XP)', colorClass: 'from-indigo-500 to-purple-600', shadowClass: 'shadow-indigo-500/20 border-indigo-500/30' },
    { level: 5, name: 'Lenda Suprema', emoji: '👑', desc: 'Destravado no Nível 5 (2500+ XP)', colorClass: 'from-emerald-400 to-teal-600', shadowClass: 'shadow-emerald-500/20 border-emerald-500/30' }
  ];

  const skillsBadgesList = [
    { count: 1, name: 'Mente Curiosa', emoji: '💡', desc: 'Cadastrou 1+ habilidade', colorClass: 'from-blue-500 to-cyan-600', shadowClass: 'shadow-blue-500/20 border-blue-500/30' },
    { count: 3, name: 'Especialista Versátil', emoji: '📚', desc: 'Cadastrou 3+ habilidades', colorClass: 'from-fuchsia-500 to-pink-600', shadowClass: 'shadow-fuchsia-500/20 border-fuchsia-500/30' },
    { count: 5, name: 'Polímata do SRMT', emoji: '🧠', desc: 'Cadastrou 5+ habilidades', colorClass: 'from-amber-500 to-orange-600', shadowClass: 'shadow-orange-500/20 border-orange-500/30' },
    { count: 8, name: 'Mestre do Conhecimento', emoji: '👑', desc: 'Cadastrou 8+ habilidades', colorClass: 'from-emerald-400 to-teal-600', shadowClass: 'shadow-emerald-500/20 border-emerald-500/30' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 pt-24">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : !userInfo ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">Usuário não encontrado</h2>
            <p className="opacity-60 mt-2">Por favor, faça login novamente.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* First Access Banner */}
            {isFirstAccess && (
              <div className={`p-6 rounded-[2rem] border-2 border-dashed flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse
                ${isDarkMode ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Perfil Pendente</h3>
                    <p className="text-xs opacity-80 uppercase tracking-widest font-black">Complete seus dados e clique em finalizar para ativar sua conta.</p>
                  </div>
                </div>
                <button 
                  onClick={handleFinalizeProfile}
                  disabled={loading}
                  className="px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all flex items-center gap-3"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Finalizar Cadastro
                </button>
              </div>
            )}

            {/* Header (Hero) Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar Gigante */}
              <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                <div className="absolute inset-[-10px] bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] flex items-center justify-center overflow-hidden font-black text-white text-5xl md:text-6xl bg-gradient-to-br from-blue-600 to-indigo-800 shadow-2xl shadow-blue-900/20 transform transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3`}>
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    userInfo.name?.charAt(0).toUpperCase()
                  )}
                  {avatarLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Camera className="w-8 h-8 text-white opacity-80" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Alterar</span>
                  </div>
                </div>
                <input 
                  id="avatar-upload"
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </div>
              
              {/* Nome e Cargo (Read-Only) */}
              <div className="flex-1 text-center md:text-left space-y-4 pt-2 md:pt-6">
                <div>
                  <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {userInfo.name?.split(' ').map((n: string) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase ${isDarkMode ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                      <Briefcase className="w-3.5 h-3.5" />
                      {userInfo.role}
                    </span>
                    {userInfo.is_specialist === 1 && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase ${isDarkMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                        Especialista
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black tracking-wide uppercase shadow-[0_0_15px_rgba(99,102,241,0.15)] animate-pulse ${isDarkMode ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border border-indigo-500/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                      Nível {levelInfo.level} • {levelInfo.title}
                    </span>
                  </div>
                </div>
                <p className={`max-w-2xl text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Bem-vindo ao seu perfil. Aqui você pode visualizar suas informações de sistema, dados da equipe e um resumo de suas solicitações de ausência ou férias. Suas credenciais e cargo são gerenciados pelos administradores do sistema.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-12">
              
              {/* Bio / Mini Currículo */}
              <Card className={`p-8 rounded-[2rem] border backdrop-blur-2xl transition-all duration-500 flex flex-col
                ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-fuchsia-100 text-fuchsia-600'}`}>
                    <AlignLeft className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Bio / Mini Currículo</h2>
                </div>
                <div className="flex-1">
                  <BioSection value={userInfo.bio} onSave={(val: any) => handleUserUpdate('bio', val)} isDarkMode={isDarkMode} />
                </div>
              </Card>

              {/* Habilidades */}
              <Card className={`p-8 rounded-[2rem] border backdrop-blur-2xl transition-all duration-500 flex flex-col
                ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                    <Code className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Habilidades</h2>
                </div>
                <div className="flex-1">
                  <SkillsSection value={userInfo.skills} onSave={(val: any) => handleUserUpdate('skills', val)} isDarkMode={isDarkMode} />
                </div>
              </Card>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              
              {/* Informações do Sistema */}
              <Card className={`p-8 rounded-[2rem] border backdrop-blur-2xl transition-all duration-500 
                ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`}>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Informações do Sistema</h2>
                </div>
                
                <div className="space-y-6">
                  <InfoRow icon={User} label="Nome" value={userInfo.name} isDarkMode={isDarkMode} />
                  <EditableRow 
                    icon={Briefcase} 
                    label="Cargo" 
                    value={userInfo.role} 
                    isDarkMode={isDarkMode} 
                    type="select"
                    options={[
                      { value: 'Tester I', label: 'Tester I' },
                      { value: 'Tester II', label: 'Tester II' },
                      { value: 'Tester III', label: 'Tester III' },
                      { value: 'Tester IV', label: 'Tester IV' },
                      { value: 'Especialista I', label: 'Especialista I' },
                      { value: 'Especialista II', label: 'Especialista II' },
                      { value: 'Especialista III', label: 'Especialista III' },
                      { value: 'Coordenador', label: 'Coordenador' },
                      { value: 'Gerente Tec.', label: 'Gerente Tec.' },
                      { value: 'Gerente Tec. Sr.', label: 'Gerente Tec. Sr.' }
                    ]}
                    onSave={(val: any) => handleUserUpdate('role', val)} 
                  />
                  <InfoRow icon={Hash} label="ID do Sistema" value={`#${userInfo.id}`} isDarkMode={isDarkMode} />
                  <EditableRow icon={Mail} label="E-mail" value={userInfo.email} isDarkMode={isDarkMode} onSave={(val: any) => handleUserUpdate('email', val)} />
                  <EditableRow icon={Hash} label="Matrícula SIDIA" value={userInfo.sidia_id || ''} isDarkMode={isDarkMode} onSave={(val: any) => handleUserUpdate('sidia_id', val)} />
                  <EditableRow icon={MapPin} label="Célula" value={userInfo.cell || ''} isDarkMode={isDarkMode} onSave={(val: any) => handleUserUpdate('cell', val)} />
                  <EditableRow icon={User} label="Equipe" value={userInfo.team || ''} isDarkMode={isDarkMode} onSave={(val: any) => handleUserUpdate('team', val)} />
                  <EditableRow 
                    icon={FileText} 
                    label="KP" 
                    value={userInfo.kp} 
                    isDarkMode={isDarkMode} 
                    type="searchable-select"
                    options={allUsers.map((u) => ({ value: u.name, label: u.name }))}
                    onSave={(val: any) => handleUserUpdate('kp', val)} 
                  />
                  <EditableRow 
                    icon={ShieldCheck} 
                    label="KP Type" 
                    value={userInfo.kp_type} 
                    isDarkMode={isDarkMode} 
                    type="select" 
                    options={[
                      { value: 'projeto', label: 'Projeto' },
                      { value: 'especialista', label: 'Especialista' }
                    ]}
                    onSave={(val: any) => handleUserUpdate('kp_type', val)} 
                  />
                  <EditableRow 
                    icon={ShieldCheck} 
                    label="É Backup?" 
                    value={userInfo.is_backup ? "true" : "false"} 
                    isDarkMode={isDarkMode} 
                    type="select"
                    options={[
                      { value: 'true', label: 'Sim' },
                      { value: 'false', label: 'Não' }
                    ]}
                    onSave={(val: any) => handleUserUpdate('is_backup', val === 'true')} 
                  />
                  <EditableRow 
                    icon={Briefcase} 
                    label="É Especialista?" 
                    value={userInfo.is_specialist ? "true" : "false"} 
                    isDarkMode={isDarkMode} 
                    type="select"
                    options={[
                      { value: 'true', label: 'Sim' },
                      { value: 'false', label: 'Não' }
                    ]}
                    onSave={(val: any) => handleUserUpdate('is_specialist', val === 'true')} 
                  />
                </div>
              </Card>

              {/* Coluna da Direita: Resumos de Ausências e de Tickets */}
              <div className="space-y-6 flex flex-col">
                
                {/* Card de Nível & Conquistas */}
                <Card className={`p-8 rounded-[2rem] border backdrop-blur-2xl transition-all duration-500
                  ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`}>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                        <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">Nível & Conquistas</h2>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Jornada de Resoluções</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider ${isDarkMode ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                        {levelInfo.level === 5 ? 'Lenda Suprema 👑' : levelInfo.title}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso XP */}
                  <div className="space-y-2 mb-8">
                    <div className="flex justify-between items-end text-xs">
                      <span className={`font-bold ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Progresso XP</span>
                      <span className="font-black">
                        {levelInfo.level === 5 ? `${currentXP} XP (Nível Máximo)` : `${currentXP} / ${levelInfo.maxXp} XP`}
                      </span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden relative ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out" 
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                    {levelInfo.level < 5 && (
                      <p className={`text-[10px] italic opacity-60 text-right ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                        Faltam {levelInfo.maxXp - currentXP} XP para o próximo nível ({levelInfo.nextLevelTitle})
                      </p>
                    )}
                  </div>

                  {/* Vitrine de Conquistas */}
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Resolução de Tickets</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {badgesList.map((badge) => {
                          const isUnlocked = levelInfo.level >= badge.level;
                          return (
                            <div 
                              key={badge.level} 
                              className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 relative group/badge overflow-hidden
                                ${isUnlocked 
                                  ? (isDarkMode ? 'bg-white/[0.02] border-white/5 shadow-md shadow-black/20 hover:scale-[1.02] hover:bg-white/[0.05] cursor-default' : 'bg-white border-slate-100 shadow-sm hover:scale-[1.02] hover:border-indigo-100 cursor-default')
                                  : (isDarkMode ? 'bg-black/20 border-white/[0.02] opacity-35 filter grayscale' : 'bg-slate-50 border-slate-100 opacity-40 filter grayscale')
                                }`}
                            >
                              {/* Efeito Glow para Desbloqueados */}
                              {isUnlocked && (
                                <div className={`absolute -right-4 -top-4 w-12 h-12 rounded-full blur-xl bg-gradient-to-br ${badge.colorClass} opacity-20 group-hover/badge:opacity-40 transition-opacity`} />
                              )}
                              
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl relative shrink-0 shadow-inner
                                ${isUnlocked 
                                  ? `bg-gradient-to-br ${badge.colorClass} text-white shadow-lg` 
                                  : 'bg-zinc-700 text-zinc-500 border border-zinc-600'
                                }`}
                              >
                                {badge.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-black tracking-tight ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                                    {badge.name}
                                  </span>
                                  {isUnlocked ? (
                                    <span className="text-[8px] font-black uppercase text-indigo-500 dark:text-indigo-400 tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">Ativo</span>
                                  ) : (
                                    <span className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest flex items-center gap-1"><span className="text-[10px]">🔒</span> Bloqueado</span>
                                  )}
                                </div>
                                <p className={`text-[10px] truncate ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                                  {isUnlocked ? 'Conquistado!' : badge.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Conhecimento & Competências</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {skillsBadgesList.map((badge, idx) => {
                          const isUnlocked = skillsCount >= badge.count;
                          return (
                            <div 
                              key={idx} 
                              className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 relative group/badge overflow-hidden
                                ${isUnlocked 
                                  ? (isDarkMode ? 'bg-white/[0.02] border-white/5 shadow-md shadow-black/20 hover:scale-[1.02] hover:bg-white/[0.05] cursor-default' : 'bg-white border-slate-100 shadow-sm hover:scale-[1.02] hover:border-indigo-100 cursor-default')
                                  : (isDarkMode ? 'bg-black/20 border-white/[0.02] opacity-35 filter grayscale' : 'bg-slate-50 border-slate-100 opacity-40 filter grayscale')
                                }`}
                            >
                              {/* Efeito Glow para Desbloqueados */}
                              {isUnlocked && (
                                <div className={`absolute -right-4 -top-4 w-12 h-12 rounded-full blur-xl bg-gradient-to-br ${badge.colorClass} opacity-20 group-hover/badge:opacity-40 transition-opacity`} />
                              )}
                              
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl relative shrink-0 shadow-inner
                                ${isUnlocked 
                                  ? `bg-gradient-to-br ${badge.colorClass} text-white shadow-lg` 
                                  : 'bg-zinc-700 text-zinc-500 border border-zinc-600'
                                }`}
                              >
                                {badge.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-black tracking-tight ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                                    {badge.name}
                                  </span>
                                  {isUnlocked ? (
                                    <span className="text-[8px] font-black uppercase text-indigo-500 dark:text-indigo-400 tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">Ativo</span>
                                  ) : (
                                    <span className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest flex items-center gap-1"><span className="text-[10px]">🔒</span> Bloqueado</span>
                                  )}
                                </div>
                                <p className={`text-[10px] truncate ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                                  {isUnlocked ? 'Conquistado!' : badge.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </Card>

                {/* Resumo de Ausências */}
                <Card className={`p-8 rounded-[2rem] border backdrop-blur-2xl transition-all duration-500 flex-1
                  ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`}>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                      <CalendarDays className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Resumo de Ausências</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <StatCard label="Aprovadas" value={approvedVacations} icon={CheckCircle2} colorClass="text-green-500" bgClass={isDarkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} isDarkMode={isDarkMode} />
                    <StatCard label="Pendentes" value={pendingVacations} icon={Clock} colorClass="text-blue-500" bgClass={isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} isDarkMode={isDarkMode} />
                  </div>

                  <div className="mt-4">
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Últimos Registros</h3>
                    <div className="space-y-3">
                      {vacations.length > 0 ? (
                        vacations.slice(0, 3).map((v, i) => (
                          <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                              <CalendarIcon className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-slate-400'}`} />
                              <div className="flex flex-col">
                                <span className="text-xs font-bold">{v.category || 'Férias'}</span>
                                <span className="text-[10px] opacity-60">{v.start} até {v.end}</span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                              (v.status?.toLowerCase() === 'aprovado' || v.status?.toLowerCase() === 'approved' || v.status?.toLowerCase() === 'fluig_approved' || v.status?.toLowerCase() === 'downloaded') ? 'bg-green-500/20 text-green-500' : 
                              (v.status?.toLowerCase() === 'rejeitado' || v.status?.toLowerCase() === 'rejected') ? 'bg-red-500/20 text-red-500' : 
                              'bg-orange-500/20 text-orange-500'
                            }`}>
                              {v.status?.toLowerCase() === 'approved' || v.status?.toLowerCase() === 'fluig_approved' || v.status?.toLowerCase() === 'downloaded' ? 'aprovado' :
                               v.status?.toLowerCase() === 'pending' ? 'pendente' :
                               v.status?.toLowerCase() === 'rejected' ? 'rejeitado' :
                               v.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Nenhum registro de ausência encontrado.</p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Resumo de Tickets */}
                <Card className={`p-8 rounded-[2rem] border backdrop-blur-2xl transition-all duration-500 flex-1
                  ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10' : 'bg-white/60 border-slate-200 shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`}>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                        <Ticket className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-bold tracking-tight">Resumo de Tickets</h2>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${isDarkMode ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                      Total: {totalTickets}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <StatCard label="Aceitos" value={acceptedTickets} icon={CheckCircle2} colorClass="text-emerald-500" bgClass={isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'} isDarkMode={isDarkMode} />
                    <StatCard label="Pendentes" value={pendingTickets} icon={Clock} colorClass="text-orange-500" bgClass={isDarkMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200'} isDarkMode={isDarkMode} />
                    <StatCard label="Rejeitados" value={rejectedTickets} icon={X} colorClass="text-red-500" bgClass={isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} isDarkMode={isDarkMode} />
                    <StatCard label="Concluídos" value={completedTickets} icon={CheckCircle2} colorClass="text-blue-500" bgClass={isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} isDarkMode={isDarkMode} />
                  </div>

                  <div className="mt-4">
                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Últimos Registros</h3>
                    <div className="space-y-3">
                      {userTickets.length > 0 ? (
                        userTickets.slice(0, 3).map((t, i) => (
                          <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center gap-3 overflow-hidden mr-2">
                              <FileText className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-slate-400'}`} />
                              <div className="flex flex-col overflow-hidden">
                                <span className="text-xs font-bold truncate">{t.title}</span>
                                <span className="text-[10px] opacity-60">
                                  {t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Sem data'}
                                </span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md flex-shrink-0 ${
                              t.status?.toLowerCase() === 'aceito' ? 'bg-emerald-500/20 text-emerald-500' : 
                              t.status?.toLowerCase() === 'rejeitado' ? 'bg-red-500/20 text-red-500' : 
                              t.status?.toLowerCase() === 'concluido' ? 'bg-blue-500/20 text-blue-500' : 
                              'bg-orange-500/20 text-orange-500'
                            }`}>
                              {t.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Nenhum ticket encontrado.</p>
                      )}
                    </div>
                  </div>
                </Card>

              </div>

            </div>
          </div>
        )}
      </main>

      {/* Modal de Crop */}
      {isCropModalOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xl font-bold mb-4">Ajustar Foto</h3>
            
            <div className="relative w-full h-64 bg-black/10 rounded-xl overflow-hidden mb-6">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect"
                showGrid={false}
              />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold opacity-60">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setIsCropModalOpen(false); setImageSrc(null); }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                Cancelar
              </button>
              <button 
                onClick={handleCropSave}
                disabled={avatarLoading}
                className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {avatarLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Salvar Foto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Aviso do Sistema */}
      {showNoticeModal && activeNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className={`w-full max-w-lg p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
            <button onClick={handleCloseNotice} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-inner">
                <AlertCircle size={32} className="animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 opacity-80 mb-1">Aviso Importante</p>
                <h3 className={`text-2xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeNotice.title}</h3>
              </div>
            </div>
            <div className={`p-6 rounded-2xl mb-8 border ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
              <p className="whitespace-pre-wrap font-medium leading-relaxed">{activeNotice.description}</p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleCloseNotice}
                className="px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Ciente
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function InfoRow({ icon: Icon, label, value, isDarkMode }: any) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-slate-100 text-slate-500'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>{label}</p>
        <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>{value}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, colorClass, bgClass, isDarkMode }: any) {
  return (
    <div className={`p-4 rounded-2xl border flex flex-col gap-2 ${bgClass}`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        <span className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>{label}</span>
      </div>
      <span className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</span>
    </div>
  );
}

function EditableRow({ icon: Icon, label, value, isDarkMode, onSave, type = "text", options }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    await onSave(editValue);
    setLoading(false);
    setIsEditing(false);
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
      <div className="flex items-center gap-4 flex-1">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-slate-100 text-slate-500'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>{label}</p>
          {isEditing ? (
            type === "select" ? (
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className={`text-sm font-semibold rounded outline-none border px-2 py-0.5 w-full max-w-xs ${isDarkMode ? 'bg-[#111] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                autoFocus
              >
                <option value="">Selecione...</option>
                {options?.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : type === "searchable-select" ? (
              <>
                <input
                  list={`datalist-${label.replace(/\s+/g, '')}`}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className={`text-sm font-semibold rounded outline-none border px-2 py-0.5 w-full max-w-xs ${isDarkMode ? 'bg-[#111] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  autoFocus
                  placeholder="Pesquisar..."
                />
                <datalist id={`datalist-${label.replace(/\s+/g, '')}`}>
                  {options?.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </datalist>
              </>
            ) : (
              <input 
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className={`text-sm font-semibold rounded outline-none border px-2 py-0.5 w-full max-w-xs ${isDarkMode ? 'bg-[#111] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                autoFocus
              />
            )
          ) : (
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>{value || '-'}</p>
          )}
        </div>
      </div>
      <div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={loading} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-green-400' : 'hover:bg-slate-200 text-green-600'}`}>
              {loading ? <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button onClick={() => { setIsEditing(false); setEditValue(value); }} disabled={loading} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-red-400' : 'hover:bg-slate-200 text-red-600'}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className={`p-1.5 rounded-lg opacity-50 hover:opacity-100 transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}>
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function BioSection({ value, onSave, isDarkMode }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setEditValue(value || ''); }, [value]);

  const handleSave = async () => {
    if (editValue === value) { setIsEditing(false); return; }
    setLoading(true);
    await onSave(editValue);
    setLoading(false);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`w-full min-h-[120px] p-4 text-sm font-medium rounded-xl outline-none border focus:ring-2 focus:ring-blue-500 transition-all resize-none
              ${isDarkMode ? 'bg-[#111] border-white/10 text-gray-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
            placeholder="Escreva um pouco sobre você..."
            autoFocus
          />
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => { setIsEditing(false); setEditValue(value || ''); }} disabled={loading} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
              Cancelar
            </button>
            <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-sm font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Salvar'}
            </button>
          </div>
        </div>
      ) : (
        <div className="group relative">
          <div className={`w-full min-h-[120px] p-4 text-sm font-medium rounded-xl border border-transparent whitespace-pre-wrap
            ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-slate-50 text-slate-700'}`}>
            {value ? value : <span className="opacity-50 italic">Nenhuma bio informada. Adicione um mini currículo aqui.</span>}
          </div>
          <button onClick={() => setIsEditing(true)} className={`absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all
            ${isDarkMode ? 'bg-[#222] hover:bg-[#333] text-gray-400 hover:text-white' : 'bg-white hover:bg-slate-100 text-slate-500 hover:text-blue-600 shadow-sm'}`}>
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function SkillsSection({ value, onSave, isDarkMode }: any) {
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  
  const skills = value ? value.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

  const handleAdd = async (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;
    
    setLoading(true);
    const updatedSkills = [...skills, newSkill.trim()].join(',');
    await onSave(updatedSkills);
    setNewSkill('');
    setLoading(false);
  };

  const handleRemove = async (skillToRemove: string) => {
    setLoading(true);
    const updatedSkills = skills.filter((s: string) => s !== skillToRemove).join(',');
    await onSave(updatedSkills);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleAdd}
          placeholder="Ex: React, Python, QA..."
          className={`flex-1 text-sm font-semibold rounded-xl outline-none border px-4 py-2.5 transition-colors
            ${isDarkMode ? 'bg-[#111] border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'}`}
          disabled={loading}
        />
        <button 
          onClick={handleAdd} 
          disabled={!newSkill.trim() || loading}
          className="px-4 py-2.5 text-sm font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Adicionar
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {skills.map((skill: string, idx: number) => (
          <span 
            key={idx}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}
          >
            {skill}
            <button 
              onClick={() => handleRemove(skill)}
              disabled={loading}
              className={`p-0.5 rounded-md hover:bg-black/10 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {skills.length === 0 && !loading && (
          <p className={`text-sm italic opacity-50 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Nenhuma habilidade adicionada ainda.</p>
        )}
      </div>
    </div>
  );
}