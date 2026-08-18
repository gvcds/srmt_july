'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/navbar";
import { useTheme } from '@/components/theme-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FileText,
  User,
  Box,
  AlertCircle,
  Send,
  Sparkles,
  BookOpen,
  Code,
  Wrench,
  CheckSquare,
  FileUp,
  Globe,
  Languages
} from 'lucide-react';

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

export default function MetricasPage() {
    const { isDarkMode } = useTheme();
    const [tipo, setTipo] = useState<'Revisao Manual UG' | 'Revisao STMS' | 'Desenvolvimento QSG' | 'Desenvolvimento UG' | 'Proofread accessories' | 'TEM Request' | ''>('');
    
    // Campos
    const [revisor, setRevisor] = useState('');
    const [modelo, setModelo] = useState('');
    const [issues, setIssues] = useState('');

    
    // Novos campos
    const [idiomaUG, setIdiomaUG] = useState('');
    const [idiomaSTMS, setIdiomaSTMS] = useState('');
    const [stringsRevisadas, setStringsRevisadas] = useState('');
    const [qsgCriados, setQsgCriados] = useState('');
    const [ugCriados, setUgCriados] = useState('');
    const [revisoes, setRevisoes] = useState('');
    const [requests, setRequests] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = { 
                tipo, revisor, modelo, issues, 
                idiomaUG, idiomaSTMS, stringsRevisadas, qsgCriados, ugCriados, revisoes, requests 
            };
            
            const response = await fetch('http://localhost:8000/metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Falha na comunicação com o servidor');
            }

            alert('Métricas registradas com sucesso no banco de dados!');
            
            // Limpa os campos após enviar
            setModelo('');
            setIssues('');
            setIdiomaUG('');
            setIdiomaSTMS('');
            setStringsRevisadas('');
            setQsgCriados('');
            setUgCriados('');
            setRevisoes('');
            setRequests('');
        } catch (error) {
            console.error('Erro ao registrar métricas:', error);
            alert('Erro ao salvar métricas. Verifique se o backend está rodando.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen font-sans flex flex-col items-center transition-colors duration-1000 ${isDarkMode ? "bg-[#050505] text-gray-200" : "bg-[#f5f5f7] text-gray-800"}`}>
            <AIBackground isDarkMode={isDarkMode} />

            <Navbar />

            <div className="w-full max-w-4xl px-4 pt-32 pb-12 relative z-10 flex flex-col min-h-screen">
                <div className="text-center mb-10 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-4 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Controle de Qualidade</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Entrada de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">métricas</span>
                    </h1>
                    <p className={`text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Preencha o formulário abaixo para registrar os dados das análises realizadas.
                    </p>
                </div>

                <Card className={`p-8 md:p-10 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-700 delay-150 fill-mode-both ${
                    isDarkMode 
                        ? 'bg-[#111]/60 border-white/10 shadow-black/50' 
                        : 'bg-white/80 border-gray-200 shadow-gray-200/50'
                }`}>
                    <form onSubmit={handleSubmit} className="space-y-10">
                        
                        {/* Tipo de Métrica */}
                        <div className="space-y-5">
                            <Label className={`text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Box className="w-4 h-4" /> Selecione o tipo de métrica
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <label className={`relative flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${tipo === 'Revisao Manual UG' ? (isDarkMode ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-600/20') : (isDarkMode ? 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5' : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50')}`}>
                                    <input type="radio" name="tipo" value="Revisao Manual UG" className="sr-only" onChange={() => setTipo('Revisao Manual UG')} />
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${tipo === 'Revisao Manual UG' ? 'bg-blue-500 text-white' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500')}`}><FileText className="w-6 h-6" /></div>
                                    <span className={`text-xs text-center font-black tracking-tight ${tipo === 'Revisao Manual UG' ? (isDarkMode ? 'text-blue-400' : 'text-blue-700') : ''}`}>Revisão Manual UG</span>
                                    {tipo === 'Revisao Manual UG' && <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,1)]" />}
                                </label>

                                <label className={`relative flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${tipo === 'Revisao STMS' ? (isDarkMode ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'border-purple-600 bg-purple-50 shadow-lg shadow-purple-600/20') : (isDarkMode ? 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5' : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-gray-50')}`}>
                                    <input type="radio" name="tipo" value="Revisao STMS" className="sr-only" onChange={() => setTipo('Revisao STMS')} />
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${tipo === 'Revisao STMS' ? 'bg-purple-500 text-white' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500')}`}><Box className="w-6 h-6" /></div>
                                    <span className={`text-xs text-center font-black tracking-tight ${tipo === 'Revisao STMS' ? (isDarkMode ? 'text-purple-400' : 'text-purple-700') : ''}`}>Revisão STMS</span>
                                    {tipo === 'Revisao STMS' && <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_15px_rgba(168,85,247,1)]" />}
                                </label>



                                <label className={`relative flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${tipo === 'Desenvolvimento QSG' ? (isDarkMode ? 'border-teal-500 bg-teal-500/10 shadow-[0_0_30px_rgba(20,184,166,0.15)]' : 'border-teal-600 bg-teal-50 shadow-lg shadow-teal-600/20') : (isDarkMode ? 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5' : 'border-gray-200 bg-white hover:border-teal-200 hover:bg-gray-50')}`}>
                                    <input type="radio" name="tipo" value="Desenvolvimento QSG" className="sr-only" onChange={() => setTipo('Desenvolvimento QSG')} />
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${tipo === 'Desenvolvimento QSG' ? 'bg-teal-500 text-white' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500')}`}><Code className="w-6 h-6" /></div>
                                    <span className={`text-xs text-center font-black tracking-tight ${tipo === 'Desenvolvimento QSG' ? (isDarkMode ? 'text-teal-400' : 'text-teal-700') : ''}`}>Desenvolvimento QSG</span>
                                    {tipo === 'Desenvolvimento QSG' && <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse shadow-[0_0_15px_rgba(20,184,166,1)]" />}
                                </label>

                                <label className={`relative flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${tipo === 'Desenvolvimento UG' ? (isDarkMode ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.15)]' : 'border-orange-600 bg-orange-50 shadow-lg shadow-orange-600/20') : (isDarkMode ? 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5' : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-gray-50')}`}>
                                    <input type="radio" name="tipo" value="Desenvolvimento UG" className="sr-only" onChange={() => setTipo('Desenvolvimento UG')} />
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${tipo === 'Desenvolvimento UG' ? 'bg-orange-500 text-white' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500')}`}><Wrench className="w-6 h-6" /></div>
                                    <span className={`text-xs text-center font-black tracking-tight ${tipo === 'Desenvolvimento UG' ? (isDarkMode ? 'text-orange-400' : 'text-orange-700') : ''}`}>Desenvolvimento UG</span>
                                    {tipo === 'Desenvolvimento UG' && <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_15px_rgba(249,115,22,1)]" />}
                                </label>

                                <label className={`relative flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${tipo === 'Proofread accessories' ? (isDarkMode ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_30px_rgba(236,72,153,0.15)]' : 'border-pink-600 bg-pink-50 shadow-lg shadow-pink-600/20') : (isDarkMode ? 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5' : 'border-gray-200 bg-white hover:border-pink-200 hover:bg-gray-50')}`}>
                                    <input type="radio" name="tipo" value="Proofread accessories" className="sr-only" onChange={() => setTipo('Proofread accessories')} />
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${tipo === 'Proofread accessories' ? 'bg-pink-500 text-white' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500')}`}><CheckSquare className="w-6 h-6" /></div>
                                    <span className={`text-xs text-center font-black tracking-tight ${tipo === 'Proofread accessories' ? (isDarkMode ? 'text-pink-400' : 'text-pink-700') : ''}`}>Proofread accessories</span>
                                    {tipo === 'Proofread accessories' && <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_15px_rgba(236,72,153,1)]" />}
                                </label>

                                <label className={`relative flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${tipo === 'TEM Request' ? (isDarkMode ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-cyan-600 bg-cyan-50 shadow-lg shadow-cyan-600/20') : (isDarkMode ? 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5' : 'border-gray-200 bg-white hover:border-cyan-200 hover:bg-gray-50')}`}>
                                    <input type="radio" name="tipo" value="TEM Request" className="sr-only" onChange={() => setTipo('TEM Request')} />
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${tipo === 'TEM Request' ? 'bg-cyan-500 text-white' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500')}`}><FileUp className="w-6 h-6" /></div>
                                    <span className={`text-xs text-center font-black tracking-tight ${tipo === 'TEM Request' ? (isDarkMode ? 'text-cyan-400' : 'text-cyan-700') : ''}`}>TEM Request</span>
                                    {tipo === 'TEM Request' && <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_15px_rgba(6,182,212,1)]" />}
                                </label>
                            </div>
                        </div>

                        {tipo !== '' && (
                            <div className="space-y-8 animate-in slide-in-from-top-4 fade-in duration-500 pt-4 border-t border-white/5">
                                {/* Revisor (Always Visible) */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-base font-semibold">
                                        <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                                            <User className="w-4 h-4" />
                                        </div>
                                        Revisor
                                    </Label>
                                    <div className="relative">
                                        <select 
                                            value={revisor}
                                            onChange={(e) => setRevisor(e.target.value)}
                                            required
                                            className={`w-full h-12 px-4 py-2 rounded-xl border appearance-none outline-none transition-all font-medium ${
                                                isDarkMode 
                                                    ? 'bg-black/50 border-white/10 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 text-white' 
                                                    : 'bg-white border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 text-gray-900 shadow-sm'
                                            }`}
                                        >
                                            <option value="" disabled>Selecione um revisor...</option>
                                            <option value="denise.martins">Denise Martins</option>
                                            <option value="edgard.cunha">Edgard Cunha</option>
                                        </select>
                                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                            ▼
                                        </div>
                                    </div>
                                </div>

                                {/* Idioma UG */}
                                {tipo === 'Revisao Manual UG' && (
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-base font-semibold">
                                            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                                <Languages className="w-4 h-4" />
                                            </div>
                                            Idioma da Revisão
                                        </Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${idiomaUG === 'Revisao Espanhol-Latin' ? (isDarkMode ? 'border-blue-500 bg-blue-500/20' : 'border-blue-600 bg-blue-50') : (isDarkMode ? 'border-white/10 bg-black/40 hover:bg-white/5' : 'border-gray-200 bg-white hover:bg-gray-50')}`}>
                                                <input type="radio" name="idiomaUG" value="Revisao Espanhol-Latin" className="sr-only" onChange={(e) => setIdiomaUG(e.target.value)} required />
                                                <span className={`font-bold text-sm text-center ${idiomaUG === 'Revisao Espanhol-Latin' ? (isDarkMode ? 'text-blue-400' : 'text-blue-700') : ''}`}>Revisão Espanhol-Latin</span>
                                            </label>
                                            <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${idiomaUG === 'Revisao Ingles-Latin' ? (isDarkMode ? 'border-blue-500 bg-blue-500/20' : 'border-blue-600 bg-blue-50') : (isDarkMode ? 'border-white/10 bg-black/40 hover:bg-white/5' : 'border-gray-200 bg-white hover:bg-gray-50')}`}>
                                                <input type="radio" name="idiomaUG" value="Revisao Ingles-Latin" className="sr-only" onChange={(e) => setIdiomaUG(e.target.value)} />
                                                <span className={`font-bold text-sm ${idiomaUG === 'Revisao Ingles-Latin' ? (isDarkMode ? 'text-blue-400' : 'text-blue-700') : ''}`}>Revisão Inglês-Latin</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Idioma STMS */}
                                {tipo === 'Revisao STMS' && (
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-base font-semibold">
                                            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                                <Languages className="w-4 h-4" />
                                            </div>
                                            Idioma da Revisão
                                        </Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${idiomaSTMS === 'Revisao Portugues-Brasil' ? (isDarkMode ? 'border-purple-500 bg-purple-500/20' : 'border-purple-600 bg-purple-50') : (isDarkMode ? 'border-white/10 bg-black/40 hover:bg-white/5' : 'border-gray-200 bg-white hover:bg-gray-50')}`}>
                                                <input type="radio" name="idiomaSTMS" value="Revisao Portugues-Brasil" className="sr-only" onChange={(e) => setIdiomaSTMS(e.target.value)} required />
                                                <span className={`font-bold text-sm text-center ${idiomaSTMS === 'Revisao Portugues-Brasil' ? (isDarkMode ? 'text-purple-400' : 'text-purple-700') : ''}`}>Revisão Português-Brasil</span>
                                            </label>
                                            <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${idiomaSTMS === 'Revisao Espanhol-Latin' ? (isDarkMode ? 'border-purple-500 bg-purple-500/20' : 'border-purple-600 bg-purple-50') : (isDarkMode ? 'border-white/10 bg-black/40 hover:bg-white/5' : 'border-gray-200 bg-white hover:bg-gray-50')}`}>
                                                <input type="radio" name="idiomaSTMS" value="Revisao Espanhol-Latin" className="sr-only" onChange={(e) => setIdiomaSTMS(e.target.value)} />
                                                <span className={`font-bold text-sm text-center ${idiomaSTMS === 'Revisao Espanhol-Latin' ? (isDarkMode ? 'text-purple-400' : 'text-purple-700') : ''}`}>Revisão Espanhol-Latin</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Nome do modelo revisado */}
                                {tipo === 'Revisao Manual UG' && (
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-base font-semibold">
                                            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                                <Box className="w-4 h-4" />
                                            </div>
                                            Nome do modelo revisado
                                        </Label>
                                        <Input 
                                            type="text" 
                                            placeholder="Ex: SM-A546E..."
                                            value={modelo}
                                            onChange={(e) => setModelo(e.target.value)}
                                            required
                                            className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus-visible:ring-indigo-500' : 'bg-white shadow-sm focus-visible:ring-indigo-500'}`}
                                        />
                                    </div>
                                )}

                                {/* Quantidade de Strings Revisadas */}
                                {tipo === 'Revisao STMS' && (
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-base font-semibold">
                                            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            Quantidade de Strings revisadas
                                        </Label>
                                        <Input 
                                            type="number" min="0" placeholder="0"
                                            value={stringsRevisadas} onChange={(e) => setStringsRevisadas(e.target.value)}
                                            required className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus-visible:ring-purple-500' : 'bg-white shadow-sm focus-visible:ring-purple-500'}`}
                                        />
                                    </div>
                                )}

                                {/* Campos de Desenvolvimento QSG */}
                                {tipo === 'Desenvolvimento QSG' && (
                                    <>
                                        <div className="space-y-3">
                                            <Label className="flex items-center gap-2 text-base font-semibold">
                                                <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                                    <Box className="w-4 h-4" />
                                                </div>
                                                Modelo do QSG criado
                                            </Label>
                                            <Input 
                                                type="text" 
                                                placeholder="Ex: SM-A546E..."
                                                value={modelo}
                                                onChange={(e) => setModelo(e.target.value)}
                                                required
                                                className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus-visible:ring-indigo-500' : 'bg-white shadow-sm focus-visible:ring-indigo-500'}`}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="flex items-center gap-2 text-base font-semibold">
                                                <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600'}`}>
                                                    <Code className="w-4 h-4" />
                                                </div>
                                                Quantidade de QSG Criados
                                            </Label>
                                            <Input 
                                                type="number" min="0" placeholder="0"
                                                value={qsgCriados} onChange={(e) => setQsgCriados(e.target.value)}
                                                required className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus-visible:ring-teal-500' : 'bg-white shadow-sm focus-visible:ring-teal-500'}`}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Campos de Desenvolvimento UG */}
                                {tipo === 'Desenvolvimento UG' && (
                                    <>
                                        <div className="space-y-3">
                                            <Label className="flex items-center gap-2 text-base font-semibold">
                                                <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                                                    <Box className="w-4 h-4" />
                                                </div>
                                                Modelo do UG criado
                                            </Label>
                                            <Input 
                                                type="text" 
                                                placeholder="Ex: SM-A546E..."
                                                value={modelo}
                                                onChange={(e) => setModelo(e.target.value)}
                                                required
                                                className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus-visible:ring-orange-500' : 'bg-white shadow-sm focus-visible:ring-orange-500'}`}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="flex items-center gap-2 text-base font-semibold">
                                                <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                                                    <Wrench className="w-4 h-4" />
                                                </div>
                                                Quantidade de UG Criados
                                            </Label>
                                            <Input 
                                                type="number" min="0" placeholder="0"
                                                value={ugCriados} onChange={(e) => setUgCriados(e.target.value)}
                                                required className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus-visible:ring-orange-500' : 'bg-white shadow-sm focus-visible:ring-orange-500'}`}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Quantidade de Revisões */}
                                {tipo === 'Proofread accessories' && (
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-base font-semibold">
                                            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
                                                <CheckSquare className="w-4 h-4" />
                                            </div>
                                            Quantidade de revisões
                                        </Label>
                                        <Input 
                                            type="number" min="0" placeholder="0"
                                            value={revisoes} onChange={(e) => setRevisoes(e.target.value)}
                                            required className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus-visible:ring-pink-500' : 'bg-white shadow-sm focus-visible:ring-pink-500'}`}
                                        />
                                    </div>
                                )}

                                {/* Quantidade de Requests */}
                                {tipo === 'TEM Request' && (
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-base font-semibold">
                                            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                                                <FileUp className="w-4 h-4" />
                                            </div>
                                            Quantidade de requests
                                        </Label>
                                        <Input 
                                            type="number" min="0" placeholder="0"
                                            value={requests} onChange={(e) => setRequests(e.target.value)}
                                            required className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus-visible:ring-cyan-500' : 'bg-white shadow-sm focus-visible:ring-cyan-500'}`}
                                        />
                                    </div>
                                )}

                                {/* Quantidade de issues encontradas */}
                                {['Revisao Manual UG', 'Revisao STMS', 'Proofread accessories'].includes(tipo) && (
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-base font-semibold">
                                            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
                                                <AlertCircle className="w-4 h-4" />
                                            </div>
                                            Quantidade de issues encontradas
                                        </Label>
                                        <Input 
                                            type="number" 
                                            min="0"
                                            placeholder="0"
                                            value={issues}
                                            onChange={(e) => setIssues(e.target.value)}
                                            required
                                            className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white focus-visible:ring-red-500' : 'bg-white shadow-sm focus-visible:ring-red-500'}`}
                                        />
                                    </div>
                                )}


                            </div>
                        )}

                        <div className="pt-8 border-t mt-10 border-black/5 dark:border-white/5">
                            <Button 
                                type="submit"
                                disabled={!tipo || isLoading}
                                className={`w-full h-14 rounded-xl text-lg font-bold tracking-wide transition-all duration-300 ${
                                    !tipo || isLoading
                                        ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-white/10 dark:text-white/30' 
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1'
                                }`}
                            >
                                <Send className={`w-5 h-5 mr-3 ${isLoading ? 'animate-pulse' : ''}`} />
                                {isLoading ? 'Salvando...' : 'Registrar Métricas'}
                            </Button>
                        </div>

                    </form>
                </Card>
            </div>
        </div>
    );
}
