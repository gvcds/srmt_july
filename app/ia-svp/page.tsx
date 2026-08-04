'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
    Cpu,
    BrainCircuit,
    Sparkles,
    Ticket as TicketIcon,
    FileText,
    CalendarDays,
    AlertCircle,
    Zap,
    Bot,
    ChevronRight,
    Search,
    X,
    Loader2,
    CheckCircle2,
    Send,
    RotateCcw,
    User,
    Minus,
    Square,
    Plus,
    MessageSquare,
    Trash2,
    History,
    Maximize2,
    Minimize2,
    Download,
    Mail,
    Database,
    ArrowRight
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Navbar } from "@/components/navbar";
import { useTheme } from '@/components/theme-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { STMSDBTool } from '@/components/stms-db-tool';
import { STMSXmlTool } from '@/components/stms-xml-tool';
import { AIChart } from '@/components/ui/ai-chart';

// --- INTERFACES ---
interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    updatedAt: number;
}

interface AnalysisState {
    id: string;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isAnalyzing: boolean;
    result: string;
}

type Language = 'pt' | 'en' | 'ko';

// --- COMPONENTE ESTRELA DE NÊUTRON 3D (VERSÃO SUPREMA SUAVIZADA + NEON) ---
const NeutronStar = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const coreRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const jet1Ref = useRef<THREE.Mesh>(null);
    const jet2Ref = useRef<THREE.Mesh>(null);
    const particlesRef = useRef<THREE.Points>(null);
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current) groupRef.current.rotation.y = time * 0.05;
        if (coreRef.current) {
            coreRef.current.rotation.y = time * 0.5;
            coreRef.current.rotation.z = time * 0.2;
            const s = 1 + Math.sin(time * 2) * 0.02;
            coreRef.current.scale.set(s, s, s);
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y = -time * 0.3;
            const s = 1.1 + Math.cos(time * 1.5) * 0.05;
            atmosphereRef.current.scale.set(s, s, s);
        }
        if (glowRef.current) {
            const s = 1.4 + Math.sin(time * 1.5) * 0.1;
            glowRef.current.scale.set(s, s, s);
        }
        if (ring1Ref.current) ring1Ref.current.rotation.z = time * 0.2;
        if (ring2Ref.current) ring2Ref.current.rotation.z = -time * 0.3;

        if (particlesRef.current) {
            particlesRef.current.rotation.y = time * 0.1;
            particlesRef.current.rotation.x = time * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={20} color="#4f46e5" />
            <pointLight position={[-10, -10, -10]} intensity={15} color="#9333ea" />
            <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={30} color="#ffffff" />

            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Sphere ref={coreRef} args={[1, 64, 64]}>
                    <MeshDistortMaterial color="#ffffff" emissive="#4f46e5" emissiveIntensity={15} distort={0.3} speed={3} metalness={1} roughness={0} />
                </Sphere>

                <Sphere ref={glowRef} args={[1.1, 64, 64]}>
                    <meshBasicMaterial color="#6366f1" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
                </Sphere>

                <Sphere ref={atmosphereRef} args={[1.2, 64, 64]}>
                    <MeshWobbleMaterial color="#4f46e5" emissive="#818cf8" emissiveIntensity={10} transparent opacity={0.2} factor={1} speed={2} />
                </Sphere>

                <mesh ref={ring1Ref} rotation={[Math.PI / 2.5, 0, 0]}>
                    <torusGeometry args={[3, 0.04, 16, 100]} />
                    <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={30} transparent opacity={0.7} blending={THREE.AdditiveBlending} />
                </mesh>
                <mesh ref={ring2Ref} rotation={[Math.PI / 1.4, 0, 0]}>
                    <torusGeometry args={[3.6, 0.02, 16, 100]} />
                    <meshStandardMaterial color="#9333ea" emissive="#7c3aed" emissiveIntensity={25} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
                </mesh>

                {[0, 45, 90, 135].map((rot, i) => (
                    <mesh key={i} rotation={[0, (rot * Math.PI) / 180, 0]}>
                        <torusGeometry args={[4.2, 0.002, 16, 100]} />
                        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} />
                    </mesh>
                ))}

                <points ref={particlesRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={3000}
                            args={[new Float32Array(9000).map(() => (Math.random() - 0.5) * 20), 3]}
                        />
                    </bufferGeometry>
                    <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} sizeAttenuation />
                </points>
            </Float>

            <Stars radius={300} depth={120} count={15000} factor={10} saturation={1} fade speed={2} />
        </group>
    );
};

// --- HELPER DE FORMATAÇÃO MARKDOWN BÁSICO ---
const formatMarkdown = (text: string, isDarkMode: boolean) => {
    if (!text) return "";

    // 1. Normalização Ultra-Resiliente
    let processedText = text
        // CORREÇÃO PARA "| |" ou "||": Converte em quebras de linha reais
        .replace(/\|\s*\|\s*/g, '|\n| ')
        .replace(/\|{2,}/g, '|\n|')
        // Garante que tabelas coladas em texto comum tenham espaço
        .replace(/([^\n])(\n\|)/g, '$1\n\n$2')
        .replace(/(\|\n)([^\n|])/g, '$1\n\n$2');

    // 2. Fallback: Se houver blocos de pipes sem linha divisória (|---|), nós inserimos uma
    const lines = processedText.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const currentLine = lines[i].trim();
        if (currentLine.startsWith('|') && currentLine.includes('|', 1)) {
            const nextLine = (lines[i + 1] || "").trim();
            // Se não houver linha divisória abaixo desta linha que parece cabeçalho
            if (nextLine && !nextLine.includes('|-') && !nextLine.includes('-|') && nextLine.startsWith('|')) {
                const pipeCount = (currentLine.match(/\|/g) || []).length;
                if (pipeCount > 1) {
                    const separator = '|' + '---|'.repeat(pipeCount - 1);
                    lines.splice(i + 1, 0, separator);
                    i++;
                }
            }
        }
    }
    processedText = lines.join('\n');

    let html = processedText;

    // 3. Suporte a Tabelas (Versão Adaptativa)
    const tableRegex = /((?:\|?.+?\|.+?\|?.*?\n)+(?:\s*\|?[:\s-]+\|[:\s-]+\|?.*?\n)(?:(?:\|?.+?\|.+?\|?.*?\n?)*))/g;

    html = html.replace(tableRegex, (match) => {
        const tableLines = match.trim().split(/\r?\n/);
        if (tableLines.length < 2) return match;

        const dividerIndex = tableLines.findIndex(l => l.includes('|-') || l.includes('-|') || l.match(/\|[\s-:]+\|/));
        if (dividerIndex === -1) return match;

        const headerLine = tableLines[dividerIndex - 1] || "";
        const bodyLines = tableLines.slice(dividerIndex + 1);

        const parseRow = (row: string) => {
            let cells = row.split('|').map(c => c.trim());
            if (row.trim().startsWith('|')) cells.shift();
            if (row.trim().endsWith('|')) cells.pop();
            return cells;
        };

        const headers = parseRow(headerLine).map(h =>
            `<th class="px-4 py-3 border-b-2 font-bold text-left ${isDarkMode ? 'border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] text-[#ffffff]' : 'border-[#d1d5db] bg-[#f3f4f6] text-[#111827]'}">${h || "&nbsp;"}</th>`
        ).join('');

        const tableRows = bodyLines.map(r => {
            if (!r.trim().includes('|')) return '';
            const cells = parseRow(r).map(c =>
                `<td class="px-4 py-2 border-b ${isDarkMode ? 'border-[rgba(255,255,255,0.1)] text-[#e5e7eb]' : 'border-[#e5e7eb] text-[#1f2937]'}">${c || "&nbsp;"}</td>`
            ).join('');
            return `<tr class="${isDarkMode ? 'hover:bg-[rgba(255,255,255,0.05)]' : 'hover:bg-[rgba(0,0,0,0.05)]'} transition-colors">${cells}</tr>`;
        }).join('');

        return `<div class="overflow-x-auto my-6 rounded-xl border-2 ${isDarkMode ? 'border-[rgba(255,255,255,0.1)]' : 'border-[#e5e7eb]'} shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
 <table class="min-w-full text-sm border-collapse bg-transparent">
 <thead><tr>${headers}</tr></thead>
 <tbody>${tableRows}</tbody>
 </table>
 </div>`;
    });

    // 4. Headers e Estilização
    html = html.replace(/^\s*####\s*(.*$)/gm, `<h4 class="text-base font-bold ${isDarkMode ? 'text-[#60a5fa]' : 'text-[#2563eb]'} mt-5 mb-2 flex items-center gap-2"><span class="w-1 h-4 bg-current rounded-lg"></span>$1</h4>`);
    html = html.replace(/^\s*###\s*(.*$)/gm, `<h3 class="text-lg font-bold ${isDarkMode ? 'text-[#ffffff]' : 'text-[#111827]'} mt-6 mb-3">$1</h3>`);
    html = html.replace(/^\s*##\s*(.*$)/gm, `<h2 class="text-xl font-bold ${isDarkMode ? 'text-[#ffffff]' : 'text-[#111827]'} mt-8 mb-4 border-b-2 ${isDarkMode ? 'border-[rgba(255,255,255,0.1)]' : 'border-[#e5e7eb]'} pb-2">$1</h2>`);
    html = html.replace(/^\s*#\s*(.*$)/gm, `<h1 class="text-2xl font-bold ${isDarkMode ? 'text-[#ffffff]' : 'text-[#111827]'} mt-10 mb-6">$1</h1>`);

    // 3. Separadores
    html = html.replace(/^\s*([-*_]){3,}\s*$/gm, `<div class="my-8 border-t-2 ${isDarkMode ? 'border-[rgba(255,255,255,0.1)]' : 'border-[#e5e7eb]'}"></div>`);

    // 4. Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#3b82f6]">$1</strong>');

    // 5. Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic opacity-90">$1</em>');

    // 6. Lists
    html = html.replace(/^[*-] (.*$)/gm, `<div class="flex items-start gap-3 mb-2 ml-2"><div class="w-1.5 h-1.5 rounded-lg bg-[#3b82f6] mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div><span class="${isDarkMode ? 'text-[#f3f4f6]' : 'text-[#111827]'}">$1</span></div>`);
    html = html.replace(/^(\d+)\. (.*$)/gm, `<div class="flex items-start gap-3 mb-2 ml-2"><span class="text-[#3b82f6] font-bold w-5 shrink-0 text-right">$1.</span><span class="${isDarkMode ? 'text-[#f3f4f6]' : 'text-[#111827]'}">$2</span></div>`);

    // 7. Code
    html = html.replace(/`(.*?)`/g, `<code class="${isDarkMode ? 'bg-[rgba(255,255,255,0.15)] text-[#93c5fd]' : 'bg-[#e5e7eb] text-[#1d4ed8]'} px-1.5 py-0.5 rounded font-mono text-[12px] border ${isDarkMode ? 'border-[rgba(255,255,255,0.1)]' : 'border-[rgba(0,0,0,0.1)]'}">$1</code>`);

    // 8. Blockquotes
    html = html.replace(/^> (.*$)/gm, `<div class="border-l-4 border-[#3b82f6] ${isDarkMode ? 'bg-[rgba(255,255,255,0.05)] text-[#e5e7eb]' : 'bg-[#eff6ff] text-[#1f2937]'} px-5 py-3 italic my-6 rounded-r-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">$1</div>`);

    return html;
};

// --- COMPONENTE PARA RENDERIZAR CONTEÚDO (MARKDOWN + GRÁFICOS) ---
const MarkdownContent = ({ content, isDarkMode }: { content: string, isDarkMode: boolean }) => {
    const chartRegex = /```json:chart\n([\s\S]*?)\n```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = chartRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
        }
        try {
            parts.push({ type: 'chart', content: JSON.parse(match[1]) });
        } catch (e) {
            console.error("Erro ao processar JSON do gráfico:", e);
            parts.push({ type: 'text', content: match[0] });
        }
        lastIndex = chartRegex.lastIndex;
    }

    if (lastIndex < content.length) {
        parts.push({ type: 'text', content: content.substring(lastIndex) });
    }

    if (parts.length === 0 && content) {
        parts.push({ type: 'text', content: content });
    }

    return (
        <>
            {parts.map((part, i) => {
                if (part.type === 'chart') {
                    return (
                        <div key={i} className="my-8 animate-in fade-in zoom-in-95 duration-700">
                            <AIChart
                                type={part.content.type || 'bar'}
                                title={part.content.title || 'Análise de Dados'}
                                data={part.content.data || part.content}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    );
                }
                return (
                    <div
                        key={i}
                        className="prose-custom max-w-none whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(part.content as string, isDarkMode) }}
                    />
                );
            })}
        </>
    );
};

// --- COMPONENTE DE MENSAGEM COM EFEITO DE ESCRITA ---
const TypewriterMessage = ({ content, role, isDarkMode, isLatest }: { content: string, role: string, isDarkMode: boolean, isLatest?: boolean }) => {
    const [displayedContent, setDisplayedContent] = useState(isLatest ? '' : content);
    const [index, setIndex] = useState(isLatest ? 0 : content.length);
    const [emailStatus, setEmailStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const messageRef = useRef<HTMLDivElement>(null);
    const hasChart = content.includes('```json:chart');

    const API_URL = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:8001`
        : '';

    // Lógica de exportação para PDF (Corrigida para evitar erro de cor lab)
    const exportToPDF = async () => {
        if (!messageRef.current) return;
        try {
            const element = messageRef.current;
            const canvas = await html2canvas(element, {
                backgroundColor: isDarkMode ? '#171717' : '#ffffff',
                scale: 2,
                useCORS: true,
                logging: false,
                onclone: (doc) => {
                    const el = doc.querySelector('[ref="messageRef"]') as HTMLElement;
                    if (el) el.style.color = isDarkMode ? '#ffffff' : '#000000';
                }
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`svp-resposta-${Date.now()}.pdf`);
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
        }
    };

    // Lógica de exportação para E-mail com processamento de IA
    const shareViaEmail = async () => {
        if (emailStatus === 'processing') return;

        setEmailStatus('processing');
        try {
            const res = await fetch(`${API_URL}/ai/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: `Você é um conversor extritamente técnico. Converta a mensagem do usuário (que está em Markdown) para **TEXTO PURO ABSOLUTO** (Plain Text). 
REGRAS OBRIGATÓRIAS:
1. NÃO use nenhum símbolo Markdown (remova asteriscos *, sublinhados _, crases \`, sinais >, e #).
2. Para listas, use apenas números seguidos de ponto (1., 2.) ou traços simples (-), com a quebra de linha normal.
3. REMOVA completamente qualquer bloco que comece com \`\`\`json:chart. Ignore e delete esses blocos e seus conteúdos.
4. NUNCA envie formatações de tabela, transforme os dados da tabela em uma lista simples legível.
5. O resultado deve ser direto, profissional e 100% texto puro pronto para ser colado em um e-mail tradicional.`
                        },
                        { role: 'user', content: content }
                    ],
                    stream: false
                })
            });

            if (res.ok) {
                const data = await res.json();
                let cleanText = data.message?.content || data.choices?.[0]?.message?.content || content;

                // Camada de segurança extra no frontend para remover marcação residual e blocos json
                cleanText = cleanText.replace(/```json:chart[\s\S]*?```/g, '');
                cleanText = cleanText.replace(/[*_~`#]/g, '');

                const subject = encodeURIComponent("Relatório SVP Assistant");
                const body = encodeURIComponent(cleanText.trim() + "\n\n---\nRelatório gerado via SVP AI");

                setEmailStatus('success');
                setTimeout(() => setEmailStatus('idle'), 3000);

                window.location.href = `mailto:?subject=${subject}&body=${body}`;
            } else {
                throw new Error("Erro na IA");
            }
        } catch (error) {
            console.error("Erro ao processar e-mail:", error);
            setEmailStatus('idle');
            alert("Não foi possível formatar o e-mail no momento.");
        }
    };


    useEffect(() => {
        // Se não for a última mensagem, exibe tudo imediatamente
        if (!isLatest) {
            setDisplayedContent(content);
            setIndex(content.length);
            return;
        }

        if (role === 'assistant' && index < content.length) {
            // LÓGICA PARA RENDERIZAR GRÁFICO INSTANTANEAMENTE
            const remainingContent = content.substring(index);
            if (remainingContent.startsWith('```json:chart')) {
                const endBlockIndex = content.indexOf('```', index + 13);
                if (endBlockIndex !== -1) {
                    const fullBlockEnd = endBlockIndex + 3;
                    setDisplayedContent(content.substring(0, fullBlockEnd));
                    setIndex(fullBlockEnd);
                    return;
                }
            }

            const timeout = setTimeout(() => {
                setDisplayedContent(content.substring(0, index + 1));
                setIndex(prev => prev + 1);
            }, 5);
            return () => clearTimeout(timeout);
        } else if (role === 'user') {
            setDisplayedContent(content);
            setIndex(content.length);
        }
    }, [index, content, role, isLatest]);

    return (
        <div className={`${hasChart ? 'w-full' : 'max-w-[90%]'} group relative p-5 rounded-xl text-[15px] leading-relaxed shadow-sm transition-all duration-500 ${role === 'user'
                ? 'bg-[#2563eb] text-[#ffffff] ml-auto'
                : (isDarkMode ? 'bg-[#262626] text-[#f3f4f6] border border-[rgba(255,255,255,0.05)]' : 'bg-[#f0f0f2] text-[#111827] border border-[#e5e7eb]')
            }`}>
            <div ref={messageRef} className="w-full">
                <MarkdownContent content={displayedContent} isDarkMode={isDarkMode} />
            </div>

            {/* Botões de Ação (Aparecem no Hover) */}
            {role === 'assistant' && index >= content.length && (
                <div className="absolute top-2 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={shareViaEmail}
                        disabled={emailStatus === 'processing'}
                        className={`p-1.5 rounded-lg transition-all ${emailStatus === 'processing' ? 'animate-pulse text-blue-500' :
                                emailStatus === 'success' ? 'bg-green-500/20 text-green-500' :
                                    isDarkMode ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'
                            }`}
                        title={emailStatus === 'processing' ? "IA Processando texto puro..." : "Enviar por E-mail (Texto Puro)"}
                    >
                        {emailStatus === 'processing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                    </button>
                </div>
            )}
        </div>
    );
};

// --- COMPONENTE DE BOLINHA FLUTUANTE (MINIMIZADO) ---
const FloatingAnalysisBubble = ({
    title,
    isAnalyzing,
    onOpen,
    isDarkMode,
    index = 0
}: {
    title: string;
    isAnalyzing: boolean;
    onOpen: () => void;
    isDarkMode: boolean;
    index?: number;
}) => {
    return (
        <div
            onClick={onOpen}
            className={`fixed z-[150] cursor-pointer group animate-in zoom-in duration-300`}
            style={{ bottom: `${40 + (index * 80)}px`, right: '40px' }}
        >
            <div className={`relative w-16 h-16 rounded-lg flex items-center justify-center shadow-2xl transition-all duration-500 hover: 
 ${isAnalyzing
                    ? 'bg-blue-600 animate-pulse'
                    : 'bg-green-500 shadow-green-500/20'}`}>

                {isAnalyzing ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                    <CheckCircle2 className="w-8 h-8 text-white" />
                )}

                {/* Tooltip Label */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-black/80 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {title} ({isAnalyzing ? 'Processando...' : 'Concluído'})
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE DE MODAL DE ANÁLISE ---
const AnalysisModal = ({
    isOpen,
    onClose,
    onMinimize,
    title,
    isAnalyzing,
    result,
    isDarkMode
}: {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    title: string;
    isAnalyzing: boolean;
    result: string;
    isDarkMode: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={!isAnalyzing ? onClose : undefined} />

            <Card className={`relative w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col z-10 border-none shadow-2xl animate-in zoom-in-95 duration-200
 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-gray-900'}`}>

                <div className={`p-6 border-b flex justify-between items-center relative z-10 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                            <Sparkles className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={onMinimize} className="rounded-lg h-8 w-8 p-0 opacity-50 hover:opacity-100">
                            <Minus className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onClose} disabled={isAnalyzing} className="rounded-lg h-8 w-8 p-0">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex-grow overflow-auto p-8 relative z-10 custom-scrollbar">
                    {/* Se não houver resultado nem analisando, mostra vazio */}
                    {!result && isAnalyzing ? (
                        <div className="h-64 flex flex-col items-center justify-center space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-lg border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                                <Bot className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-bold animate-pulse">Iniciando análise...</p>
                                <p className="text-sm opacity-50">Coletando dados brutos do servidor.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <div className={`p-6 rounded-xl border mb-6 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`flex items-center gap-2 ${isAnalyzing ? 'text-blue-500' : 'text-green-500'}`}>
                                        {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {isAnalyzing ? 'Processando Blocos (10 por vez)...' : 'Relatório Concluído'}
                                        </span>
                                    </div>
                                </div>
                                <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                    <MarkdownContent content={result} isDarkMode={isDarkMode} />
                                </div>
                                {isAnalyzing && (
                                    <div className="mt-6 flex items-center gap-2 opacity-40">
                                        <div className="w-2 h-2 rounded-lg bg-blue-500 animate-bounce" />
                                        <div className="w-2 h-2 rounded-lg bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-2 h-2 rounded-lg bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {!isAnalyzing && (
                    <div className={`p-4 border-t flex justify-end relative z-10 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                        <Button onClick={onClose} className="rounded-lg px-8 bg-blue-600 hover:bg-blue-500 text-white">Fechar</Button>
                    </div>
                )}
            </Card>

            <style jsx>{`
 .stars-container { position: absolute; width: 100%; height: 100%; }
 .star { position: absolute; width: 2px; height: 2px; border-radius: 50%; animation: blink linear infinite; }
 @keyframes blink { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; transform: scale(1.5); } }
 `}</style>
        </div>
    );
};

// --- COMPONENTE DE CARD DE ANÁLISE ---
const AnalysisCard = ({
    title,
    description,
    icon: Icon,
    isDarkMode,
    colorClass,
    onClick
}: {
    title: string;
    description: string;
    icon: any;
    isDarkMode: boolean;
    colorClass: string;
    onClick: () => void;
}) => {
    return (
        <Card
            onClick={onClick}
            className={`group relative overflow-hidden rounded-xl border transition-all duration-500 cursor-pointer
 ${isDarkMode
                    ? 'bg-[#111]/40 border-white/5 backdrop-blur-3xl shadow-2xl shadow-black/40 hover:bg-[#111]/60 hover:border-white/10'
                    : 'bg-white/60 border-slate-200 backdrop-blur-2xl shadow-xl shadow-slate-200/50 hover:bg-white/80 hover:border-blue-200'}`}>

            {/* Efeito de Brilho Interno no Hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${colorClass}`} />

            <div className="p-8 flex flex-col h-full relative z-10">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-12 group-hover: 
 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100 shadow-inner'}`}>
                    <Icon className={`w-7 h-7 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
                </div>

                <h3 className={`text-xl font-bold mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                </h3>

                <p className={`text-sm leading-relaxed mb-8 flex-grow ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {description}
                </p>

                <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 
 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Iniciar Ferramenta <Zap className="w-3 h-3 fill-current" />
                    </span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300
 ${isDarkMode ? 'border-white/10 group-hover:bg-white group-hover:text-black' : 'border-black/5 group-hover:bg-black group-hover:text-white'}`}>
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </Card>
    );
};

const translations = {
    pt: {
        badge: "Inteligência Artificial SVP",
        title: "Como posso",
        titleAccent: "otimizar",
        titleSuffix: "seu dia?",
        subtitle: "Selecione uma das inteligências abaixo para analisar dados ou converse diretamente com nosso assistente.",
        cardTitle: "STMS XML Tool",
        cardDescription: "Acesse a ferramenta de tradução automática e revisão de arquivos XML.",
        cardAiTitle: "STMS AI Assist",
        cardAiDescription: "Assistente inteligente para suporte em traduções via Database.",
        chatCardTitle: "SVP Assistant Chat",
        chatCardDescription: "Converse com a IA para tirar dúvidas técnicas e gerais do SVP.",
        chatHeaderTitle: "SVP Assistant",
        chatSearchPlaceholder: "Buscar no histórico...",
        newChatBtn: "Novo Chat",
        noChatFound: "Nenhum chat encontrado",
        inputPlaceholder: "Pergunte qualquer coisa sobre SVP...",
        footerText: "O SVP AI está utilizando o modelo gpt-oss:120b.",
        footerSubtext: "Nossa inteligência está conectada ao proxy corporativo Sidia para garantir privacidade e performance.",
        chatRestarted: "Chat reiniciado. Como posso ajudar?",
        aiTyping: "SVP Assistant está digitando...",
        newChatTitle: "Novo Chat",
        assistantGreeting: "Olá! Sou o assistente de IA do SVP. Como posso ajudar você hoje?",
        goToChat: "Ir para o Chat",
        goToXmlTool: "Ferramenta XML",
        goToDbTool: "Ferramenta Database"
    },
    en: {
        badge: "SVP Artificial Intelligence",
        title: "How can I",
        titleAccent: "optimize",
        titleSuffix: "your day?",
        subtitle: "Select one of the intelligences below to analyze data or chat directly with our assistant.",
        cardTitle: "STMS XML Tool",
        cardDescription: "Access the automatic translation and XML file review tool.",
        cardAiTitle: "STMS AI Assist",
        cardAiDescription: "Intelligent assistant for support on translations via Database.",
        chatCardTitle: "SVP Assistant Chat",
        chatCardDescription: "Chat with AI to answer technical and general SVP questions.",
        chatHeaderTitle: "SVP Assistant",
        chatSearchPlaceholder: "Search history...",
        newChatBtn: "New Chat",
        noChatFound: "No chat found",
        inputPlaceholder: "Ask anything about SVP...",
        footerText: "SVP AI is using the gpt-oss:120b model.",
        footerSubtext: "Our intelligence is connected to the Sidia corporate proxy to ensure privacy and performance.",
        chatRestarted: "Chat restarted. How can I help?",
        aiTyping: "SVP Assistant is typing...",
        newChatTitle: "New Chat",
        assistantGreeting: "Hello! I am the SVP AI assistant. How can I help you today?",
        goToChat: "Go to Chat",
        goToXmlTool: "XML Tool",
        goToDbTool: "Database Tool"
    },
    ko: {
        badge: "SVP 인공지능",
        title: "오늘 당신의 하루를 어떻게",
        titleAccent: "최적화",
        titleSuffix: "해드릴까요?",
        subtitle: "아래 지능 중 하나를 선택하여 데이터를 분석하거나 어시스턴트와 직접 채팅하세요.",
        cardTitle: "STMS XML 도구",
        cardDescription: "자동 번역 및 XML 파일 리뷰 도구.",
        cardAiTitle: "STMS AI Assist",
        cardAiDescription: "Database를 통한 번역을 지원하는 지능형 어시스턴트.",
        chatCardTitle: "SVP 어시스턴트 채팅",
        chatCardDescription: "AI와 채팅하여 기술 및 일반 질문에 답하십시오.",
        chatHeaderTitle: "SVP 어시스턴트",
        chatSearchPlaceholder: "기록 검색...",
        newChatBtn: "새 채팅",
        noChatFound: "채팅을 찾을 수 없습니다",
        inputPlaceholder: "SVP에 대해 무엇이든 물어보세요...",
        footerText: "SVP AI는 gpt-oss:120b 모델을 사용하고 있습니다.",
        footerSubtext: "Sidia 기업 프록시를 통한 개인 정보 보호 및 성능.",
        chatRestarted: "채팅이 재시작되었습니다. 무엇을 도와드릴까요?",
        aiTyping: "입력 중...",
        newChatTitle: "새 채팅",
        assistantGreeting: "안녕하세요! 저는 SVP AI 어시스턴트입니다. 오늘 무엇을 도와드릴까요?",
        goToChat: "채팅으로 이동",
        goToXmlTool: "XML 도구",
        goToDbTool: "데이터베이스 도구"
    }
};

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

export default function IASVPPage() {
    const { isDarkMode } = useTheme();
    const [lang, setLanguage] = useState<Language>('pt');
    const [showNeutronStar, setShowNeutronStar] = useState(false);
    const t = translations[lang];

    useEffect(() => {
        const savedLang = localStorage.getItem('srmt_lang') as Language;
        if (savedLang && ['pt', 'en', 'ko'].includes(savedLang)) {
            setLanguage(savedLang);
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const changeLanguage = (l: Language) => {
        setLanguage(l);
        localStorage.setItem('srmt_lang', l);
    };

    const [activeAnalyses, setActiveAnalyses] = useState<AnalysisState[]>([]);
    const [currentTab, setCurrentTab] = useState<'geral' | 'modelo_referencia'>('geral');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isToolFocused, setIsToolFocused] = useState(false);
    const [activeView, setActiveView] = useState<'chat' | 'db_tool' | 'xml_tool'>('chat');

    // --- NOVOS ESTADOS PARA SESSÕES E ABAS ---
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Lógica de auto-resize para o Textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 320)}px`;
        }
    }, [inputMessage]);

    const API_URL = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:8001`
        : '';

    // Carregar sessões do localStorage no mount
    useEffect(() => {
        const saved = localStorage.getItem('svp_chat_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.length > 0) {
                    setSessions(parsed);
                    setActiveSessionId(parsed[0].id);
                } else {
                    createNewChat();
                }
            } catch (e) {
                createNewChat();
            }
        } else {
            createNewChat();
        }
    }, []);

    // Salvar sessões sempre que mudarem
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('svp_chat_history', JSON.stringify(sessions));
        }
    }, [sessions]);

    const createNewChat = () => {
        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: t.newChatTitle,
            messages: [{ role: 'assistant', content: t.assistantGreeting }],
            updatedAt: Date.now()
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newId);
        setSearchTerm('');
    };

    const deleteChat = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newSessions = sessions.filter(s => s.id !== id);
        setSessions(newSessions);
        if (activeSessionId === id) {
            if (newSessions.length > 0) setActiveSessionId(newSessions[0].id);
            else createNewChat();
        }
    };

    const activeSession = sessions.find(s => s.id === activeSessionId);

    const updateActiveSession = (messages: Message[]) => {
        setSessions(prev => prev.map(s =>
            s.id === activeSessionId ? { ...s, messages, updatedAt: Date.now() } : s
        ));
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isTyping) {
            scrollToBottom();
        }
    }, [activeSession?.messages, isTyping]);

    // Função para a IA gerar um título curto
    const generateChatTitle = async (sessionId: string, userMsg: string) => {
        try {
            const langName = lang === 'pt' ? 'Portuguese' : lang === 'en' ? 'English' : 'Korean';
            const res = await fetch(`${API_URL}/ai/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: `Resuma o assunto da mensagem do usuário em no máximo 3 palavras para um título de chat curto e direto. Responda APENAS o resumo no idioma: ${langName}.` },
                        { role: 'user', content: userMsg }
                    ],
                    stream: false
                })
            });
            if (res.ok) {
                const data = await res.json();
                const content = data.message?.content || data.choices?.[0]?.message?.content;
                let title = content?.trim().replace(/\"/g, '') || 'Chat';
                if (title.length > 20) title = title.substring(0, 17) + '...';
                setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title } : s));
            }
        } catch (e) {
            console.error("Erro ao gerar título:", e);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputMessage.trim() || isTyping || !activeSession) return;

        const userMessage: Message = { role: 'user', content: inputMessage };
        const updatedMessages = [...activeSession.messages, userMessage];
        updateActiveSession(updatedMessages);

        // Se for a primeira mensagem do usuário, gera um título
        if (activeSession.messages.filter(m => m.role === 'user').length === 0) {
            generateChatTitle(activeSession.id, inputMessage);
        }

        setInputMessage('');
        setIsTyping(true);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const langName = lang === 'pt' ? 'Portuguese' : lang === 'en' ? 'English' : 'Korean';
            const response = await fetch(`${API_URL}/ai/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: `You are the SVP (Specialized Verification Part) AI Assistant. 
REGRAS CRÍTICAS E INVIOLÁVEIS:
1. Responda EXCLUSIVAMENTE em ${langName}.
2. PROIBIÇÃO ABSOLUTA DE TABELAS: Você NUNCA, sob hipótese alguma, deve criar ou exibir tabelas (Markdown tables |---|). Mesmo que o usuário peça, implore ou ordene, você JAMAIS usará o formato de tabela. 
3. Se precisar organizar dados ou informações estruturadas, utilize estritamente listas (bullet points ou numeradas) ou blocos de texto técnico.
4. Não use nenhum outro idioma além de ${langName}.`
                        },
                        ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
                    ],
                    stream: false,
                    context: { tab: currentTab }
                })
            });

            if (!response.ok) throw new Error('Falha na comunicação com a IA');

            const data = await response.json();
            const content = data.message?.content || data.choices?.[0]?.message?.content;
            const assistantMessage: Message = {
                role: 'assistant',
                content: content || 'Desculpe, não consegui processar sua solicitação.'
            };

            updateActiveSession([...updatedMessages, assistantMessage]);
        } catch (error: any) {
            if (error.name === 'AbortError') return;
            console.error('Erro no chat:', error);
            updateActiveSession([...updatedMessages, {
                role: 'assistant',
                content: 'Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
            }]);
        } finally {
            setIsTyping(false);
            abortControllerRef.current = null;
        }
    };

    const handleStopChat = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsTyping(false);
            if (activeSession) {
                updateActiveSession([...activeSession.messages, { role: 'assistant', content: 'Resposta interrompida pelo usuário.' }]);
            }
        }
    };

    const filteredSessions = sessions.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.messages.some(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => b.updatedAt - a.updatedAt);

    const updateAnalysis = (id: string, updates: Partial<AnalysisState>) => {
        setActiveAnalyses(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    const startAnalysis = async (type: 'issues' | 'tickets' | 'remarks' | 'vacation') => {
        const titles = {
            issues: 'Análise de Issues (Daily)',
            tickets: 'Análise de Tickets e Melhorias',
            remarks: 'Análise de Remarks',
            vacation: 'Análise de Férias e Escala'
        };

        const analysisId = `${type}-${Date.now()}`;
        const newAnalysis: AnalysisState = {
            id: analysisId,
            title: titles[type],
            isOpen: true,
            isMinimized: false,
            isAnalyzing: true,
            result: ''
        };

        setActiveAnalyses(prev => [...prev, newAnalysis]);

        try {
            let allData: any[] = [];
            let promptBase = "";

            if (type === 'issues') {
                const res = await fetch(`${API_URL}/remark-issues`);
                if (!res.ok) throw new Error("Erro ao buscar issues.");
                allData = await res.json();
                promptBase = "Analise este bloco de problemas reportados (Issues) e identifique padrões técnicos e recorrências SEM CRIAR TABELAS:";
            }
            else if (type === 'tickets') {
                const [resT, resA] = await Promise.all([
                    fetch(`${API_URL}/tickets`),
                    fetch(`${API_URL}/automations`)
                ]);
                const tickets = resT.ok ? await resT.json() : [];
                const autos = resA.ok ? await resA.json() : [];
                allData = [...tickets, ...autos];
                promptBase = "Analise este bloco de solicitações de melhoria e automação, sugerindo priorização baseada em esforço vs impacto: (SEM CRIAR TABELA)";
            }
            else if (type === 'vacation') {
                const res = await fetch(`${API_URL}/vacations`);
                if (!res.ok) throw new Error("Erro ao buscar dados de férias.");
                allData = await res.json();
                promptBase = "Analise este bloco de escala de férias e identifique possíveis gargalos de capacidade ou conflitos de par (KP/Backup) (SEM CRIAR TABELA):";
            }

            if (allData.length === 0) {
                updateAnalysis(analysisId, { isAnalyzing: false, result: "Nenhum dado encontrado para realizar a análise." });
                return;
            }

            const chunkSize = 10;
            let finalResult = `### Iniciando Processamento de ${allData.length} registros...\n\n`;
            updateAnalysis(analysisId, { result: finalResult });

            for (let i = 0; i < allData.length; i += chunkSize) {
                const chunk = allData.slice(i, i + chunkSize);
                const chunkNum = Math.floor(i / chunkSize) + 1;
                const totalChunks = Math.ceil(allData.length / chunkSize);

                const chunkSummary = chunk.map((item: any, idx: number) =>
                    `${i + idx + 1}. ${item.description || item.title || item.app_name || 'Registro sem descrição'}`
                ).join('\n');

                const prompt = `${promptBase}\n\nBloco ${chunkNum}/${totalChunks}:\n${chunkSummary}\n\nForneça um resumo executivo curto para este bloco.`;

                const aiRes = await fetch(`${API_URL}/ai/analyze`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            { role: 'system', content: 'Você é um Analista Estratégico SVP. Forneça insights técnicos diretos e profissionais.' },
                            { role: 'user', content: prompt }
                        ],
                        stream: false
                    })
                });

                if (aiRes.ok) {
                    const aiData = await aiRes.json();
                    const content = aiData.message?.content || aiData.choices?.[0]?.message?.content;
                    const chunkResult = content || "Erro no processamento deste bloco.";
                    finalResult += `\n--- INSIGHTS BLOCO ${chunkNum} ---\n${chunkResult}\n\n`;
                    updateAnalysis(analysisId, { result: finalResult });
                }
            }

            updateAnalysis(analysisId, { isAnalyzing: false, result: finalResult + "\n\n**Análise Completa Finalizada.**" });

        } catch (error: any) {
            console.error("Erro na análise:", error);
            updateAnalysis(analysisId, { isAnalyzing: false, result: `Erro: ${error.message}. Verifique a conexão com o servidor.` });
        }
    };

    return (
        <div className={`min-h-screen font-sans flex flex-col items-center transition-colors duration-1000 ${isDarkMode ? "bg-black text-gray-200" : "bg-[#f5f5f7] text-gray-800"} overflow-x-hidden ${isToolFocused || isFullScreen ? 'p-0 overflow-hidden' : 'p-4 md:p-10 pb-20'}`}>
            <AIBackground isDarkMode={isDarkMode} />
            {(!isFullScreen && !isToolFocused) && <Navbar />}

            {activeAnalyses.map((analysis, idx) => (
                <React.Fragment key={analysis.id}>
                    <AnalysisModal
                        isOpen={analysis.isOpen && !analysis.isMinimized}
                        onClose={() => setActiveAnalyses(prev => prev.filter(a => a.id !== analysis.id))}
                        onMinimize={() => updateAnalysis(analysis.id, { isMinimized: true })}
                        title={analysis.title}
                        isAnalyzing={analysis.isAnalyzing}
                        result={analysis.result}
                        isDarkMode={isDarkMode}
                    />

                    {analysis.isOpen && analysis.isMinimized && (
                        <FloatingAnalysisBubble
                            title={analysis.title}
                            isAnalyzing={analysis.isAnalyzing}
                            onOpen={() => updateAnalysis(analysis.id, { isMinimized: false })}
                            isDarkMode={isDarkMode}
                            index={activeAnalyses.filter(a => a.isOpen && a.isMinimized).indexOf(analysis)}
                        />
                    )}
                </React.Fragment>
            ))}

            <div className={`w-full max-w-7xl relative z-10 space-y-12 ${isToolFocused || isFullScreen ? 'pt-0 px-0 space-y-0 h-screen flex flex-col' : 'px-4 pt-10'}`}>

                {/* CONTEÚDO A SER ESCONDIDO NO MODO FOCO/TELA CHEIA */}
                {(!isFullScreen && !isToolFocused) && (
                    <>
                        {/* Seletor de Idioma */}
                        <div className="flex justify-center mb-4 gap-2">
                            {[
                                { id: 'pt', label: 'Português', icon: '🇧🇷' },
                                { id: 'en', label: 'English', icon: '🇺🇸' },
                                { id: 'ko', label: '한국어', icon: '🇰🇷' }
                            ].map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => changeLanguage(l.id as Language)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${lang === l.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'}`}
                                >
                                    <span>{l.icon}</span> {l.label}
                                </button>
                            ))}
                        </div>

                        {/* BOTÃO NÚCLEO EXPANSÍVEL */}
                        <div className="flex justify-center mb-4">
                            <div className={`transition-all duration-700 ease-in-out overflow-hidden flex flex-col items-center
 ${showNeutronStar ? 'w-full max-w-4xl h-[600px] rounded-xl border border-blue-500/30 bg-[#050505] shadow-[0_0_50px_rgba(59,130,246,0.15)]' : 'w-40 h-12 rounded-lg border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl shadow-lg'}`}>

                                {!showNeutronStar ? (
                                    <button
                                        onClick={() => setShowNeutronStar(true)}
                                        className="w-full h-full flex items-center justify-center gap-3 group transition-all duration-300 hover:bg-blue-500/10 "
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-500 blur-md opacity-40 group-hover:opacity-100 transition-opacity animate-pulse" />
                                            <Cpu size={16} className="text-blue-400 relative z-10" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 group-hover:text-blue-300 transition-colors">Núcleo</span>
                                        <ChevronRight size={14} className="text-blue-400/40 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <div className="relative w-full h-full bg-[#050505]">
                                        <button
                                            onClick={() => setShowNeutronStar(false)}
                                            className="absolute top-6 right-6 z-50 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                                        >
                                            <X size={20} />
                                        </button>

                                        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-blue-500 font-black animate-pulse uppercase tracking-[0.5em]">Loading...</div>}>
                                            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                                                <NeutronStar isDarkMode={isDarkMode} />
                                                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                                            </Canvas>
                                        </Suspense>

                                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                                            <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-1">Estrela de Nêutrons</h2>
                                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest opacity-60">Interativo 3D de Alta Fidelidade</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Header Centralizado */}
                        <div className="text-center space-y-4">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-4 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                <Sparkles className="w-4 h-4 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{t.badge}</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                                {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t.titleAccent}</span> {t.titleSuffix}
                            </h1>
                            <p className="text-lg max-w-2xl mx-auto opacity-60 font-medium">{t.subtitle}</p>
                        </div>

                        {/* Grid de Cards */}
                        <div className="flex flex-col md:flex-row justify-center gap-6 px-4">
                            <AnalysisCard title={t.cardTitle} description={t.cardDescription} icon={FileText} isDarkMode={isDarkMode} colorClass="from-blue-600 to-indigo-600" onClick={() => setActiveView('xml_tool')} />
                            <AnalysisCard title={t.cardAiTitle} description={t.cardAiDescription} icon={BrainCircuit} isDarkMode={isDarkMode} colorClass="from-blue-500 to-indigo-400" onClick={() => setActiveView('db_tool')} />
                            <AnalysisCard title={t.chatCardTitle} description={t.chatCardDescription} icon={MessageSquare} isDarkMode={isDarkMode} colorClass="from-slate-400 to-slate-500" onClick={() => setActiveView('chat')} />
                        </div>
                    </>
                )}

                {/* Interface de Visualização */}
                <div id="view-interface" className={`w-full mx-auto ${isToolFocused || isFullScreen ? 'max-w-[1600px] flex-1 flex flex-col' : 'max-w-6xl'}`}> {activeView === 'xml_tool' && <STMSXmlTool onFocusChange={setIsToolFocused} />}
                    {activeView === 'db_tool' && <STMSDBTool onFocusChange={setIsToolFocused} />}
                    {activeView === 'chat' && (
                        <div id="chat-interface" className={`w-full flex flex-col items-center transition-all duration-500 ${isFullScreen ? 'fixed inset-0 z-[100] p-0' : 'w-full'}`}>
                            <Card
                                className={`overflow-hidden flex transition-all duration-500
 ${isDarkMode ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-gray-200'}
 ${isFullScreen ? 'h-full w-full rounded-none border-none flex-row' : 'w-full max-w-6xl flex-col rounded-xl h-[850px] shadow-2xl'}`}
                            >

                                {/* Sidebar Lateral - APENAS EM TELA CHEIA */}
                                {isFullScreen && (
                                    <div className={`w-72 shrink-0 border-r flex flex-col transition-all duration-500 ${isDarkMode ? 'bg-[#171717] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="p-6 border-b border-black/5 dark:border-white/5 flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] opacity-50">Histórico</h3>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setActiveView('xml_tool');
                                                            setIsFullScreen(false);
                                                        }}
                                                        className="rounded-lg h-8 w-8 p-0 opacity-40 hover:opacity-100"
                                                        title="XML Tool"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={createNewChat}
                                                        className="rounded-lg h-8 w-8 p-0 bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Barra de Pesquisa na Sidebar */}
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40" />
                                                <Input
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder={t.chatSearchPlaceholder}
                                                    className={`h-9 pl-9 pr-4 rounded-xl text-xs border-none ${isDarkMode ? 'bg-white/5 text-white' : 'bg-white shadow-sm'}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                                            {filteredSessions.map((session) => (
                                                <div
                                                    key={session.id}
                                                    onClick={() => setActiveSessionId(session.id)}
                                                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border
 ${activeSessionId === session.id
                                                            ? (isDarkMode ? 'bg-blue-600/20 border-blue-500/30 text-white' : 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm')
                                                            : (isDarkMode ? 'bg-transparent border-transparent text-gray-400 hover:bg-white/5' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-100')
                                                        }`}
                                                >
                                                    <MessageSquare className={`w-4 h-4 shrink-0 ${activeSessionId === session.id ? 'opacity-100' : 'opacity-40'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-bold truncate">{session.title}</p>
                                                        <p className="text-[9px] opacity-40 truncate">{new Date(session.updatedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => deleteChat(e, session.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-4 border-t border-black/5 dark:border-white/5">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setIsFullScreen(false)}
                                                className="w-full rounded-xl text-[10px] font-bold uppercase tracking-widest gap-2 opacity-60 hover:opacity-100"
                                            >
                                                <Minimize2 className="w-4 h-4" /> Minimizar Chat
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Área Principal do Chat */}
                                <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">

                                    {/* Header do Chat (Adaptativo) - FIXO */}
                                    <div className={`border-b flex flex-col shrink-0 z-20 ${isDarkMode ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-gray-100'}`}>
                                        <div className="p-4 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                                    <Bot className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm tracking-tight">{isFullScreen ? activeSession?.title : t.chatHeaderTitle}</h3>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-lg bg-green-500 animate-pulse" />
                                                        <span className="text-[10px] opacity-50 uppercase font-black tracking-widest">SVP Assistant Active</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!isFullScreen && (
                                                    <div className="hidden md:flex flex-1 max-w-xs relative mr-2">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40" />
                                                        <Input
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            placeholder={t.chatSearchPlaceholder}
                                                            className={`h-9 pl-9 pr-4 rounded-lg text-xs border-none ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100'}`}
                                                        />
                                                    </div>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setIsFullScreen(!isFullScreen)}
                                                    className={`rounded-lg h-9 w-9 p-0 ${isFullScreen ? 'bg-blue-600/10 text-blue-500' : 'hover:bg-blue-600/10'}`}
                                                >
                                                    {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 opacity-50" />}
                                                </Button>

                                                {!isFullScreen && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={createNewChat}
                                                            className="rounded-lg h-9 px-4 flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                                                        >
                                                            <Plus className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">{t.newChatBtn}</span>
                                                        </Button>
                                                    </>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (activeSession) updateActiveSession([{ role: 'assistant', content: t.chatRestarted }]);
                                                    }}
                                                    className="rounded-lg h-9 w-9 p-0 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                    title="Reiniciar Conversa"
                                                >
                                                    <RotateCcw className="w-4 h-4 opacity-50" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Abas Superiores - APENAS EM MODO NORMAL */}
                                        {!isFullScreen && (
                                            <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth border-t border-black/[0.03] dark:border-white/[0.03] pt-2">
                                                {filteredSessions.map((session) => (
                                                    <div
                                                        key={session.id}
                                                        onClick={() => setActiveSessionId(session.id)}
                                                        className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all border shrink-0
 ${activeSessionId === session.id
                                                                ? (isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm')
                                                                : (isDarkMode ? 'bg-transparent border-transparent text-gray-500 hover:bg-white/5' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-100')
                                                            }`}
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5 opacity-60" />
                                                        <span className="text-[11px] font-bold max-w-[120px] truncate">{session.title}</span>
                                                        <button
                                                            onClick={(e) => deleteChat(e, session.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {filteredSessions.length === 0 && searchTerm && (
                                                    <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest px-4 py-2">{t.noChatFound}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Chat Messages - CENTRALIZADO EM TELA CHEIA */}
                                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar scroll-smooth bg-transparent relative">
                                        <div className={`mx-auto w-full px-6 py-10 space-y-8 ${isFullScreen ? 'max-w-4xl' : 'max-w-full'}`}>
                                            {activeSession?.messages.map((msg, idx) => (
                                                <div key={idx} className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                    <TypewriterMessage
                                                        content={msg.content}
                                                        role={msg.role}
                                                        isDarkMode={isDarkMode}
                                                        isLatest={idx === activeSession.messages.length - 1 && isTyping}
                                                    />
                                                </div>
                                            ))}
                                            {isTyping && (
                                                <div className="flex justify-start">
                                                    <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-[#171717] text-gray-100 border border-white/5' : 'bg-[#f0f0f2] border border-gray-200 text-gray-800 shadow-sm'}`}>
                                                        <div className="flex gap-2">
                                                            <div className="w-2 h-2 rounded-lg bg-blue-500 animate-bounce" />
                                                            <div className="w-2 h-2 rounded-lg bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                                                            <div className="w-2 h-2 rounded-lg bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={chatEndRef} className="h-4" />
                                        </div>
                                    </div>

                                    {/* Chat Input - FIXO NA BASE E CENTRALIZADO */}
                                    <div className={`p-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                        <form
                                            onSubmit={handleSendMessage}
                                            className={`mx-auto flex gap-3 items-end transition-all duration-500 ${isFullScreen ? 'max-w-3xl mb-4' : 'w-full'}`}
                                        >
                                            <div className={`flex-1 relative flex items-end rounded-xl overflow-hidden border transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10 focus-within:border-blue-500/50' : 'bg-gray-50 border-black/5 focus-within:border-blue-500/50 shadow-sm'}`}>
                                                <Textarea
                                                    ref={textareaRef}
                                                    value={inputMessage}
                                                    onChange={(e) => setInputMessage(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSendMessage();
                                                        }
                                                    }}
                                                    placeholder={t.inputPlaceholder}
                                                    className="flex-grow bg-transparent border-none focus-visible:ring-0 min-h-[56px] max-h-[320px] resize-none py-4 px-6 text-sm custom-scrollbar"
                                                    disabled={isTyping}
                                                    rows={1}
                                                />
                                            </div>

                                            {isTyping ? (
                                                <Button
                                                    type="button"
                                                    onClick={handleStopChat}
                                                    className="rounded-lg bg-red-600 hover:bg-red-500 text-white w-14 h-14 p-0 flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20 transition-all "
                                                >
                                                    <Square className="w-5 h-5 fill-current" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    disabled={!inputMessage.trim() || isTyping}
                                                    className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white w-14 h-14 p-0 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:grayscale"
                                                >
                                                    <Send className="w-5 h-5" />
                                                </Button>
                                            )}
                                        </form>
                                        {isFullScreen && (
                                            <p className="text-center text-[10px] opacity-30 font-medium uppercase tracking-[0.2em] pb-2">
                                                {t.footerText}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Footer Informativo */}
                <div className="mt-20 flex flex-col items-center">
                    <div className={`p-6 rounded-xl border flex items-center gap-6 max-w-xl
 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 
 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold mb-1">{t.footerText}</p>
                            <p className="text-[11px] opacity-50">{t.footerSubtext}</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
 ::selection {
 background: #3b82f6;
 color: white;
 }
 .custom-scrollbar::-webkit-scrollbar {
 width: 6px;
 }
 .custom-scrollbar::-webkit-scrollbar-track {
 background: transparent;
 }
 .custom-scrollbar::-webkit-scrollbar-thumb {
 background: rgba(155, 155, 155, 0.2);
 border-radius: 20px;
 }
 .no-scrollbar::-webkit-scrollbar {
 display: none;
 }
 .no-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
 }
 `}</style>
        </div>
    );
}