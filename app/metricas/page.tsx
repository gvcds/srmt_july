'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Languages,
  BarChart3,
  PenLine,
  TrendingUp,
  Table as TableIcon,
  Trash2,
  Edit2,
  X,
  Save
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

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

// --- TIPOS ---
interface MetricRecord {
    id: number;
    tipo: string;
    revisor: string;
    modelo: string | null;
    issues: number | null;
    idiomaUG: string | null;
    idiomaSTMS: string | null;
    stringsRevisadas: number | null;
    qsgCriados: number | null;
    ugCriados: number | null;
    revisoes: number | null;
    requests: number | null;
    created_at: string | null;
}

const REVISORES: Record<string, string> = {
    'denise.martins': 'Denise Martins',
    'edgard.cunha': 'Edgard Cunha'
};

const CHART_COLORS = {
    'denise.martins': { line: '#3b82f6', bar: '#60a5fa' },
    'edgard.cunha': { line: '#a855f7', bar: '#c084fc' }
};

// --- COMPONENTE DE GRÁFICO DUPLO (Linha + Barra) ---
const DualChart = ({ 
    title, data, dataKey, isDarkMode, teamAvg, color
}: { 
    title: string; 
    data: { name: string; value: number }[]; 
    dataKey: string; 
    isDarkMode: boolean; 
    teamAvg: number;
    color: { line: string; bar: string };
}) => {
    const textColor = isDarkMode ? '#9ca3af' : '#6b7280';
    const gridColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

    return (
        <div className="space-y-4">
            <h4 className={`text-sm font-bold tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Line Chart */}
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-white/60 border-gray-100'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <TrendingUp className="w-3 h-3" /> Gráfico de Linhas
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 10 }} tickLine={false} axisLine={{ stroke: gridColor }} />
                            <YAxis tick={{ fill: textColor, fontSize: 10 }} tickLine={false} axisLine={{ stroke: gridColor }} allowDecimals={false} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: isDarkMode ? '#1f2937' : '#fff', 
                                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`, 
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                                }} 
                            />
                            <ReferenceLine y={teamAvg} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={2} label={{ value: `Média: ${teamAvg.toFixed(1)}`, fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
                            <Line type="monotone" dataKey="value" stroke={color.line} strokeWidth={3} dot={{ fill: color.line, r: 5, strokeWidth: 2, stroke: isDarkMode ? '#111' : '#fff' }} activeDot={{ r: 7, strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                {/* Bar Chart */}
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-white/60 border-gray-100'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <BarChart3 className="w-3 h-3" /> Gráfico de Barras
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 10 }} tickLine={false} axisLine={{ stroke: gridColor }} />
                            <YAxis tick={{ fill: textColor, fontSize: 10 }} tickLine={false} axisLine={{ stroke: gridColor }} allowDecimals={false} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: isDarkMode ? '#1f2937' : '#fff', 
                                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`, 
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                                }} 
                            />
                            <ReferenceLine y={teamAvg} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={2} label={{ value: `Média: ${teamAvg.toFixed(1)}`, fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
                            <Bar dataKey="value" fill={color.bar} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE CARD DO REVISOR ---
const ReviewerCard = ({
    revisorKey, charts, isDarkMode, accentColor
}: {
    revisorKey: string;
    charts: { title: string; data: { name: string; value: number }[]; teamAvg: number }[];
    isDarkMode: boolean;
    accentColor: string;
}) => {
    const name = REVISORES[revisorKey] || revisorKey;
    const colors = CHART_COLORS[revisorKey as keyof typeof CHART_COLORS] || { line: '#3b82f6', bar: '#60a5fa' };

    return (
        <Card className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl shadow-xl mb-8 ${
            isDarkMode ? 'bg-[#111]/60 border-white/10 shadow-black/30' : 'bg-white/80 border-gray-200 shadow-gray-200/50'
        }`}>
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm`} style={{ backgroundColor: accentColor }}>
                    {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <h3 className="text-lg font-black tracking-tight">{name}</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Métricas individuais</p>
                </div>
            </div>
            <div className="space-y-8">
                {charts.map((chart, i) => (
                    <DualChart key={i} title={chart.title} data={chart.data} dataKey="value" isDarkMode={isDarkMode} teamAvg={chart.teamAvg} color={colors} />
                ))}
            </div>
        </Card>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function MetricasPage() {
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState<'form' | 'charts' | 'tabela'>('form');
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

    // Dados dos gráficos e Tabela
    const [metricsData, setMetricsData] = useState<MetricRecord[]>([]);
    const [chartsLoading, setChartsLoading] = useState(false);
    
    // Edição
    const [editingMetric, setEditingMetric] = useState<MetricRecord | null>(null);

    // Usa rota de proxy do Next.js (mesmo servidor, sem problemas de rede)
    const fetchMetrics = useCallback(async () => {
        setChartsLoading(true);
        try {
            const res = await fetch('/api/metrics');
            const json = await res.json();
            if (res.ok) {
                setMetricsData(json.metrics || []);
            } else {
                console.error("Erro do servidor:", json);
            }
        } catch (err) {
            console.error('Falha de conexão ao buscar métricas:', err);
        } finally {
            setChartsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'charts' || activeTab === 'tabela') {
            fetchMetrics();
        }
    }, [activeTab, fetchMetrics]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = { 
                tipo, revisor, modelo, issues, 
                idiomaUG, idiomaSTMS, stringsRevisadas, 
                qsgCriados, ugCriados, revisoes, requests 
            };
            
            const response = await fetch('/api/metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro do servidor (${response.status}): ${errorText}`);
            }

            alert('Métricas salvas com sucesso!');
            
            setModelo(''); setIssues(''); setIdiomaUG(''); setIdiomaSTMS('');
            setStringsRevisadas(''); setQsgCriados(''); setUgCriados('');
            setRevisoes(''); setRequests('');
            
        } catch (error: any) {
            console.error(error);
            alert(`Falha ao salvar:\n\n${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- HELPERS PARA GRÁFICOS ---
    const buildChartData = (records: MetricRecord[], valueField: keyof MetricRecord): { name: string; value: number }[] => {
        return records.map((r, i) => ({
            name: r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : `#${i + 1}`,
            value: (r[valueField] as number) || 0
        }));
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta métrica? Esta ação não pode ser desfeita.')) return;
        
        try {
            const res = await fetch(`/api/metrics/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Erro ao excluir métrica');
            setMetricsData(prev => prev.filter(m => m.id !== id));
            alert('Métrica excluída com sucesso!');
        } catch (error: any) {
            console.error(error);
            alert(`Falha ao excluir: ${error.message}`);
        }
    };

    const handleEditSave = async () => {
        if (!editingMetric) return;
        try {
            const res = await fetch(`/api/metrics/${editingMetric.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingMetric)
            });
            if (!res.ok) throw new Error('Erro ao atualizar métrica');
            
            // Atualiza local
            setMetricsData(prev => prev.map(m => m.id === editingMetric.id ? editingMetric : m));
            setEditingMetric(null);
            alert('Métrica atualizada com sucesso!');
        } catch (error: any) {
            console.error(error);
            alert(`Falha ao atualizar: ${error.message}`);
        }
    };
        const values = allRecords.map(r => (r[valueField] as number) || 0).filter(v => v > 0);
        if (values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    };

    const buildReviewerCharts = (
        tipo: string,
        revisorKey: string,
        allOfType: MetricRecord[]
    ): { title: string; data: { name: string; value: number }[]; teamAvg: number }[] => {
        const charts: { title: string; data: { name: string; value: number }[]; teamAvg: number }[] = [];
        const mine = allOfType.filter(m => m.revisor === revisorKey);

        if (tipo === 'Revisao Manual UG') {
            const ingles = mine.filter(m => m.idiomaUG === 'Revisao Ingles-Latin');
            const espanhol = mine.filter(m => m.idiomaUG === 'Revisao Espanhol-Latin');
            const allIngles = allOfType.filter(m => m.idiomaUG === 'Revisao Ingles-Latin');
            const allEspanhol = allOfType.filter(m => m.idiomaUG === 'Revisao Espanhol-Latin');

            charts.push({ title: 'Issues Encontradas — Inglês-Latin', data: buildChartData(ingles, 'issues'), teamAvg: calcTeamAvg(allIngles, 'issues') });
            charts.push({ title: 'Issues Encontradas — Espanhol-Latin', data: buildChartData(espanhol, 'issues'), teamAvg: calcTeamAvg(allEspanhol, 'issues') });
            // Modelos revisados: count per entry
            charts.push({ title: 'Modelos Revisados — Inglês-Latin', data: ingles.map((r, i) => ({ name: r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : `#${i+1}`, value: 1 })), teamAvg: allIngles.length > 0 ? allIngles.length / Object.keys(REVISORES).length : 0 });
            charts.push({ title: 'Modelos Revisados — Espanhol-Latin', data: espanhol.map((r, i) => ({ name: r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : `#${i+1}`, value: 1 })), teamAvg: allEspanhol.length > 0 ? allEspanhol.length / Object.keys(REVISORES).length : 0 });
        } else if (tipo === 'Revisao STMS') {
            const ptBr = mine.filter(m => m.idiomaSTMS === 'Revisao Portugues-Brasil');
            const esLat = mine.filter(m => m.idiomaSTMS === 'Revisao Espanhol-Latin');
            const allPtBr = allOfType.filter(m => m.idiomaSTMS === 'Revisao Portugues-Brasil');
            const allEsLat = allOfType.filter(m => m.idiomaSTMS === 'Revisao Espanhol-Latin');

            charts.push({ title: 'Strings Revisadas — Português-Brasil', data: buildChartData(ptBr, 'stringsRevisadas'), teamAvg: calcTeamAvg(allPtBr, 'stringsRevisadas') });
            charts.push({ title: 'Strings Revisadas — Espanhol-Latin', data: buildChartData(esLat, 'stringsRevisadas'), teamAvg: calcTeamAvg(allEsLat, 'stringsRevisadas') });
            charts.push({ title: 'Issues Encontradas — Português-Brasil', data: buildChartData(ptBr, 'issues'), teamAvg: calcTeamAvg(allPtBr, 'issues') });
            charts.push({ title: 'Issues Encontradas — Espanhol-Latin', data: buildChartData(esLat, 'issues'), teamAvg: calcTeamAvg(allEsLat, 'issues') });
        } else if (tipo === 'Desenvolvimento QSG') {
            charts.push({ title: 'QSG Criados', data: buildChartData(mine, 'qsgCriados'), teamAvg: calcTeamAvg(allOfType, 'qsgCriados') });
        } else if (tipo === 'Desenvolvimento UG') {
            charts.push({ title: 'UG Criados', data: buildChartData(mine, 'ugCriados'), teamAvg: calcTeamAvg(allOfType, 'ugCriados') });
        } else if (tipo === 'Proofread accessories') {
            charts.push({ title: 'Revisões Realizadas', data: buildChartData(mine, 'revisoes'), teamAvg: calcTeamAvg(allOfType, 'revisoes') });
            charts.push({ title: 'Issues Encontradas', data: buildChartData(mine, 'issues'), teamAvg: calcTeamAvg(allOfType, 'issues') });
        } else if (tipo === 'TEM Request') {
            charts.push({ title: 'Requests Realizados', data: buildChartData(mine, 'requests'), teamAvg: calcTeamAvg(allOfType, 'requests') });
        }

        return charts;
    };

    // --- RENDER SEÇÃO DE GRÁFICOS ---
    const renderChartsSection = () => {
        if (chartsLoading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                    <span className="ml-3 text-sm font-medium opacity-60">Carregando métricas...</span>
                </div>
            );
        }

        if (metricsData.length === 0) {
            return (
                <div className={`text-center py-20 rounded-2xl border ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50'}`}>
                    <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                    <h3 className="text-xl font-black mb-2">Nenhuma métrica registrada</h3>
                    <p className={`text-sm max-w-md mx-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Comece registrando dados na aba &quot;Entrada de Métricas&quot; para visualizar os gráficos aqui.
                    </p>
                </div>
            );
        }

        const categories = [
            { tipo: 'Revisao Manual UG', label: 'Revisão Manual UG', accent: '#3b82f6', icon: <FileText className="w-5 h-5" /> },
            { tipo: 'Revisao STMS', label: 'Revisão STMS', accent: '#a855f7', icon: <Box className="w-5 h-5" /> },
            { tipo: 'Desenvolvimento QSG', label: 'Desenvolvimento QSG', accent: '#14b8a6', icon: <Code className="w-5 h-5" /> },
            { tipo: 'Desenvolvimento UG', label: 'Desenvolvimento UG', accent: '#f97316', icon: <Wrench className="w-5 h-5" /> },
            { tipo: 'Proofread accessories', label: 'Proofread Accessories', accent: '#ec4899', icon: <CheckSquare className="w-5 h-5" /> },
            { tipo: 'TEM Request', label: 'TEM Request', accent: '#06b6d4', icon: <FileUp className="w-5 h-5" /> },
        ];

        return (
            <div className="space-y-12">
                {categories.map(cat => {
                    const allOfType = metricsData.filter(m => m.tipo === cat.tipo);
                    if (allOfType.length === 0) return null;

                    const uniqueRevisores = [...new Set(allOfType.map(m => m.revisor))];

                    return (
                        <div key={cat.tipo}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: cat.accent }}>
                                    {cat.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">{cat.label}</h2>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{allOfType.length} registros</p>
                                </div>
                            </div>
                            {uniqueRevisores.map(rev => (
                                <ReviewerCard
                                    key={rev}
                                    revisorKey={rev}
                                    charts={buildReviewerCharts(cat.tipo, rev, allOfType)}
                                    isDarkMode={isDarkMode}
                                    accentColor={cat.accent}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    // --- RENDER SEÇÃO DE TABELA ---
    const renderTableSection = () => {
        if (chartsLoading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                </div>
            );
        }

        if (metricsData.length === 0) {
            return (
                <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <TableIcon className={`w-16 h-16 mx-auto mb-6 opacity-20 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                    <h3 className="text-xl font-black mb-2">Nenhuma métrica registrada</h3>
                    <p className={`text-sm max-w-md mx-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Comece registrando dados na aba &quot;Entrada de Métricas&quot; para visualizar a tabela.
                    </p>
                </div>
            );
        }

        return (
            <Card className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                isDarkMode ? 'bg-[#111]/60 border-white/10 shadow-black/30' : 'bg-white/80 border-gray-200 shadow-gray-200/50'
            }`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className={`text-xs uppercase bg-opacity-50 ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                                <th className="px-4 py-3">Tipo</th>
                                <th className="px-4 py-3">Revisor</th>
                                <th className="px-4 py-3">Data</th>
                                <th className="px-4 py-3 rounded-tr-lg text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metricsData.slice().reverse().map(m => (
                                <tr key={m.id} className={`border-b last:border-0 ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                                    <td className="px-4 py-3 font-medium">#{m.id}</td>
                                    <td className="px-4 py-3">{m.tipo}</td>
                                    <td className="px-4 py-3">{REVISORES[m.revisor] || m.revisor}</td>
                                    <td className="px-4 py-3">{m.created_at ? new Date(m.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => setEditingMetric(m)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors mr-2">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(m.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MODAL DE EDIÇÃO */}
                {editingMetric && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                        <Card className={`w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border shadow-2xl ${
                            isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'
                        }`}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black">Editar Métrica #{editingMetric.id}</h3>
                                <button onClick={() => setEditingMetric(null)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <Label className="mb-1 block">Tipo</Label>
                                    <Input value={editingMetric.tipo} disabled className="opacity-50" />
                                </div>
                                <div>
                                    <Label className="mb-1 block">Revisor</Label>
                                    <select 
                                        value={editingMetric.revisor} 
                                        onChange={e => setEditingMetric({...editingMetric, revisor: e.target.value})}
                                        className={`w-full h-10 px-3 rounded-md border text-sm ${isDarkMode ? 'bg-black border-white/20' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="denise.martins">Denise Martins</option>
                                        <option value="edgard.cunha">Edgard Cunha</option>
                                    </select>
                                </div>

                                {editingMetric.tipo === 'Revisao Manual UG' && (
                                    <>
                                        <div>
                                            <Label className="mb-1 block">Idioma</Label>
                                            <select 
                                                value={editingMetric.idiomaUG || ''} 
                                                onChange={e => setEditingMetric({...editingMetric, idiomaUG: e.target.value})}
                                                className={`w-full h-10 px-3 rounded-md border text-sm ${isDarkMode ? 'bg-black border-white/20' : 'bg-white border-gray-300'}`}
                                            >
                                                <option value="Revisao Espanhol-Latin">Espanhol-Latin</option>
                                                <option value="Revisao Ingles-Latin">Inglês-Latin</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="mb-1 block">Issues Encontradas</Label>
                                            <Input type="number" value={editingMetric.issues || ''} onChange={e => setEditingMetric({...editingMetric, issues: parseInt(e.target.value) || 0})} />
                                        </div>
                                    </>
                                )}

                                {editingMetric.tipo === 'Revisao STMS' && (
                                    <>
                                        <div>
                                            <Label className="mb-1 block">Idioma</Label>
                                            <select 
                                                value={editingMetric.idiomaSTMS || ''} 
                                                onChange={e => setEditingMetric({...editingMetric, idiomaSTMS: e.target.value})}
                                                className={`w-full h-10 px-3 rounded-md border text-sm ${isDarkMode ? 'bg-black border-white/20' : 'bg-white border-gray-300'}`}
                                            >
                                                <option value="Revisao Espanhol-Latin">Espanhol-Latin</option>
                                                <option value="Revisao Portugues-Brasil">Português-Brasil</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="mb-1 block">Strings Revisadas</Label>
                                            <Input type="number" value={editingMetric.stringsRevisadas || ''} onChange={e => setEditingMetric({...editingMetric, stringsRevisadas: parseInt(e.target.value) || 0})} />
                                        </div>
                                        <div>
                                            <Label className="mb-1 block">Issues Encontradas</Label>
                                            <Input type="number" value={editingMetric.issues || ''} onChange={e => setEditingMetric({...editingMetric, issues: parseInt(e.target.value) || 0})} />
                                        </div>
                                    </>
                                )}

                                {editingMetric.tipo === 'Desenvolvimento QSG' && (
                                    <div>
                                        <Label className="mb-1 block">QSG Criados</Label>
                                        <Input type="number" value={editingMetric.qsgCriados || ''} onChange={e => setEditingMetric({...editingMetric, qsgCriados: parseInt(e.target.value) || 0})} />
                                    </div>
                                )}

                                {editingMetric.tipo === 'Desenvolvimento UG' && (
                                    <div>
                                        <Label className="mb-1 block">UG Criados</Label>
                                        <Input type="number" value={editingMetric.ugCriados || ''} onChange={e => setEditingMetric({...editingMetric, ugCriados: parseInt(e.target.value) || 0})} />
                                    </div>
                                )}

                                {editingMetric.tipo === 'Proofread accessories' && (
                                    <>
                                        <div>
                                            <Label className="mb-1 block">Revisões Realizadas</Label>
                                            <Input type="number" value={editingMetric.revisoes || ''} onChange={e => setEditingMetric({...editingMetric, revisoes: parseInt(e.target.value) || 0})} />
                                        </div>
                                        <div>
                                            <Label className="mb-1 block">Issues Encontradas</Label>
                                            <Input type="number" value={editingMetric.issues || ''} onChange={e => setEditingMetric({...editingMetric, issues: parseInt(e.target.value) || 0})} />
                                        </div>
                                    </>
                                )}

                                {editingMetric.tipo === 'TEM Request' && (
                                    <div>
                                        <Label className="mb-1 block">Requests</Label>
                                        <Input type="number" value={editingMetric.requests || ''} onChange={e => setEditingMetric({...editingMetric, requests: parseInt(e.target.value) || 0})} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-8">
                                <Button variant="outline" onClick={() => setEditingMetric(null)}>Cancelar</Button>
                                <Button onClick={handleEditSave} className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                                    <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </Card>
        );
    };

    return (
        <div className={`min-h-screen font-sans flex flex-col items-center transition-colors duration-1000 ${isDarkMode ? "bg-[#050505] text-gray-200" : "bg-[#f5f5f7] text-gray-800"}`}>
            <AIBackground isDarkMode={isDarkMode} />

            <Navbar />

            <div className="w-full max-w-6xl px-4 pt-32 pb-12 relative z-10 flex flex-col min-h-screen">
                <div className="text-center mb-10 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-4 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Controle de Qualidade</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        {activeTab === 'form' ? (
                            <>Entrada de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">métricas</span></>
                        ) : (
                            <>Análise <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">gráfica</span></>
                        )}
                    </h1>
                    <p className={`text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activeTab === 'form' 
                            ? 'Preencha o formulário abaixo para registrar os dados das análises realizadas.'
                            : activeTab === 'charts'
                            ? 'Visualize o desempenho de cada revisor com gráficos comparativos.'
                            : 'Visualize, edite ou exclua métricas já registradas no sistema.'
                        }
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-10">
                    <div className={`inline-flex rounded-2xl p-1.5 border shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <button
                            onClick={() => setActiveTab('form')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === 'form'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                    : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <PenLine className="w-4 h-4" />
                            Entrada de Métricas
                        </button>
                        <button
                            onClick={() => setActiveTab('charts')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === 'charts'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                    : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <TrendingUp className="w-4 h-4" />
                            Análise Gráfica
                        </button>
                        <button
                            onClick={() => setActiveTab('tabela')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === 'tabela'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                    : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <TableIcon className="w-4 h-4" />
                            Tabela de Dados
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                {activeTab === 'form' && (
                    <Card className={`p-6 md:p-10 rounded-3xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 fade-in duration-500 ${isDarkMode ? 'bg-[#111]/80 border-white/10 shadow-black/50' : 'bg-white/90 border-gray-200 shadow-gray-200/50'}`}>
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
                )}
                
                {activeTab === 'charts' && renderChartsSection()}
                
                {activeTab === 'tabela' && renderTableSection()}
            </div>
        </div>
    );
}
