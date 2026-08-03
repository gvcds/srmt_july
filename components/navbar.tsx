'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sun, Moon, Bell, ChevronDown, Check, X, Clock, MessageSquare, Briefcase, Ticket as TicketIcon, Sparkles, Globe, User, Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/components/theme-provider';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: number;
  created_at: string;
}


export function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [pathname, setPathname] = useState('/');
  // Estado para armazenar dados do usuário
  const [userInfo, setUserInfo] = useState<any>({ name: 'Visitante', role: 'Convidado', id: null, avatar: null, email: '' });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lang, setLang] = useState<'pt' | 'en' | 'ko'>('pt');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('srmt_lang') as 'pt' | 'en' | 'ko';
    if (savedLang) setLang(savedLang);
  }, []);

  const changeLanguage = (newLang: 'pt' | 'en' | 'ko') => {
    setLang(newLang);
    localStorage.setItem('srmt_lang', newLang);
    window.dispatchEvent(new Event('storage'));
    setIsLangMenuOpen(false);
  };

  const API_URL = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8001`
    : '';

  const fetchNotifications = async () => {
    if (!API_URL) return;
    try {
      const res = await fetch(`${API_URL}/notifications`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) { }
  };

  useEffect(() => {
    fetchNotifications();
    // Polling de notificações a cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [API_URL]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);

      // Tenta recuperar os dados do usuário salvos no Login
      const storedUser = localStorage.getItem('user_srmt');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Atualiza o estado com Nome e Cargo (ou usa padrão se falhar)
          setUserInfo({
            name: parsedUser.name || 'Usuário',
            role: parsedUser.role || 'SVP Team',
            id: parsedUser.id || null,
            avatar: parsedUser.avatar || null,
            email: parsedUser.email || ''
          });
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <>
        <header className="w-full fixed top-0 left-0 z-50 opacity-0 h-16">
          <div className="h-full w-full border-b bg-transparent backdrop-blur-2xl" />
        </header>
        <div className="h-16 mb-8" />
      </>
    );
  }

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (e) { }
  };

  const clearAllNotifs = async () => {
    try {
      await fetch(`${API_URL}/notifications`, { method: 'DELETE' });
      setNotifications([]);
    } catch (e) { }
  };

  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  // --- DESIGN SYSTEM: PROFISSIONAL LIQUID GLASS ---

  const glassContainerClass = isDarkMode
    ? 'bg-black/60 border-white/10 text-gray-100 backdrop-blur-xl shadow-md'
    : 'bg-white/70 border-gray-200 text-gray-800 shadow-sm backdrop-blur-xl';

  const separatorClass = isDarkMode ? 'bg-white/10' : 'bg-black/5';

  const getNavButtonProps = (path: string) => {
    const active = isActive(path);
    return {
      variant: (active ? "secondary" : "ghost") as "secondary" | "ghost",
      className: `
        relative h-9 px-4 text-xs font-semibold transition-all duration-300 rounded-md
        ${active
          ? (isDarkMode
            ? "bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/5"
            : "bg-blue-50 text-blue-700 shadow-sm border border-blue-100")
          : (isDarkMode
            ? "text-gray-400 hover:text-white hover:bg-white/5"
            : "text-gray-600 hover:text-black hover:bg-gray-100/50")
        }
      `
    };
  };

  const getDropdownItemClass = (active: boolean) =>
    `block w-full text-left px-4 py-2.5 text-xs font-medium transition-colors rounded-md
    ${active
      ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-white/80 text-gray-900')
      : (isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100')
    }`;

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_srmt');
      window.location.href = '/login';
    }
  };

  return (
    <>
      <header className={`w-full fixed top-0 left-0 z-50 transition-colors duration-300 border-b ${glassContainerClass}`}>
        <div className="max-w-[1400px] mx-auto h-16 flex justify-between items-center px-6">

          {/* Lado Esquerdo: Logo & Navegação */}
          <div className="flex items-center gap-6">

            {/* Logo Animado Integrado */}
            <div className="relative group/logo flex items-center justify-center cursor-default">
              <div className="absolute inset-[-6px] bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-md opacity-0 group-hover/logo:opacity-100 transition-all duration-1000" />
              <div className={`relative h-9 w-9 rounded-lg flex items-center justify-center font-black text-[10px] tracking-widest border overflow-hidden
                ${isDarkMode
                  ? 'bg-[#1a1a1a] border-white/10 text-white'
                  : 'bg-white border-blue-100 text-blue-700 shadow-sm'}
                transition-transform duration-500 hover:scale-105
              `}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <span className={`relative transition-all duration-300 
                    ${isDarkMode ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-br from-blue-700 to-indigo-800'}
                  `}>
                    SVP
                  </span>
                </div>
              </div>
            </div>

            {/* Divisor */}
            <div className={`h-6 w-px ${separatorClass} hidden md:block`} />

            {/* Navegação */}
            <nav className="hidden md:flex items-center gap-1.5">
              <Button size="sm" asChild {...getNavButtonProps('/ferias')}>
                <a href="/ferias">Ausências e Férias</a>
              </Button>

              <Button size="sm" asChild {...getNavButtonProps('/Construcao')}>
                <a href="/Construcao">Workload</a>
              </Button>

              <Button size="sm" asChild {...getNavButtonProps('/remarks')}>
                <a href="/remarks">Remarks</a>
              </Button>

              <Button size="sm" asChild {...getNavButtonProps('/tickets')}>
                <a href="/tickets">Issues ou Melhorias em SVP</a>
              </Button>

              <Button size="sm" asChild {...getNavButtonProps('/daily-issues')}>
                <a href="/daily-issues">Daily Issues</a>
              </Button>

              <Button size="sm" asChild {...getNavButtonProps('/time-semanal')}>
                <a href="/time-semanal">Time Semanal</a>
              </Button>

              <Button size="sm" asChild {...getNavButtonProps('/kanban')}>
                <a href="/kanban">Kanban</a>
              </Button>

              <Button size="sm" asChild {...getNavButtonProps('/ia-svp')}>
                <a href="/ia-svp" className="flex items-center gap-1.5">
                  <Sparkles className={`h-3.5 w-3.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  SVP AI
                </a>
              </Button>
            </nav>
          </div>

          {/* Lado Direito: Ações & Perfil */}
          <div className="flex items-center gap-2 pr-1">

            {/* Ações Rápidas (Ícones) */}
            <div className="flex items-center gap-1">
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`p-2.5 rounded-full transition-all duration-300 relative ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-black hover:bg-white/40'}`}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className={`absolute right-0 mt-4 w-80 max-h-[400px] flex flex-col rounded-3xl border backdrop-blur-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ease-out
                    ${isDarkMode ? 'bg-[#111]/95 border-white/10' : 'bg-white/95 border-white/60'}`}>
                    <div className="p-4 border-b flex justify-between items-center bg-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Notificações</span>
                      <button
                        onClick={clearAllNotifs}
                        className="text-[10px] font-bold text-blue-500 hover:underline"
                      >
                        Limpar Tudo
                      </button>
                    </div>
                    <div className="flex-grow overflow-auto custom-scrollbar p-2 space-y-2">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center opacity-40 text-xs">Sem notificações no momento.</div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer relative
                              ${n.is_read ? 'opacity-50' : 'shadow-sm'}
                              ${isDarkMode
                                ? 'bg-white/5 border-white/5 hover:bg-white/10'
                                : 'bg-white border-black/5 hover:shadow-md'}`}
                          >
                            {!n.is_read && (
                              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            )}
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-xl ${n.type === 'vacation' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-50/50 text-blue-500'}`}>
                                {n.type === 'vacation' ? <Briefcase className="w-3.5 h-3.5" /> : <TicketIcon className="w-3.5 h-3.5" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-[11px] font-bold leading-tight">{n.title}</p>
                                <p className="text-[10px] opacity-60 mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-[8px] opacity-40 mt-1 uppercase font-bold">
                                  {new Date(n.created_at).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all duration-300 ${isDarkMode ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-indigo-500 hover:bg-indigo-50'}`}
                title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>

            <div className={`h-5 w-px mx-1 ${separatorClass}`} />

            {/* Perfil Minimalista (Pílula) - AGORA DINÂMICO */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-full transition-all border border-transparent ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/60'}`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden font-bold text-white text-xs bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm shrink-0">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    userInfo.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <p className={`text-[11px] font-bold leading-none ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {userInfo.name?.split(' ').map((n: string) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}
                  </p>
                  <p className={`text-[9px] leading-none mt-0.5 font-medium opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {userInfo.role}
                  </p>
                </div>
                <ChevronDown className={`h-3 w-3 ml-1 opacity-50 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
              {isUserMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 p-2 rounded-3xl border backdrop-blur-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-300 ease-out
                    ${isDarkMode ? 'bg-[#111]/95 border-white/10' : 'bg-white/95 border-white/60'}`}
                >
                  {/* Cabeçalho do Perfil */}
                  <div className={`p-4 mb-2 rounded-2xl flex items-center gap-4 ${isDarkMode ? 'bg-white/5' : 'bg-black/[0.03]'}`}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden font-black text-white text-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                      {userInfo.avatar ? (
                        <img src={userInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        userInfo.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                      )}
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="text-sm font-bold leading-tight truncate" title={userInfo.name}>
                        {userInfo.name?.split(' ').map((n: string) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}
                      </span>
                      <span className={`text-[10px] font-medium mt-0.5 truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {userInfo.email}
                      </span>
                    </div>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex flex-col gap-1 p-1">
                    <button
                      type="button"
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${isDarkMode ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'}`}
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        window.location.href = '/perfil';
                      }}
                    >
                      <User className="w-4 h-4 opacity-70" />
                      Meu Perfil
                    </button>
                    
                    <div className={`h-px my-1 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />
                    
                    <button
                      type="button"
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'}`}
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="w-4 h-4 opacity-70" />
                      Sair da conta
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
        <style jsx global>{`
          @keyframes shimmer {
            100% { left: 100%; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(128, 128, 128, 0.2);
            border-radius: 10px;
          }
        `}</style>
      </header>
      <div className="h-16 mb-8" />
    </>
  );
}