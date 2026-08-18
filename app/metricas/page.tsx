'use client';

import React, { useState } from 'react';
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
  CalendarDays,
  Clock,
  Send,
  Sparkles
} from 'lucide-react';

export default function MetricasPage() {
    const { isDarkMode } = useTheme();
    const [tipo, setTipo] = useState<'Manual' | 'STMS' | ''>('');
    const [revisor, setRevisor] = useState('');
    const [modelo, setModelo] = useState('');
    const [issues, setIssues] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [tempoDecorrido, setTempoDecorrido] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica de envio (a ser implementada futuramente)
        console.log({ tipo, revisor, modelo, issues, dataInicial, dataFim, tempoDecorrido });
        alert('Métricas registradas com sucesso (Log no console)');
    };

    return (
        <div className={`min-h-screen font-sans flex flex-col items-center transition-colors duration-1000 ${isDarkMode ? "bg-[#050505] text-gray-200" : "bg-[#f5f5f7] text-gray-800"}`}>
            {/* Background animado e premium */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} style={{ animationDuration: '8s' }} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse ${isDarkMode ? 'bg-purple-600' : 'bg-purple-400'}`} style={{ animationDuration: '12s', animationDelay: '2s' }} />
            </div>

            <Navbar />

            <div className="w-full max-w-3xl px-4 pt-32 pb-12 relative z-10 flex flex-col min-h-screen">
                <div className="text-center mb-10 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-4 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Controle de Qualidade</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Entrada de métricas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Manual e STMS</span>
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
                            <div className="grid grid-cols-2 gap-6">
                                <label className={`
                                    relative flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group
                                    ${tipo === 'Manual' 
                                        ? (isDarkMode ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-600/20') 
                                        : (isDarkMode ? 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5' : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50')}
                                `}>
                                    <input type="radio" name="tipo" value="Manual" className="sr-only" onChange={() => setTipo('Manual')} />
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${
                                        tipo === 'Manual' ? 'bg-blue-500 text-white' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500')
                                    }`}>
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <span className={`text-lg font-black tracking-tight ${tipo === 'Manual' ? (isDarkMode ? 'text-blue-400' : 'text-blue-700') : ''}`}>Manual</span>
                                    
                                    {tipo === 'Manual' && (
                                        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,1)]" />
                                    )}
                                </label>

                                <label className={`
                                    relative flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group
                                    ${tipo === 'STMS' 
                                        ? (isDarkMode ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'border-purple-600 bg-purple-50 shadow-lg shadow-purple-600/20') 
                                        : (isDarkMode ? 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5' : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-gray-50')}
                                `}>
                                    <input type="radio" name="tipo" value="STMS" className="sr-only" onChange={() => setTipo('STMS')} />
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${
                                        tipo === 'STMS' ? 'bg-purple-500 text-white' : (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500')
                                    }`}>
                                        <Box className="w-7 h-7" />
                                    </div>
                                    <span className={`text-lg font-black tracking-tight ${tipo === 'STMS' ? (isDarkMode ? 'text-purple-400' : 'text-purple-700') : ''}`}>STMS</span>
                                    
                                    {tipo === 'STMS' && (
                                        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-purple-500 animate-pulse shadow-[0_0_15px_rgba(168,85,247,1)]" />
                                    )}
                                </label>
                            </div>
                        </div>

                        {tipo === 'Manual' && (
                            <div className="space-y-8 animate-in slide-in-from-top-4 fade-in duration-500 pt-4 border-t border-white/5">
                                {/* Revisor */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-base font-semibold">
                                        <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
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
                                                    ? 'bg-black/50 border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white' 
                                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 shadow-sm'
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

                                {/* Nome do modelo revisado */}
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

                                {/* Quantidade de issues encontradas */}
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Data inicial */}
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-base font-semibold">
                                            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                                <CalendarDays className="w-4 h-4" />
                                            </div>
                                            Data inicial
                                        </Label>
                                        <Input 
                                            type="date" 
                                            value={dataInicial}
                                            onChange={(e) => setDataInicial(e.target.value)}
                                            required
                                            className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white [color-scheme:dark] focus-visible:ring-green-500' : 'bg-white shadow-sm focus-visible:ring-green-500'}`}
                                        />
                                    </div>

                                    {/* Data fim */}
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-base font-semibold">
                                            <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600'}`}>
                                                <CalendarDays className="w-4 h-4" />
                                            </div>
                                            Data fim
                                        </Label>
                                        <Input 
                                            type="date" 
                                            value={dataFim}
                                            onChange={(e) => setDataFim(e.target.value)}
                                            required
                                            className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white [color-scheme:dark] focus-visible:ring-teal-500' : 'bg-white shadow-sm focus-visible:ring-teal-500'}`}
                                        />
                                    </div>
                                </div>

                                {/* Tempo decorrido */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-base font-semibold">
                                        <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        Tempo decorrido (Horas:Minutos)
                                    </Label>
                                    <Input 
                                        type="time" 
                                        value={tempoDecorrido}
                                        onChange={(e) => setTempoDecorrido(e.target.value)}
                                        required
                                        className={`h-12 rounded-xl border font-medium ${isDarkMode ? 'bg-black/50 border-white/10 text-white [color-scheme:dark] focus-visible:ring-orange-500' : 'bg-white shadow-sm focus-visible:ring-orange-500'}`}
                                    />
                                </div>
                            </div>
                        )}

                        {tipo === 'STMS' && (
                            <div className="py-16 text-center animate-in zoom-in-95 fade-in duration-500 border rounded-2xl bg-black/5 dark:bg-white/5 border-dashed">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center animate-pulse">
                                    <Box className="w-10 h-10 text-purple-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight">Campos de STMS</h3>
                                <p className={`opacity-70 max-w-sm mx-auto text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Os campos específicos para análise de STMS serão implementados futuramente conforme sua solicitação.
                                </p>
                            </div>
                        )}

                        <div className="pt-8 border-t mt-10 border-black/5 dark:border-white/5">
                            <Button 
                                type="submit"
                                disabled={!tipo}
                                className={`w-full h-14 rounded-xl text-lg font-bold tracking-wide transition-all duration-300 ${
                                    !tipo 
                                        ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-white/10 dark:text-white/30' 
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1'
                                }`}
                            >
                                <Send className="w-5 h-5 mr-3" />
                                Registrar Métricas
                            </Button>
                        </div>

                    </form>
                </Card>
            </div>
        </div>
    );
}
