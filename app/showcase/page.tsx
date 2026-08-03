'use client';

import React, { useRef, Suspense, useEffect, useState } from 'react';
import { 
  BrainCircuit, 
  CalendarDays, 
  Cpu, 
  Zap, 
  Database,
  ArrowRight,
  MonitorPlay,
  FileCode2,
  MessageSquareCode,
  Activity,
  GitPullRequest,
  CheckCircle,
  FileCheck2,
  Server,
  Network,
  BarChart3,
  ShieldCheck,
  Code2,
  ChevronRight,
  Loader2,
  BarChart,
  BarChart2,
  AlertCircle,
  Sparkles,
  FileText
} from 'lucide-react';
import { Navbar } from "@/components/navbar";
import { useTheme, ThemeContextValue } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AIChart } from '@/components/ui/ai-chart';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform, Variants, MotionStyle } from 'framer-motion';
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Float, 
  Stars, 
  Box, 
  PerspectiveCamera,
  ContactShadows,
  Environment,
  PresentationControls
} from '@react-three/drei';
import * as THREE from 'three';

// --- COMPONENTES 3D DETALHADOS ---

const NeuralNode = ({ position, color, speed = 1 }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.3;
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.2);
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.12, 16, 16]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
    </Sphere>
  );
};

const ConnectionLines = () => {
  const groupRef = useRef<THREE.Group>(null);
  const points = useRef<THREE.Vector3[]>([]);
  
  if (points.current.length === 0) {
    for (let i = 0; i < 30; i++) {
      points.current.push(new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15));
    }
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {points.current.map((p, i) => (
        <NeuralNode 
          key={i} 
          position={[p.x, p.y, p.z]} 
          color={i % 3 === 0 ? "#00f0ff" : i % 3 === 1 ? "#8b5cf6" : "#ff007f"} 
          speed={1 + Math.random()} 
        />
      ))}
    </group>
  );
};

const TechCrystal = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={5} rotationIntensity={3} floatIntensity={3}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[2.5, 0]} />
        <MeshDistortMaterial 
          color={isDarkMode ? "#00f0ff" : "#3b82f6"} 
          emissive={isDarkMode ? "#0055ff" : "#1e40af"}
          emissiveIntensity={0.6}
          speed={2.5} 
          distort={0.4} 
          radius={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
};

// --- INTERFACE UI ---

const ImagePlaceholder = ({ label, isDarkMode, className = "", url = "", delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95, y: 30 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    whileHover={{ scale: 1.03, y: -10 }}
    className={`w-full aspect-video rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group border shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] ${className}
    ${isDarkMode ? 'bg-[#0a0a0a] border-white/10 hover:border-white/20' : 'bg-gray-100 border-black/5 hover:border-black/10'}
  `}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <motion.div 
      className="z-10 flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <MonitorPlay className={`w-16 h-16 mb-4 opacity-30 group-hover:opacity-60 transition-all duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
      <span className={`font-black uppercase tracking-[0.4em] text-sm opacity-50 text-center px-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {label}
      </span>
      <span className={`text-[10px] font-bold opacity-40 mt-4 px-3 py-1 rounded-full text-[#00f0ff] ${isDarkMode ? 'bg-black/20' : 'bg-blue-500/10'}`}>
        1920 X 1080 RESOLUTION
      </span>
    </motion.div>
    {url && (
      <div className={`absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border text-[10px] font-black uppercase tracking-widest shadow-lg ${isDarkMode ? 'bg-black/40 border-white/10 text-white/80' : 'bg-white/60 border-black/5 text-gray-900'}`}>
        <Network size={12} className="text-[#00f0ff]" /> {url}
      </div>
    )}
  </motion.div>
);

const SectionHeading = ({ icon: Icon, badge, title, highlight, description, isDarkMode, color = "blue" }: any) => {
  const colorMap: any = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    zinc: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-6 max-w-2xl"
    >
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${colorMap[color]}`}>
        <Icon className="w-4 h-4" /> {badge}
      </div>
      <h2 className={`text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title} <span className={colorMap[color].split(' ')[0]}>{highlight}</span>
      </h2>
      <p className={`text-lg opacity-60 leading-relaxed font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {description}
      </p>
    </motion.div>
  );
};

export default function ShowcasePage() {
  const { isDarkMode, setTheme } = useTheme() as ThemeContextValue;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const [lang, setLang] = useState<'pt' | 'en' | 'ko'>('pt');

  // AI Demo States
  const [isGeneratingChart, setIsGeneratingChart] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isAnalyzingLog, setIsAnalyzingLog] = useState(false);
  const [logResult, setLogResult] = useState("");

  const API_URL = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:8001` 
    : '';

  const generateAIChart = async () => {
    setIsGeneratingChart(true);
    try {
      const res = await fetch(`${API_URL}/stms/strings`);
      const items = await res.json();
      const stats = {
        total: items.length,
        approved: items.filter((i: any) => i.status === 'approved').length,
        rejected: items.filter((i: any) => i.status === 'rejected').length,
        pending: items.filter((i: any) => i.status === 'pending').length,
        postponed: items.filter((i: any) => i.status === 'postponed').length,
      };
      const aiRes = await fetch(`${API_URL}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Gere um gráfico de análise estatística (JSON formatado para recharts) sobre estes dados de tradução do SVP: Total: ${stats.total}, Aprovados: ${stats.approved}, Rejeitados: ${stats.rejected}, Pendentes: ${stats.pending}, Adiados: ${stats.postponed}. Utilize o formato de bloco de código json:chart.`
          }]
        })
      });
      const data = await aiRes.json();
      const content = data.message?.content || "";
      const chartMatch = content.match(/```json:chart\n([\s\S]*?)\n```/);
      if (chartMatch) setChartData(JSON.parse(chartMatch[1]));
    } catch (error) { console.error(error); } finally { setIsGeneratingChart(false); }
  };

  const generateSVPReport = async () => {
    setIsGeneratingReport(true);
    try {
      const aiRes = await fetch(`${API_URL}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: "Gere um modelo de relatório de progresso semanal para o time SVP, baseando-se nas informações de Team Overview e Ciclo de Vida PLC encontradas na sua base de conhecimento."
          }]
        })
      });
      const data = await aiRes.json();
      setReportText(data.message?.content || "");
    } catch (error) { console.error(error); } finally { setIsGeneratingReport(false); }
  };

  const analyzeLogs = async () => {
    setIsAnalyzingLog(true);
    try {
      const sampleLog = "FATAL EXCEPTION: main\nProcess: com.sec.android.app.camera, PID: 28412\njava.lang.NullPointerException: Attempt to invoke virtual method 'void android.hardware.camera2.CameraDevice.close()' on a null object reference";
      const aiRes = await fetch(`${API_URL}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Analise este log de Force Close e identifique a causa provável: \n\n${sampleLog}`
          }]
        })
      });
      const data = await aiRes.json();
      setLogResult(data.message?.content || "");
    } catch (error) { console.error(error); } finally { setIsAnalyzingLog(false); }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const savedLang = localStorage.getItem('srmt_lang') as 'pt' | 'en' | 'ko';
      if (savedLang) setLang(savedLang);
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    // Polling as a fallback for same-window localstorage changes without dispatchEvent
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const translations = {
    pt: { 
      hero: { subtitle: "A convergência entre ", h1: "Engenharia de Qualidade", and: " e ", h2: "Inteligência Generativa", explore: "Explorar Workspace", scroll: "Scroll para descobrir" },
      tech: {
        badge: "Infrastructure",
        title: "O Motor por baixo do ",
        highlight: "Capô.",
        desc: "Construído com tecnologias de ponta para garantir que a experiência do usuário seja fluida, rápida e imensamente segura.",
        latencyTitle: "Baixa Latência, Alta Privacidade",
        latencyDesc: "Nossa IA processa tudo localmente. Zero vazamento de dados, 100% de conformidade corporativa via Sidia Proxy.",
        nextDesc: "SSR e Server Components para SEO interno e performance instantânea.",
        fastApiDesc: "Core assíncrono em Python para orquestração massiva de dados.",
        pgDesc: "Persistência robusta com suporte a busca full-text e relações complexas.",
        proxyDesc: "Segurança de rede e controle de acesso via LDAP integrado."
      },
      ai: {
        badge: "Intelligence Suite",
        title: "Suíte de IA Aplicada ",
        highlight: "SVP.",
        desc: "Aplicações de IA generativa treinadas para entender o contexto técnico de testes e builds Android.",
        xmlDesc: "Otimização de builds em larga escala. A ferramenta parseia arquivos XML de builds Android (AOSP/Sidia), identifica strings novas e realiza a tradução automática preservando rigorosamente as tags de formatação como %s, %d e escapes de quebra de linha.",
        xmlMetric: "85% de redução no tempo de tradução manual.",
        dbDesc: "Revisão inteligente no banco de dados. Processa lotes de strings traduzidas, compara com o texto de origem em inglês e sugere melhorias baseadas no contexto da interface. A IA gera um Motivo Técnico para cada sugestão.",
        chatDesc: "Um copiloto conversacional. O Chat utiliza o modelo Ollama gpt-oss:20b para fornecer suporte em tempo real sobre os processos do SVP. Ele analisa contextos, explica fluxos de tickets e formata dados técnicos em respostas limpas e objetivas."
      },
      daily: {
        badge: "Daily Operations",
        title: "Daily Issues & ",
        highlight: "Management.",
        desc: "Acompanhamento em tempo real de impedimentos. De simples registros a análises executivas.",
        regTitle: "Registro Direto",
        regDesc: "O time reporta problemas diários com severidade e status, garantindo que nada se perca.",
        aiTitle: "IA Dashboard Analysis",
        aiDesc: "A inteligência artificial lê todas as issues e gera um resumo executivo automático."
      },
      workflow: {
        badge: "Workflow Control",
        title: "Lifecycle de Tickets & ",
        highlight: "ROI.",
        desc: "Gerenciamos o fluxo de solicitações desde o pedido inicial até o cálculo financeiro de economia gerada por automação.",
        autoTitle: "Automação com Propósito",
        autoDesc: "O módulo /tickets/automacoes permite gerenciar scripts em execução, monitorar falhas e visualizar a economia em Homem-Hora (HH) que cada automação traz para os projetos.",
        visibility: "Visibilidade",
        tracking: "Tracking"
      },
      resource: {
        badge: "Resource Planning",
        title: "Planejamento de Férias & ",
        highlight: "Capacidade.",
        desc: "Sistema de gestão de escala para garantir que o time nunca fique desguarnecido de KPs (Key Persons).",
        kpTitle: "KP vs Backup Conflict",
        kpDesc: "O sistema detecta automaticamente conflitos se um KP e seu backup solicitarem férias no mesmo período.",
        workTitle: "Workflow de Aprovação",
        workDesc: "URL: /ferias/aprovacao - Fluxo simplificado para gestores validarem ausências baseadas na capacidade atual do time."
      },
      data: {
        badge: "Data Quality",
        title: "Padronização de ",
        highlight: "Remarks.",
        desc: "Unificamos a escrita técnica dos projetos para garantir auditorias perfeitas.",
        remarkDesc: "O módulo /remarks é a nossa ferramenta de governança de texto. Ela impõe regras rígidas de preenchimento, formatação de dicas e IDs de projetos, eliminando a ambiguidade nos registros de teste. O resultado é um banco de dados limpo, pronto para IA."
      },
      footer: {
        title1: "Pronto para o futuro da ",
        title2: "Engenharia de Qualidade?",
        btn: "Entrar no Sistema SRMT",
        built: "Construído pelo Time Sidia • 2026"
      },
      lab: {
        badge: "AI Playground",
        title: "Laboratório de Interação ",
        highlight: "IA.",
        desc: "Experimente o poder da nossa inteligência generativa integrada em tempo real.",
        chartTitle: "Analisador de Dados Dinâmico",
        chartDesc: "A IA processa os registros atuais de tradução e gera insights visuais automáticos.",
        chartBtn: "Criar gráfico de análise",
        reportTitle: "Gerador de Relatórios SVP",
        reportDesc: "Baseado no conhecimento técnico do General Info, a IA redige minutas executivas estruturadas.",
        reportBtn: "Geração de Texto de relatórios",
        logTitle: "Analisador de Logs & Force Close",
        logDesc: "Extraia inteligência de logs brutos. A IA identifica exceções Java/Native e sugere correções baseadas em ocorrências anteriores.",
        logBtn: "Analisar Log de Erro",
        diagnostic: "Diagnóstico IA"
      }
    },
    en: { 
      hero: { subtitle: "The convergence of ", h1: "Quality Engineering", and: " and ", h2: "Generative Intelligence", explore: "Explore Workspace", scroll: "Scroll to discover" },
      tech: {
        badge: "Infrastructure",
        title: "The Engine under the ",
        highlight: "Hood.",
        desc: "Built with cutting-edge technologies to ensure the user experience is fluid, fast, and immensely secure.",
        latencyTitle: "Low Latency, High Privacy",
        latencyDesc: "Our AI processes everything locally. Zero data leaks, 100% corporate compliance via Sidia Proxy.",
        nextDesc: "SSR and Server Components for internal SEO and instant performance.",
        fastApiDesc: "Asynchronous Python core for massive data orchestration.",
        pgDesc: "Robust persistence with full-text search support and complex relations.",
        proxyDesc: "Network security and access control via integrated LDAP."
      },
      ai: {
        badge: "Intelligence Suite",
        title: "Applied AI Suite ",
        highlight: "SVP.",
        desc: "Generative AI applications trained to understand the technical context of Android tests and builds.",
        xmlDesc: "Large-scale build optimization. The tool parses Android build XML files (AOSP/Sidia), identifies new strings, and performs automatic translation strictly preserving formatting tags like %s, %d, and line break escapes.",
        xmlMetric: "85% reduction in manual translation time.",
        dbDesc: "Intelligent database review. Processes batches of translated strings, compares them with the original English text, and suggests improvements based on UI context. The AI generates a Technical Reason for each suggestion.",
        chatDesc: "A conversational copilot. The Chat uses the Ollama gpt-oss:20b model to provide real-time support on SVP processes. It analyzes contexts, explains ticket flows, and formats technical data into clean, objective answers."
      },
      daily: {
        badge: "Daily Operations",
        title: "Daily Issues & ",
        highlight: "Management.",
        desc: "Real-time tracking of impediments. From simple logs to executive analysis.",
        regTitle: "Direct Logging",
        regDesc: "The team reports daily problems with severity and status, ensuring nothing is lost.",
        aiTitle: "AI Dashboard Analysis",
        aiDesc: "Artificial intelligence reads all issues and generates an automatic executive summary."
      },
      workflow: {
        badge: "Workflow Control",
        title: "Ticket Lifecycle & ",
        highlight: "ROI.",
        desc: "We manage the flow of requests from the initial order to the financial calculation of savings generated by automation.",
        autoTitle: "Automation with Purpose",
        autoDesc: "The /tickets/automations module allows managing running scripts, monitoring failures, and visualizing the Man-Hour (HH) savings each automation brings to projects.",
        visibility: "Visibility",
        tracking: "Tracking"
      },
      resource: {
        badge: "Resource Planning",
        title: "Vacation Planning & ",
        highlight: "Capacity.",
        desc: "Schedule management system to ensure the team is never left without KPs (Key Persons).",
        kpTitle: "KP vs Backup Conflict",
        kpDesc: "The system automatically detects conflicts if a KP and their backup request vacation in the same period.",
        workTitle: "Approval Workflow",
        workDesc: "URL: /vacations/approval - Simplified flow for managers to validate absences based on current team capacity."
      },
      data: {
        badge: "Data Quality",
        title: "Standardization of ",
        highlight: "Remarks.",
        desc: "We unify the technical writing of projects to ensure perfect audits.",
        remarkDesc: "The /remarks module is our text governance tool. It imposes strict rules for filling out, formatting tips, and project IDs, eliminating ambiguity in test logs. The result is a clean database, ready for AI."
      },
      footer: {
        title1: "Ready for the future of ",
        title2: "Quality Engineering?",
        btn: "Enter SRMT System",
        built: "Built by Sidia Team • 2026"
      },
      lab: {
        badge: "AI Playground",
        title: "Interaction ",
        highlight: "Lab.",
        desc: "Experience the power of our real-time integrated generative intelligence.",
        chartTitle: "Dynamic Data Analyzer",
        chartDesc: "AI processes current translation records and generates automatic visual insights.",
        chartBtn: "Create analysis chart",
        reportTitle: "SVP Report Generator",
        reportDesc: "Based on General Info technical knowledge, the AI drafts structured executive minutes.",
        reportBtn: "Generate report text",
        logTitle: "Log & Force Close Analyzer",
        logDesc: "Extract intelligence from raw logs. AI identifies Java/Native exceptions and suggests fixes.",
        logBtn: "Analyze Error Log",
        diagnostic: "AI Diagnostic"
      }
    },
    ko: { 
      hero: { subtitle: "", h1: "품질 엔지니어링", and: "과 ", h2: "생성형 AI", explore: "작업 공간 탐색", scroll: "스크롤하여 탐색" },
      tech: {
        badge: "인프라",
        title: "내부 ",
        highlight: "엔진.",
        desc: "사용자 경험이 유연하고 빠르며 매우 안전하도록 최첨단 기술로 구축되었습니다.",
        latencyTitle: "저지연, 높은 개인정보 보호",
        latencyDesc: "우리의 AI는 모든 것을 로컬에서 처리합니다. 데이터 유출 제로, Sidia 프록시를 통한 100% 기업 규정 준수.",
        nextDesc: "내부 SEO 및 즉각적인 성능을 위한 SSR 및 서버 컴포넌트.",
        fastApiDesc: "대규모 데이터 오케스트레이션을 위한 비동기 파이썬 코어.",
        pgDesc: "전체 텍스트 검색 지원 및 복잡한 관계를 통한 강력한 지속성.",
        proxyDesc: "통합 LDAP를 통한 네트워크 보안 및 액세스 제어."
      },
      ai: {
        badge: "인텔리전스 제품군",
        title: "응용 AI 제품군 ",
        highlight: "SVP.",
        desc: "Android 테스트 및 빌드의 기술적 맥락을 이해하도록 훈련된 생성형 AI 애플리케이션.",
        xmlDesc: "대규모 빌드 최적화. 이 도구는 Android 빌드 XML 파일(AOSP/Sidia)을 구문 분석하고, 새 문자열을 식별하며, %s, %d 및 줄 바꿈 이스케이프와 같은 서식 태그를 엄격하게 유지하면서 자동 번역을 수행합니다.",
        xmlMetric: "수동 번역 시간 85% 단축.",
        dbDesc: "지능형 데이터베이스 검토. 번역된 문자열 배치를 처리하고, 원래 영어 텍스트와 비교하며, UI 컨텍스트를 기반으로 개선 사항을 제안합니다. AI는 각 제안에 대한 기술적 이유를 생성합니다.",
        chatDesc: "대화형 부조종사. 이 채팅은 Ollama gpt-oss:20b 모델을 사용하여 SVP 프로세스에 대한 실시간 지원을 제공합니다. 컨텍스트를 분석하고, 티켓 흐름을 설명하며, 기술 데이터를 깨끗하고 객관적인 답변으로 형식화합니다."
      },
      daily: {
        badge: "일일 운영",
        title: "일일 문제 및 ",
        highlight: "관리.",
        desc: "장애물의 실시간 추적. 단순한 로그에서 경영진 분석까지.",
        regTitle: "직접 로깅",
        regDesc: "팀은 심각도 및 상태와 함께 일일 문제를 보고하여 누락되는 것이 없도록 합니다.",
        aiTitle: "AI 대시보드 분석",
        aiDesc: "인공 지능이 모든 문제를 읽고 자동 경영진 요약을 생성합니다."
      },
      workflow: {
        badge: "워크플로우 제어",
        title: "티켓 수명 주기 및 ",
        highlight: "ROI.",
        desc: "초기 주문에서 자동화로 생성된 절감액의 재무 계산에 이르기까지 요청 흐름을 관리합니다.",
        autoTitle: "목적이 있는 자동화",
        autoDesc: "/tickets/automations 모듈을 사용하면 실행 중인 스크립트를 관리하고, 실패를 모니터링하며, 각 자동화가 프로젝트에 가져오는 공수(HH) 절감 효과를 시각화할 수 있습니다.",
        visibility: "가시성",
        tracking: "추적"
      },
      resource: {
        badge: "자원 계획",
        title: "휴가 계획 및 ",
        highlight: "용량.",
        desc: "팀에 핵심 인력(KP)이 부족하지 않도록 보장하는 일정 관리 시스템.",
        kpTitle: "KP 대 백업 충돌",
        kpDesc: "KP와 그들의 백업이 같은 기간에 휴가를 요청하면 시스템이 자동으로 충돌을 감지합니다.",
        workTitle: "승인 워크플로우",
        workDesc: "URL: /vacations/approval - 관리자가 현재 팀 용량을 기반으로 부재를 확인하기 위한 간소화된 흐름."
      },
      data: {
        badge: "데이터 품질",
        title: "비고의 ",
        highlight: "표준화.",
        desc: "완벽한 감사를 보장하기 위해 프로젝트의 기술 작성을 통합합니다.",
        remarkDesc: "/remarks 모듈은 우리의 텍스트 거버넌스 도구입니다. 작성, 팁 형식 지정 및 프로젝트 ID에 대한 엄격한 규칙을 적용하여 테스트 로그의 모호성을 제거합니다. 그 결과 AI를 위한 준비가 된 깨끗한 데이터베이스가 생성됩니다."
      },
      footer: {
        title1: "미래를 위한 준비 ",
        title2: "품질 엔지니어링?",
        btn: "SRMT 시스템 시작",
        built: "Sidia 팀 구축 • 2026"
      },
      lab: {
        badge: "AI 플레이그라운드",
        title: "상호 작용 ",
        highlight: "실험실.",
        desc: "실시간으로 통합된 생성형 지능의 힘을 경험해 보세요.",
        chartTitle: "동적 데이터 분석기",
        chartDesc: "AI는 현재 번역 기록을 처리하고 자동 시각적 통찰력을 생성합니다.",
        chartBtn: "분석 그래프 생성",
        reportTitle: "SVP 보고서 생성기",
        reportDesc: "일반 정보 기술 지식을 바탕으로 AI가 구조화된 경영진 회의록을 작성합니다.",
        reportBtn: "보고서 텍스트 생성",
        logTitle: "로그 및 강제 종료 분석기",
        logDesc: "원시 로그에서 인텔리전스를 추출합니다. AI는 Java/Native 예외를 식별하고 수정을 제안합니다.",
        logBtn: "오류 로그 분석",
        diagnostic: "AI 진단"
      }
    }
  };

  const t = translations[lang];

  useEffect(() => {
    if (setTheme) {
      setTheme(true);
    }
  }, [setTheme]);
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 100]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
  };

  const heroStyle: any = {
    opacity: heroOpacity,
    scale: heroScale,
    y: heroY
  };

  return (
    <div ref={containerRef} className={`min-h-screen font-sans flex flex-col items-center transition-colors duration-1000 overflow-x-hidden
      ${isDarkMode ? "bg-[#030305] text-gray-200" : "bg-[#fcfcfd] text-gray-800"}`}>
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <Stars radius={100} depth={50} count={5000} factor={5} saturation={1} fade speed={2} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
            <Suspense fallback={null}>
              <TechCrystal isDarkMode={isDarkMode} />
              <ConnectionLines />
            </Suspense>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
          </Canvas>
        </div>

        <motion.div 
          style={heroStyle} 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center text-center px-6 space-y-8"
        >
          {/* Seletor de Idioma */}
          <div className="flex justify-center mb-4 gap-2">
            {[
              { id: 'pt', label: 'Português', icon: '🇧🇷' },
              { id: 'en', label: 'English', icon: '🇺🇸' },
              { id: 'ko', label: '한국어', icon: '🇰🇷' }
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setLang(l.id as 'pt' | 'en' | 'ko');
                  localStorage.setItem('srmt_lang', l.id);
                  window.dispatchEvent(new Event('storage'));
                }}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${lang === l.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'}`}
              >
                <span>{l.icon}</span> {l.label}
              </button>
            ))}
          </div>

          <motion.div variants={itemVariants} className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border backdrop-blur-3xl mb-4 shadow-[0_0_30px_rgba(0,240,255,0.2)] ${isDarkMode ? 'bg-blue-600/10 border-[#00f0ff]/30 text-[#00f0ff]' : 'bg-blue-500/5 border-blue-500/20 text-blue-600'}`}>
            <Cpu className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">SRMT Ecosystem v2.0</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className={`text-7xl md:text-[10rem] font-black tracking-[-0.05em] leading-none text-transparent bg-clip-text bg-gradient-to-br select-none drop-shadow-2xl ${isDarkMode ? 'from-white via-blue-200 to-[#00f0ff]' : 'from-gray-900 via-blue-600 to-[#00f0ff]'}`}>
            SRMT.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-3xl max-w-3xl font-bold opacity-70 tracking-tight">
            {t.hero.subtitle}<span className="text-[#00f0ff]">{t.hero.h1}</span>{t.hero.and}<span className="text-[#b026ff]">{t.hero.h2}</span>.
          </motion.p>
          
          <motion.div variants={itemVariants} className="pt-10 flex gap-4">
            <Button className={`h-16 px-10 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] ${isDarkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'}`}>
              {t.hero.explore} <ArrowRight className="ml-3" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce"
        >
          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>{t.hero.scroll}</span>
          <ChevronRight className={`rotate-90 w-4 h-4 ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`} />
        </motion.div>
      </section>

      {/* Tech Stack Section */}
      <section className="w-full max-w-[1600px] px-6 py-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`relative h-[600px] rounded-[3rem] overflow-hidden border transition-all duration-500 ${isDarkMode ? 'border-white/5 bg-[#050508] shadow-[0_0_100px_rgba(59,130,246,0.1)]' : 'border-black/5 bg-gray-50 shadow-xl'}`}
        >
           <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <Suspense fallback={null}>
                <PresentationControls global rotation={[0, 0.3, 0]} polar={[-0.4, 0.2]} azimuth={[-1, 0.75]}>
                  <Float rotationIntensity={2} floatIntensity={2} speed={3}>
                    <Box args={[1.5, 1.5, 1.5]}>
                      <meshStandardMaterial color="#00f0ff" wireframe />
                    </Box>
                    <Box args={[1, 1, 1]} position={[0, 0, 0]}>
                      <meshStandardMaterial color="#b026ff" emissive="#b026ff" emissiveIntensity={1.5} />
                    </Box>
                  </Float>
                </PresentationControls>
                <Environment preset="city" />
                <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4.5} color="#000" />
              </Suspense>
           </Canvas>
           <div className={`absolute bottom-10 left-10 right-10 p-8 rounded-3xl backdrop-blur-2xl border transition-colors ${isDarkMode ? 'bg-black/50 border-white/10 hover:border-white/20' : 'bg-white/70 border-black/5 hover:border-black/10 shadow-lg'}`}>
              <h4 className={`text-xl font-black mb-2 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><Zap className="text-yellow-400" /> {t.tech.latencyTitle}</h4>
              <p className={`text-sm opacity-70 leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.tech.latencyDesc}</p>
           </div>
        </motion.div>

        <div className="space-y-12">
          <SectionHeading 
            icon={Server} 
            badge={t.tech.badge} 
            title={t.tech.title} 
            highlight={t.tech.highlight}
            description={t.tech.desc}
            isDarkMode={isDarkMode}
            color="blue"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Code2, t: "Next.js 14", d: t.tech.nextDesc, c: "blue" },
              { icon: Zap, t: "FastAPI", d: t.tech.fastApiDesc, c: "yellow" },
              { icon: Database, t: "PostgreSQL", d: t.tech.pgDesc, c: "emerald" },
              { icon: ShieldCheck, t: "Proxy Sidia", d: t.tech.proxyDesc, c: "purple" }
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                key={i} 
                className={`p-6 rounded-[2rem] border transition-all duration-300 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)]' : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-xl'}`}
              >
                <item.icon className="w-8 h-8 text-blue-500 mb-4 drop-shadow-md" />
                <h4 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.t}</h4>
                <p className={`text-xs opacity-60 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}>{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence Suite Section */}
      <div className={`w-full border-y transition-colors duration-500 py-40 overflow-hidden ${isDarkMode ? 'bg-gradient-to-b from-[#030305] to-[#080512] border-white/5' : 'bg-gradient-to-b from-gray-50 to-white border-black/5'}`}>
        <section className="w-full max-w-[1600px] mx-auto px-6 space-y-32">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <SectionHeading 
              icon={BrainCircuit} 
              badge={t.ai.badge} 
              title={t.ai.title} 
              highlight={t.ai.highlight}
              description={t.ai.desc}
              isDarkMode={isDarkMode}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                className={`p-10 rounded-[3rem] border transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-purple-600/10 to-blue-600/5 border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)] hover:shadow-[0_0_60px_rgba(168,85,247,0.2)]' : 'bg-white border-purple-100 shadow-xl hover:shadow-2xl'}`}
              >
                <h3 className={`text-3xl font-black mb-6 flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><FileCode2 className="text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" /> STMS XML Tool</h3>
                <p className={`text-lg opacity-70 leading-relaxed mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.ai.xmlDesc}
                </p>
                <div className="flex items-center gap-4 text-sm font-bold text-purple-300 bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20">
                  <BarChart3 className="w-5 h-5" /> {t.ai.xmlMetric}
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                className={`p-10 rounded-[3rem] border transition-colors duration-500 ${isDarkMode ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-gray-100 bg-white hover:bg-gray-50 shadow-lg'}`}
              >
                <h3 className={`text-3xl font-black mb-6 flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><Database className="text-purple-500" /> STMS AI Assist</h3>
                <p className={`text-lg opacity-70 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.ai.dbDesc}
                </p>
              </motion.div>
            </div>
            <ImagePlaceholder label="IA SVP Interface (XML & DB Tool)" url="/ia-svp" isDarkMode={isDarkMode} className="shadow-[0_0_50px_rgba(168,85,247,0.15)] border-purple-500/20" delay={0.3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <ImagePlaceholder label="SVP Assistant Chat" url="/ia-svp" isDarkMode={isDarkMode} className="shadow-[0_0_50px_rgba(59,130,246,0.15)] border-blue-500/20 order-2 lg:order-1" />
            <div className="space-y-8 order-1 lg:order-2">
              <motion.div 
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                className={`p-10 rounded-[3rem] border transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-tr from-blue-600/10 to-indigo-600/5 border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:shadow-[0_0_60px_rgba(59,130,246,0.2)]' : 'bg-white border-blue-100 shadow-xl hover:shadow-2xl'}`}
              >
                <h3 className={`text-3xl font-black mb-6 flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><MessageSquareCode className="text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" /> SVP Assistant Chat</h3>
                <p className={`text-lg opacity-70 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.ai.chatDesc}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Daily Operations Section */}
      <section className="w-full max-w-[1600px] px-6 py-40">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          <div className="w-full lg:w-1/3 sticky top-32">
            <SectionHeading 
              icon={Activity} 
              badge={t.daily.badge} 
              title={t.daily.title} 
              highlight={t.daily.highlight}
              description={t.daily.desc}
              isDarkMode={isDarkMode}
              color="red"
            />
            <div className="mt-12 space-y-6">
               <motion.div whileHover={{ x: 10 }} className={`flex gap-4 p-6 rounded-2xl border transition-colors cursor-default ${isDarkMode ? 'bg-red-500/5 border-red-500/10' : 'bg-white border-red-100 shadow-sm'}`}>
                  <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.3)]"><Activity size={20}/></div>
                  <div>
                    <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.daily.regTitle}</h4>
                    <p className="text-sm opacity-60 italic">URL: /daily-issues</p>
                    <p className={`text-sm opacity-60 mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.daily.regDesc}</p>
                  </div>
               </motion.div>
               <motion.div whileHover={{ x: 10 }} className={`flex gap-4 p-6 rounded-2xl border transition-colors cursor-default ${isDarkMode ? 'bg-red-500/5 border-red-500/10' : 'bg-white border-red-100 shadow-sm'}`}>
                  <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.3)]"><BrainCircuit size={20}/></div>
                  <div>
                    <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.daily.aiTitle}</h4>
                    <p className={`text-sm opacity-60 mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.daily.aiDesc}</p>
                  </div>
               </motion.div>
            </div>
          </div>
          <div className="w-full lg:w-2/3 space-y-10">
            <ImagePlaceholder label="Daily Issues Listing" url="/daily-issues" isDarkMode={isDarkMode} className="border-red-500/20 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]" delay={0.1} />
            <ImagePlaceholder label="Management Dashboard IA Analysis" url="/daily-issues" isDarkMode={isDarkMode} className="border-red-500/20 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Workflow Control Section */}
      <div className={`w-full border-y transition-colors duration-500 py-40 ${isDarkMode ? 'bg-gradient-to-b from-blue-900/5 to-transparent border-blue-500/10' : 'bg-gradient-to-b from-blue-50 to-white border-blue-100'}`}>
        <section className="w-full max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <SectionHeading 
              icon={GitPullRequest} 
              badge={t.workflow.badge} 
              title={t.workflow.title} 
              highlight={t.workflow.highlight}
              description={t.workflow.desc}
              isDarkMode={isDarkMode}
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-10">
              <ImagePlaceholder label="Abertura de Tickets" url="/tickets" isDarkMode={isDarkMode} delay={0.1} />
              <ImagePlaceholder label="Acompanhamento Kanban" url="/tickets/acompanhamento" isDarkMode={isDarkMode} delay={0.2} />
            </div>
            <div className="space-y-10">
              <ImagePlaceholder label="Central de Automações" url="/tickets/automacoes" isDarkMode={isDarkMode} delay={0.3} />
              <ImagePlaceholder label="ROI & Analytics Dashboard" url="/tickets/automacoes/dashboard" isDarkMode={isDarkMode} delay={0.4} />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className={`mt-20 p-12 rounded-[3rem] border backdrop-blur-3xl flex flex-col md:flex-row gap-12 items-center transition-all duration-500 ${isDarkMode ? 'bg-black/40 border-[#00f0ff]/20 shadow-[0_0_60px_rgba(0,240,255,0.05)]' : 'bg-white border-blue-100 shadow-xl'}`}
          >
             <div className="flex-1 space-y-6">
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.workflow.autoTitle}</h3>
                <p className={`text-lg opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.workflow.autoDesc}
                </p>
             </div>
             <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
                <motion.div whileHover={{ scale: 1.05 }} className={`p-6 rounded-2xl border text-center transition-all duration-300 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-blue-50 border-blue-200 shadow-md'}`}>
                   <div className="text-2xl font-black text-blue-400 drop-shadow-md">100%</div>
                   <div className="text-[10px] uppercase font-bold opacity-50">{t.workflow.visibility}</div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className={`p-6 rounded-2xl border text-center transition-all duration-300 ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-emerald-50 border-emerald-200 shadow-md'}`}>
                   <div className="text-2xl font-black text-emerald-400 drop-shadow-md">REAL-TIME</div>
                   <div className="text-[10px] uppercase font-bold opacity-50">{t.workflow.tracking}</div>
                </motion.div>
             </div>
          </motion.div>
        </section>
      </div>

      {/* Resource Planning Section */}
      <section className="w-full max-w-[1600px] px-6 py-40 flex flex-col lg:flex-row items-center gap-20">
        <div className="w-full lg:w-1/2">
          <ImagePlaceholder label="Gestão de Férias e Escala" url="/ferias/gestao" isDarkMode={isDarkMode} className="!aspect-[4/3] border-orange-500/20 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]" />
        </div>
        <div className="w-full lg:w-1/2 space-y-8">
          <SectionHeading 
            icon={CalendarDays} 
            badge={t.resource.badge} 
            title={t.resource.title} 
            highlight={t.resource.highlight}
            description={t.resource.desc}
            isDarkMode={isDarkMode}
            color="orange"
          />
          <div className="grid grid-cols-1 gap-4">
            <motion.div whileHover={{ x: -10 }} className={`flex gap-4 p-6 rounded-2xl border cursor-default transition-all duration-300 ${isDarkMode ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'bg-white border-orange-100 shadow-sm hover:shadow-md'}`}>
               <ShieldCheck className="text-orange-500 shrink-0 drop-shadow-[0_0_100px_rgba(249,115,22,0.5)]" />
               <div>
                 <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.resource.kpTitle}</h4>
                 <p className={`text-sm opacity-60 mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.resource.kpDesc}</p>
               </div>
            </motion.div>
            <motion.div whileHover={{ x: -10 }} className={`flex gap-4 p-6 rounded-2xl border cursor-default transition-all duration-300 ${isDarkMode ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'bg-white border-orange-100 shadow-sm hover:shadow-md'}`}>
               <CheckCircle className="text-orange-500 shrink-0 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
               <div>
                 <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.resource.workTitle}</h4>
                 <p className={`text-sm opacity-60 mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.resource.workDesc}</p>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Quality Section */}
      <div className={`w-full border-y transition-colors duration-500 py-40 ${isDarkMode ? 'bg-[#0a0a0c] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
        <section className="w-full max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <ImagePlaceholder label="Remarks SVP" url="/remarks" isDarkMode={isDarkMode} className="border-zinc-500/30 hover:shadow-[0_0_40px_rgba(161,161,170,0.15)]" />
          </div>
          <div className={`space-y-8 order-1 lg:order-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <SectionHeading 
              icon={FileCheck2} 
              badge={t.data.badge} 
              title={t.data.title} 
              highlight={t.data.highlight}
              description={t.data.desc}
              isDarkMode={isDarkMode}
              color="zinc"
            />
            <p className={`text-lg opacity-70 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.data.remarkDesc}
            </p>
            <div className="flex flex-wrap gap-3">
               {['Validation Rules', 'Project IDs', 'Uniform Formatting', 'Audit Ready'].map((txt, i) => (
                 <motion.span 
                   key={i} 
                   whileHover={{ scale: 1.1, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                   className={`px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-widest cursor-default transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
                 >
                   {txt}
                 </motion.span>
               ))}
            </div>
          </div>
        </section>
      </div>

      {/* AI Interaction Lab */}
      <section className="w-full max-w-[1600px] px-6 py-40">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto mb-20">
          <SectionHeading 
            icon={Sparkles} 
            badge={t.lab.badge} 
            title={t.lab.title} 
            highlight={t.lab.highlight}
            description={t.lab.desc}
            isDarkMode={isDarkMode}
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Chart Generation */}
          <Card className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
             <div className="flex-1">
                <h3 className={`text-2xl font-black mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><BarChart2 className="text-blue-500" /> {t.lab.chartTitle}</h3>
                <p className={`opacity-70 mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.lab.chartDesc}</p>
                <Button onClick={generateAIChart} disabled={isGeneratingChart} className="rounded-full h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20">
                    {isGeneratingChart ? <Loader2 className="animate-spin mr-2" size={18} /> : <Sparkles className="mr-2" size={18} />} {t.lab.chartBtn}
                </Button>
             </div>
             
             {chartData && (
               <div className="mt-10 animate-in fade-in zoom-in duration-500">
                  <AIChart 
                    type={chartData.type} 
                    title={chartData.title} 
                    data={chartData.data} 
                    isDarkMode={isDarkMode} 
                  />
               </div>
             )}
          </Card>

          {/* Report Generation */}
          <Card className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
             <div className="flex-1">
                <h3 className={`text-2xl font-black mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><FileText className="text-emerald-500" /> {t.lab.reportTitle}</h3>
                <p className={`opacity-70 mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.lab.reportDesc}</p>
                <Button onClick={generateSVPReport} disabled={isGeneratingReport} className="rounded-full h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20">
                    {isGeneratingReport ? <Loader2 className="animate-spin mr-2" size={18} /> : <Zap className="mr-2" size={18} />} {t.lab.reportBtn}
                </Button>
             </div>

             {reportText && (
               <div className={`mt-10 p-6 rounded-2xl border font-mono text-[11px] leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[400px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-black/40 border-white/10 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
                  {reportText}
               </div>
             )}
          </Card>

          {/* Log Analysis Idea */}
          <Card className={`p-10 rounded-[3rem] border lg:col-span-2 transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-r from-blue-600/5 to-purple-600/5 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
             <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-1">
                   <h3 className={`text-2xl font-black mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><Code2 className="text-purple-500" /> {t.lab.logTitle}</h3>
                   <p className={`opacity-70 mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.lab.logDesc}</p>
                   <Button onClick={analyzeLogs} disabled={isAnalyzingLog} className="rounded-full h-12 px-8 bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/20">
                      {isAnalyzingLog ? <Loader2 className="animate-spin mr-2" size={18} /> : <BrainCircuit className="mr-2" size={18} />} {t.lab.logBtn}
                   </Button>
                </div>
                {logResult && (
                  <div className={`flex-1 p-6 rounded-2xl border animate-in fade-in duration-500 self-stretch ${isDarkMode ? 'bg-black/20 border-purple-500/20' : 'bg-purple-50 border-purple-100'}`}>
                     <div className="flex items-center gap-2 text-purple-500 font-bold mb-4 text-xs uppercase tracking-widest"><AlertCircle size={16}/> {t.lab.diagnostic}</div>
                     <p className={`text-sm italic leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{logResult}</p>
                  </div>
                )}
             </div>
          </Card>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="w-full py-40 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <Canvas>
              <Stars radius={50} depth={50} count={3000} factor={4} saturation={1} fade speed={1.5} />
           </Canvas>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }} 
          className="relative z-10 space-y-10"
        >
          <h2 className={`text-5xl md:text-7xl font-black tracking-tight leading-tight drop-shadow-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.footer.title1} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#b026ff]">{t.footer.title2}</span>
          </h2>
          <Button className={`h-20 px-16 rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-blue-600 hover:bg-[#00f0ff] hover:text-black text-white shadow-blue-500/50 hover:shadow-[0_0_80px_rgba(0,240,255,0.6)]' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'}`}>
            {t.footer.btn} <ArrowRight className="ml-4 w-6 h-6" />
          </Button>
          <p className={`text-[10px] font-black uppercase tracking-[0.5em] opacity-40 pt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.footer.built}</p>
        </motion.div>
      </section>

    </div>
  );
}