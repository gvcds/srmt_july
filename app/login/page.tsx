'use client';

import React, { useState, createContext, useContext, useEffect, FormEvent, useRef, Suspense } from 'react';
import {
  LogIn,
  ShieldCheck,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Info,
  Cpu,
  Shield,
  Zap,
  Lock,
  Atom,
  Orbit
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
  Float,
  Stars,
  PerspectiveCamera,
  Torus,
  MeshWobbleMaterial,
  Icosahedron
} from '@react-three/drei';
import * as THREE from 'three';

// ==========================================
// 1. 3D BACKGROUND COMPONENTS (Quantum Core)
// ==========================================

const QuantumCore = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.5;
      coreRef.current.rotation.y = t * 0.3;
      const s = 1 + Math.sin(t * 2) * 0.1;
      coreRef.current.scale.set(s, s, s);
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.8;
      ring1Ref.current.rotation.x = t * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * -0.6;
      ring2Ref.current.rotation.z = t * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.2;
      ring3Ref.current.rotation.y = t * 0.2;
    }
  });

  return (
    <Float speed={4} rotationIntensity={2} floatIntensity={2}>
      <group>
        {/* Central Icosahedron */}
        <Icosahedron ref={coreRef} args={[1.5, 1]}>
          <MeshDistortMaterial
            color={isDarkMode ? "#3b82f6" : "#2563eb"}
            emissive={isDarkMode ? "#6366f1" : "#1d4ed8"}
            emissiveIntensity={2}
            speed={4}
            distort={0.4}
            radius={1}
            metalness={1}
            roughness={0}
          />
        </Icosahedron>

        {/* Orbiting Rings */}
        <Torus ref={ring1Ref} args={[2.8, 0.03, 16, 100]}>
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={5} />
        </Torus>

        <Torus ref={ring2Ref} args={[3.4, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={5} />
        </Torus>

        <Torus ref={ring3Ref} args={[4.0, 0.01, 16, 100]} rotation={[0, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={5} />
        </Torus>

        {/* Particle Glow */}
        <Sphere args={[1.6, 32, 32]}>
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} wireframe />
        </Sphere>
      </group>
    </Float>
  );
};

const NeuralNetwork = () => {
  const points = useRef<THREE.Vector3[]>([]);
  if (points.current.length === 0) {
    for (let i = 0; i < 40; i++) {
      points.current.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ));
    }
  }

  return (
    <group>
      {points.current.map((p, i) => (
        <Float key={i} speed={2 + Math.random() * 2} rotationIntensity={1} floatIntensity={1}>
          <Sphere position={[p.x, p.y, p.z]} args={[0.05, 8, 8]}>
            <meshBasicMaterial color={i % 2 === 0 ? "#3b82f6" : "#a855f7"} transparent opacity={0.5} />
          </Sphere>
        </Float>
      ))}
    </group>
  );
};

// ==========================================
// 2. ESTILOS LIQUID GLASS
// ==========================================

const getGlassCardStyle = (isDark: boolean) =>
  `rounded-3xl transition-all duration-1000 overflow-hidden border
   ${isDark
    ? 'bg-black/40 border-white/10 backdrop-blur-3xl shadow-[0_32px_128px_-12px_rgba(0,0,0,1)]'
    : 'bg-white/60 border-white/80 backdrop-blur-3xl shadow-[0_32px_128px_-12px_rgba(0,0,0,0.1)]'}`;

const getGlassInputStyle = (isDark: boolean) =>
  `w-full p-4 rounded-xl outline-none transition-all duration-500 text-[12px] backdrop-blur-md appearance-none font-bold tracking-tight
   ${isDark
    ? 'bg-black/30 border border-white/5 text-white placeholder-gray-600 focus:bg-black/50 focus:border-blue-500/50 focus:ring-[12px] focus:ring-blue-500/5'
    : 'bg-white/40 border border-white/40 text-gray-800 placeholder-gray-400 focus:bg-white/80 focus:border-blue-500/50 focus:ring-[12px] focus:ring-blue-500/5 shadow-sm'}`;

const getGlassButtonStyle = (isDark: boolean) =>
  `w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-700 shadow-2xl flex items-center justify-center gap-3 group/btn
    ${isDark
    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20 active:scale-[0.96] hover:gap-6'
    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30 active:scale-[0.96] hover:gap-6'
  }`;

// ==========================================
// 3. COMPONENTE TOAST
// ==========================================

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

function CustomToast({ message, type, isVisible, onClose, isDarkMode }: ToastProps) {
  if (!isVisible) return null;

  const glassStyle = isDarkMode
    ? 'bg-black/95 border-white/10 text-gray-100 shadow-[0_0_50px_rgba(0,0,0,1)]'
    : 'bg-white/95 border-white/40 text-gray-800 shadow-2xl';

  let iconColor = 'text-blue-500';
  let Icon = Info;

  if (type === 'success') { iconColor = 'text-green-500'; Icon = CheckCircle2; }
  else if (type === 'error') { iconColor = 'text-red-500'; Icon = AlertCircle; }
  else if (type === 'warning') { iconColor = 'text-orange-500'; Icon = AlertTriangle; }

  return (
    <div className={`fixed bottom-10 right-10 z-[300] flex items-center gap-5 p-6 rounded-[2.5rem] border backdrop-blur-3xl animate-in slide-in-from-bottom-10 fade-in duration-700 max-w-md ${glassStyle}`}>
      <div className={`p-4 rounded-2xl bg-opacity-10 ${iconColor.replace('text-', 'bg-')}`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-black leading-tight tracking-tight">{message}</p>
      </div>
      <button onClick={onClose} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
        <X className="w-5 h-5 opacity-30" />
      </button>
    </div>
  );
}

// ==========================================
// 4. CONTEXTO DE IDIOMA
// ==========================================

type Language = "pt-BR" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt-BR");
  useEffect(() => {
    const saved = localStorage.getItem('srmt_lang');
    if (saved === 'en') setLanguage('en');
    else if (saved === 'pt') setLanguage('pt-BR');
  }, []);
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}

// ==========================================
// 5. TRADUÇÕES
// ==========================================

const translations: Record<Language, {
  nav: { badge: string };
  hero: { tag: string; title: string; accent: string; description: string };
  security: { title: string; description: string };
  form: {
    title: string;
    description: string;
    identifier: { label: string; placeholder: string; hint: string };
    password: { label: string; placeholder: string; hint: string };
    submit: string;
  };
  bottom: { notice: string };
  firstAccess: {
    title: string;
    description: string;
    teamCell: { label: string; placeholder: string };
    kp: { label: string; placeholder: string };
    role: { label: string; placeholder: string };
    sidiaId: { label: string; placeholder: string };
    kpType: { label: string };
    isBackup: { label: string };
    submit: string;
    cancel: string;
  };
}> = {
  "pt-BR": {
    nav: { badge: "SIDIA | SVP QUALITY ENGINEERING" },
    hero: {
      tag: "Deep Identity Security",
      title: "Sistema de Relatórios e",
      accent: "Métricas de Testes.",
      description: "A próxima fronteira da engenharia de qualidade impulsionada por inteligência generativa e automação avançada.",
    },
    security: {
      title: "Criptografia de Ponta",
      description: "Sistema blindado com monitoramento preditivo para proteção total de IP e ativos digitais.",
    },
    form: {
      title: "Acessar Portal",
      description: "Utilize suas credenciais LDAP corporativas.",
      identifier: { label: "Usuário de Rede", placeholder: "seu.usuario", hint: "Domínio: corp" },
      password: { label: "Senha de Rede", placeholder: "Senha CORP", hint: "Conexão de segurança máxima." },
      submit: "Entrar no Hub",
    },
    bottom: {
      notice: "Propriedade Exclusiva do Time de SVP • 2026",
    },
    firstAccess: {
      title: "Primeiro acesso",
      description: "Sincronize seu perfil técnico para prosseguir.",
      teamCell: { label: "Time / Célula", placeholder: "Selecione" },
      kp: { label: "KP de Projeto", placeholder: "Selecione" },
      role: { label: "Cargo / Título", placeholder: "Selecione" },
      sidiaId: { label: "Matrícula SIDIA", placeholder: "Ex: 123456" },
      kpType: { label: "Perfil de Atuação" },
      isBackup: { label: "Status de Backup" },
      submit: "Confirmar Identidade",
      cancel: "Abortar"
    },
  },
  en: {
    nav: { badge: "SIDIA | SVP QUALITY ENGINEERING" },
    hero: {
      tag: "Deep Identity Security",
      title: "Test Reporting and",
      accent: "Metrics System.",
      description: "The next frontier of quality engineering driven by generative intelligence and advanced automation.",
    },
    security: {
      title: "End-to-End Encryption",
      description: "Shielded system with predictive monitoring for total IP and digital asset protection.",
    },
    form: {
      title: "Sign in to Hub",
      description: "Use your standard corporate LDAP credentials.",
      identifier: { label: "Network ID", placeholder: "your.user", hint: "Domain: corp" },
      password: { label: "Network Password", placeholder: "CORP Password", hint: "Maximum security connection." },
      submit: "Enter the Hub",
    },
    bottom: {
      notice: "Exclusive Property of SVP Team • 2026",
    },
    firstAccess: {
      title: "First access",
      description: "Sync your technical profile to proceed.",
      teamCell: { label: "Team / Cell", placeholder: "Select" },
      kp: { label: "Project KP", placeholder: "Select" },
      role: { label: "Role / Title", placeholder: "Select" },
      sidiaId: { label: "SIDIA ID", placeholder: "Ex: 123456" },
      kpType: { label: "Role Profile" },
      isBackup: { label: "Backup Status" },
      submit: "Confirm Identity",
      cancel: "Abort"
    },
  },
};

// ==========================================
// 6. PÁGINA DE LOGIN
// ==========================================

function LoginPage() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const isDarkMode = true; // Always dark mode for login page

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'warning' | 'info', visible: boolean }>({
    message: '', type: 'info', visible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  const getApiBaseUrl = () => {
    if (typeof window !== "undefined") return `${window.location.protocol}//${window.location.hostname}:8001`;
    return "http://localhost:8001";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        const isFirstAccess = Boolean(data.first_access);
        const userData = data.user;

        if (userData) {
          localStorage.setItem('user_srmt', JSON.stringify({
            id: userData.id, name: userData.name, role: userData.role, team: userData.team,
            cell: userData.cell, kp: userData.kp, kp_type: userData.kp_type, 
            sidia_id: userData.sidia_id, is_backup: Boolean(userData.is_backup),
            is_specialist: Boolean(userData.is_specialist), avatar: userData.avatar,
            bio: userData.bio, skills: userData.skills,
            email: userData.email || email,
            first_access: isFirstAccess
          }));
        } else if (isFirstAccess) {
          // Se for primeiro acesso mas não vier userData, salva o básico para a tela de perfil
          localStorage.setItem('user_srmt', JSON.stringify({
            email: email, name: email.split("@")[0]
          }));
        }

        showToast("Identidade confirmada. Acessando...", "success");

        setTimeout(() => {
          if (isFirstAccess) {
            window.location.href = '/perfil';
          } else {
            window.location.href = '/perfil';
          }
        }, 1000);
      } else {
        showToast(data.detail || "Falha na autenticação.", "error");
      }
    } catch (error) {
      showToast("Servidor indisponível.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const mainBgClass = isDarkMode ? "bg-[#020204] text-gray-200" : "bg-[#f8f9fb] text-gray-800";
  const labelClass = `block text-[8px] font-black uppercase tracking-[0.3em] mb-4 ml-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.4 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 60, filter: "blur(10px)", scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15
      }
    }
  };

  return (
    <div className={`relative flex min-h-screen flex-col font-sans transition-colors duration-1000 overflow-hidden ${mainBgClass}`}>

      {/* 3D Quantum Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80 scale-110 md:scale-100">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />
          <Stars radius={150} depth={100} count={10000} factor={8} saturation={1} fade speed={4} />
          <ambientLight intensity={0.4} />
          <pointLight position={[20, 20, 20]} intensity={4} color="#3b82f6" />
          <pointLight position={[-20, -20, -20]} intensity={3} color="#a855f7" />
          <Suspense fallback={null}>
            <QuantumCore isDarkMode={isDarkMode} />
            <NeuralNetwork />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
        </Canvas>
      </div>

      <CustomToast
        message={toast.message} type={toast.type} isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} isDarkMode={isDarkMode}
      />

      <header className="relative z-10 flex items-center justify-end px-12 py-12 md:px-20">
        <div className="flex justify-center gap-4">
          {[
            { id: 'pt-BR', label: 'BR', icon: '🇧🇷' },
            { id: 'en', label: 'EN', icon: '🇺🇸' }
          ].map((l) => (
            <button key={l.id} onClick={() => { setLanguage(l.id as any); localStorage.setItem('srmt_lang', l.id === 'pt-BR' ? 'pt' : 'en'); }} className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 border-2 flex items-center gap-3 ${language === l.id ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]' : 'bg-black/40 border-white/5 opacity-40 hover:opacity-100 hover:bg-black/60 hover:border-white/10'}`}>
              <span>{l.icon}</span> {l.label}
            </button>
          ))}
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-12 pb-32">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mx-auto grid w-full max-w-[1400px] gap-32 lg:grid-cols-[1.4fr_1fr] items-center">

          <div className="flex flex-col justify-center gap-10">
            <motion.div variants={itemVariants} className={`inline-flex items-center gap-4 self-start rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-[0.4em] border-2 backdrop-blur-3xl shadow-[0_0_30px_rgba(59,130,246,0.1)]
                ${isDarkMode ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-500/20 text-blue-600'}`}>
              <Lock className="size-5 animate-pulse" /> {t.hero.tag}
            </motion.div>

            <div className="space-y-6">
              <motion.h1 variants={itemVariants} className={`text-4xl md:text-5xl font-black leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.hero.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">{t.hero.accent}</span>
              </motion.h1>
              <motion.p variants={itemVariants} className={`text-sm md:text-base leading-relaxed font-bold opacity-60 max-w-lg tracking-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.hero.description}</motion.p>
            </div>

            <motion.div variants={itemVariants} className={`flex items-start gap-4 p-6 rounded-3xl border-2 backdrop-blur-3xl transition-all duration-1000 group
              ${isDarkMode ? 'bg-white/[0.02] border-white/5 hover:border-blue-500/40 hover:bg-white/[0.05]' : 'bg-white/60 border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:border-blue-500/40'}`}>
              <div className={`p-4 rounded-2xl transition-all duration-1000 group-hover:rotate-[360deg] group-hover:scale-110 ${isDarkMode ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'}`}>
                <ShieldCheck className="size-6" />
              </div>
              <div className="space-y-2">
                <p className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.security.title}</p>
                <p className={`text-xs leading-relaxed font-bold opacity-50 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.security.description}</p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className={getGlassCardStyle(isDarkMode)}>
            <div className={`p-8 pb-5 border-b border-white/5 bg-white/5`}>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-inner">
                <Orbit size={12} className="animate-spin" style={{ animationDuration: '8s' }} /> Deep Secure Access
              </div>
              <h2 className={`text-2xl font-black tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.form.title}</h2>
              <p className={`text-[9px] font-black uppercase tracking-widest opacity-50`}>{t.form.description}</p>
            </div>

            <div className="p-8 pt-6 space-y-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <label htmlFor="email" className={labelClass}>{t.form.identifier.label}</label>
                  <div className="relative group">
                    <input id="email" type="text" autoComplete="username" placeholder={t.form.identifier.placeholder} required value={email} onChange={(e) => setEmail(e.target.value)} className={getGlassInputStyle(isDarkMode)} />
                    <Zap className="absolute right-4 top-1/2 -translate-y-1/2 size-5 opacity-20 group-focus-within:text-blue-500 group-focus-within:opacity-100 group-focus-within:scale-110 transition-all duration-700" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label htmlFor="password" className={labelClass}>{t.form.password.label}</label>
                  <div className="relative group">
                    <input id="password" type="password" autoComplete="current-password" placeholder={t.form.password.placeholder} required value={password} onChange={(e) => setPassword(e.target.value)} className={getGlassInputStyle(isDarkMode)} />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-5 opacity-20 group-focus-within:text-blue-500 group-focus-within:opacity-100 group-focus-within:scale-110 transition-all duration-700" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className={getGlassButtonStyle(isDarkMode)}>
                  {isLoading ? <RefreshCw className="size-6 animate-spin" /> : <LogIn className="size-6 group-hover/btn:translate-x-2 transition-transform duration-500" />}
                  {isLoading ? 'Authenticating...' : t.form.submit}
                </button>
              </form>
            </div>

            <div className={`p-6 bg-black/20 dark:bg-white/5 border-t border-white/5 flex flex-col items-center gap-2`}>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => <div key={i} className={`w-1 h-1 rounded-full ${i === 1 ? 'bg-blue-500' : 'bg-white/20'}`} />)}
              </div>
              <p className={`text-[8px] font-black uppercase tracking-widest opacity-40`}>{t.bottom.notice}</p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <LoginPage />
    </LanguageProvider>
  );
}