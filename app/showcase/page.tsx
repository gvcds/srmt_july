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
  FileText,
  KanbanSquare,
  Timer,
  AreaChart,
  Library
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

const RotatingStarField = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.15;
    }
  });
  return (
    <group ref={groupRef}>
      <Stars radius={60} depth={60} count={2000} factor={3} saturation={1} fade speed={3} />
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

const ToolCard = ({ icon: Icon, title, description, url, isDarkMode, color = "blue", delay = 0 }: any) => {
  const colors: any = {
    blue: "from-blue-500/10 to-transparent border-blue-500/20 text-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    purple: "from-purple-500/10 to-transparent border-purple-500/20 text-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    emerald: "from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    orange: "from-orange-500/10 to-transparent border-orange-500/20 text-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
    zinc: "from-zinc-500/10 to-transparent border-zinc-500/20 text-zinc-500 hover:shadow-[0_0_30px_rgba(161,161,170,0.15)]",
    red: "from-red-500/10 to-transparent border-red-500/20 text-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]"
  };

  return (
    <a href={url} className="block group w-full h-full">
      <motion.div 
        whileHover={{ y: -5, scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay, duration: 0.5 }}
        className={`p-8 rounded-[2rem] border bg-gradient-to-br backdrop-blur-xl transition-all duration-300 shadow-lg h-full flex flex-col 
        ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'} ${colors[color]}`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border bg-black/5 dark:bg-white/5 shrink-0`}>
          <Icon className="w-7 h-7" />
        </div>
        <h3 className={`text-2xl font-black mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-current group-hover:to-current transition-colors`}>{title}</h3>
        <p className={`text-sm opacity-70 leading-relaxed flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
        <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
          Acessar Módulo <ArrowRight className="w-4 h-4" />
        </div>
      </motion.div>
    </a>
  );
};

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
        highlight: "Tracking.",
        desc: "Acompanhamento em tempo real de impedimentos, tarefas e horas trabalhadas.",
        regTitle: "Registro Direto",
        regDesc: "O time reporta problemas diários com severidade e status, garantindo que nada se perca.",
        aiTitle: "IA Dashboard Analysis",
        aiDesc: "A inteligência artificial lê todas as issues e gera um resumo executivo automático.",
        kanbanTitle: "Kanban Board",
        kanbanDesc: "Organização visual das tarefas de rotina em um quadro Kanban focado em produtividade.",
        timeTitle: "Time Semanal",
        timeDesc: "Controle de apontamento de horas para gerenciar a distribuição do esforço da equipe."
      },
      workflow: {
        badge: "Workflow Control",
        title: "Tickets Lifecycle & ",
        highlight: "Analytics.",
        desc: "Gerenciamos fluxos de solicitações e visualizamos indicadores de performance em tempo real.",
        autoTitle: "Automação com Propósito",
        autoDesc: "O módulo /tickets/automacoes permite gerenciar scripts e visualizar a economia em Homem-Hora.",
        metricsTitle: "Métricas & Dashboards",
        metricsDesc: "Visão executiva com gráficos dinâmicos sobre qualidade, produtividade e cobertura de testes.",
        visibility: "Visibilidade",
        tracking: "Tracking"
      },
      resource: {
        badge: "Resource Planning",
        title: "Planejamento de Férias & ",
        highlight: "Capacidade.",
        desc: "Sistema de gestão de escala para garantir que o time nunca fique desguarnecido de KPs (Key Persons).",
        kpTitle: "Gestão de Escala e Férias",
        kpDesc: "O sistema detecta conflitos se um KP e seu backup solicitarem férias no mesmo período.",
        workTitle: "Workflow de Aprovação",
        workDesc: "Fluxo simplificado para gestores validarem ausências baseadas na capacidade atual do time."
      },
      data: {
        badge: "Data & Documentation",
        title: "Base de Conhecimento & ",
        highlight: "Remarks.",
        desc: "Centralizamos e padronizamos todas as informações vitais do projeto.",
        remarkDesc: "Padronização rigorosa da escrita técnica dos projetos para garantir auditorias limpas.",
        kbTitle: "Knowledge Base",
        kbDesc: "A base de dados da nossa IA. Alimenta o SVP Assistant com contexto técnico, guias de arquitetura e glossários para respostas precisas e contextualizadas."
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
        highlight: "Tracking.",
        desc: "Real-time tracking of impediments, tasks, and worked hours.",
        regTitle: "Direct Logging",
        regDesc: "The team reports daily problems with severity and status, ensuring nothing is lost.",
        aiTitle: "AI Dashboard Analysis",
        aiDesc: "Artificial intelligence reads all issues and generates an automatic executive summary.",
        kanbanTitle: "Kanban Board",
        kanbanDesc: "Visual organization of routine tasks in a Kanban board focused on productivity.",
        timeTitle: "Weekly Time",
        timeDesc: "Time tracking control to manage the distribution of team effort."
      },
      workflow: {
        badge: "Workflow Control",
        title: "Ticket Lifecycle & ",
        highlight: "Analytics.",
        desc: "We manage request flows and visualize performance indicators in real time.",
        autoTitle: "Automation with Purpose",
        autoDesc: "The tickets module allows managing scripts and visualizing Man-Hour savings.",
        metricsTitle: "Metrics & Dashboards",
        metricsDesc: "Executive view with dynamic charts on quality, productivity, and test coverage.",
        visibility: "Visibility",
        tracking: "Tracking"
      },
      resource: {
        badge: "Resource Planning",
        title: "Vacation Planning & ",
        highlight: "Capacity.",
        desc: "Schedule management system to ensure the team is never left without KPs (Key Persons).",
        kpTitle: "Schedule and Vacations Management",
        kpDesc: "The system automatically detects conflicts if a KP and their backup request vacation.",
        workTitle: "Approval Workflow",
        workDesc: "Simplified flow for managers to validate absences based on current team capacity."
      },
      data: {
        badge: "Data & Documentation",
        title: "Knowledge Base & ",
        highlight: "Remarks.",
        desc: "We centralize and standardize all vital project information.",
        remarkDesc: "Strict standardization of technical writing to ensure clean audits.",
        kbTitle: "Knowledge Base",
        kbDesc: "The AI's knowledge database. Feeds the SVP Assistant with technical context, architecture guides, and glossaries for precise, contextualized responses."
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
        highlight: "추적.",
        desc: "장애물, 작업 및 근무 시간의 실시간 추적.",
        regTitle: "직접 로깅",
        regDesc: "팀은 심각도 및 상태와 함께 일일 문제를 보고하여 누락되는 것이 없도록 합니다.",
        aiTitle: "AI 대시보드 분석",
        aiDesc: "인공 지능이 모든 문제를 읽고 자동 경영진 요약을 생성합니다.",
        kanbanTitle: "칸반 보드",
        kanbanDesc: "생산성에 초점을 맞춘 칸반 보드에서 일상 작업의 시각적 구성.",
        timeTitle: "주간 시간",
        timeDesc: "팀의 노력을 관리하기 위한 시간 추적 제어."
      },
      workflow: {
        badge: "워크플로우 제어",
        title: "티켓 수명 주기 및 ",
        highlight: "분석.",
        desc: "요청 흐름을 관리하고 실시간으로 성과 지표를 시각화합니다.",
        autoTitle: "목적이 있는 자동화",
        autoDesc: "티켓 모듈을 사용하면 스크립트를 관리하고 공수(HH) 절감 효과를 시각화할 수 있습니다.",
        metricsTitle: "지표 및 대시보드",
        metricsDesc: "품질, 생산성 및 테스트 적용 범위에 대한 동적 차트가 포함된 경영진 뷰.",
        visibility: "가시성",
        tracking: "추적"
      },
      resource: {
        badge: "자원 계획",
        title: "휴가 계획 및 ",
        highlight: "용량.",
        desc: "팀에 핵심 인력(KP)이 부족하지 않도록 보장하는 일정 관리 시스템.",
        kpTitle: "일정 및 휴가 관리",
        kpDesc: "KP와 그들의 백업이 휴가를 요청하면 시스템이 자동으로 충돌을 감지합니다.",
        workTitle: "승인 워크플로우",
        workDesc: "관리자가 현재 팀 용량을 기반으로 부재를 확인하기 위한 간소화된 흐름."
      },
      data: {
        badge: "데이터 및 문서",
        title: "지식 기반 및 ",
        highlight: "비고.",
        desc: "모든 중요한 프로젝트 정보를 중앙 집중화하고 표준화합니다.",
        remarkDesc: "완벽한 감사를 보장하기 위해 기술 작성의 엄격한 표준화.",
        kbTitle: "지식 기반",
        kbDesc: "AI의 지식 데이터베이스. 정확하고 맥락화된 응답을 위해 기술 컨텍스트, 아키텍처 가이드 및 용어집을 SVP 어시스턴트에 공급합니다."
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            <ToolCard icon={FileCode2} title="STMS XML Tool" description={t.ai.xmlDesc} url="/ia-svp" isDarkMode={isDarkMode} color="purple" delay={0.1} />
            <ToolCard icon={Database} title="STMS AI Assist" description={t.ai.dbDesc} url="/ia-svp" isDarkMode={isDarkMode} color="purple" delay={0.2} />
            <ToolCard icon={MessageSquareCode} title="SVP Assistant Chat" description={t.ai.chatDesc} url="/ia-svp" isDarkMode={isDarkMode} color="blue" delay={0.3} />
          </div>
        </section>
      </div>





      {/* Workflow Control Section */}
      <div className={`w-full border-b transition-colors duration-500 py-40 ${isDarkMode ? 'bg-gradient-to-b from-blue-900/5 to-transparent border-blue-500/10' : 'bg-gradient-to-b from-blue-50 to-white border-blue-100'}`}>
        <section className="w-full max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto mb-20">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
             <ToolCard icon={GitPullRequest} title={t.workflow.autoTitle} description={t.workflow.autoDesc} url="/tickets" isDarkMode={isDarkMode} color="blue" delay={0.1} />
             <ToolCard icon={AreaChart} title={t.workflow.metricsTitle} description={t.workflow.metricsDesc} url="/metricas" isDarkMode={isDarkMode} color="purple" delay={0.2} />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className={`p-12 rounded-[3rem] border backdrop-blur-3xl flex flex-col md:flex-row gap-12 items-center transition-all duration-500 ${isDarkMode ? 'bg-black/40 border-[#00f0ff]/20 shadow-[0_0_60px_rgba(0,240,255,0.05)]' : 'bg-white border-blue-100 shadow-xl'}`}
          >
             <div className="flex-1 space-y-6">
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Automação e Analytics</h3>
                <p className={`text-lg opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Monitoramento contínuo com dashboards atualizados em tempo real, fornecendo controle total sobre o ecossistema do projeto.
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
      <section className="w-full max-w-[1600px] px-6 py-40 mx-auto">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto mb-20">
          <SectionHeading 
            icon={CalendarDays} 
            badge={t.resource.badge} 
            title={t.resource.title} 
            highlight={t.resource.highlight}
            description={t.resource.desc}
            isDarkMode={isDarkMode}
            color="orange"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ToolCard icon={ShieldCheck} title={t.resource.kpTitle} description={t.resource.kpDesc} url="/ferias" isDarkMode={isDarkMode} color="orange" delay={0.1} />
          <ToolCard icon={CheckCircle} title={t.resource.workTitle} description={t.resource.workDesc} url="/ferias/aprovacao" isDarkMode={isDarkMode} color="emerald" delay={0.2} />
        </div>
      </section>

      {/* Workload & Admin Section */}
      <div className={`w-full border-y transition-colors duration-500 py-40 overflow-hidden ${isDarkMode ? 'bg-[#050508] border-white/5' : 'bg-gradient-to-b from-blue-50/50 to-white border-gray-100'}`}>
        <section className="w-full max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto mb-20">
            <SectionHeading 
              icon={Activity} 
              badge="Team Management" 
              title="Workload & " 
              highlight="Admin."
              description="Controle de capacidade da equipe, gestão de usuários e monitoramento de horas trabalhadas em tempo real."
              isDarkMode={isDarkMode}
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Workload Card com gráfico animado */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className={`p-10 rounded-[3rem] border relative overflow-hidden group ${isDarkMode ? 'bg-gradient-to-br from-[#0a0a12] to-[#0e0e18] border-indigo-500/20' : 'bg-white border-indigo-100 shadow-xl'}`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full" />
              <div className="relative z-10">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-6 ${isDarkMode ? 'bg-white/5 border-white/10 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Capacidade e Planejamento</span>
                </div>
                <h3 className={`text-3xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Workload Geral</h3>
                <p className={`text-sm opacity-70 mb-8 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Visualize o tempo de trabalho disponível por equipe, descontando automaticamente ausências e faltas registradas no sistema.
                </p>
                {/* Animated bar chart */}
                <div className="flex items-end gap-3 h-32 mt-6">
                  {[65, 85, 42, 78, 55, 91, 38, 70, 60, 82, 45, 73].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, duration: 0.8, ease: 'easeOut' }}
                      className={`flex-1 rounded-t-lg ${i % 3 === 0 ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' : i % 3 === 1 ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-gradient-to-t from-purple-600 to-purple-400'} opacity-80 group-hover:opacity-100 transition-opacity`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-3">
                  {['QA', 'DEV', 'SDET', 'OPS'].map((label, i) => (
                    <span key={i} className={`text-[9px] font-bold uppercase tracking-widest opacity-40 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</span>
                  ))}
                </div>
              </div>
              <a href="/Construcao" className="absolute inset-0 z-20" />
            </motion.div>

            {/* Admin Card com gráfico animado */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className={`p-10 rounded-[3rem] border relative overflow-hidden group ${isDarkMode ? 'bg-gradient-to-br from-[#0a0c0a] to-[#0e120e] border-emerald-500/20' : 'bg-white border-emerald-100 shadow-xl'}`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
              <div className="relative z-10">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-6 ${isDarkMode ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Painel Administrativo</span>
                </div>
                <h3 className={`text-3xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h3>
                <p className={`text-sm opacity-70 mb-8 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Gestão completa de usuários, logs de acesso, controle de faltas e gráficos de atividade do sistema com recharts.
                </p>
                {/* Animated line chart SVG */}
                <div className="relative h-32 mt-6 overflow-hidden rounded-2xl">
                  <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0,80 C30,60 60,90 100,50 C140,10 170,70 200,40 C230,10 260,60 300,30 C340,0 370,50 400,20"
                      fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: 'easeInOut' }}
                    />
                    <motion.path
                      d="M0,80 C30,60 60,90 100,50 C140,10 170,70 200,40 C230,10 260,60 300,30 C340,0 370,50 400,20 L400,120 L0,120 Z"
                      fill="url(#lineGrad)"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1, duration: 1 }}
                    />
                    {/* Animated dots */}
                    {[[0,80],[100,50],[200,40],[300,30],[400,20]].map(([cx,cy], i) => (
                      <motion.circle
                        key={i} cx={cx} cy={cy} r="4" fill="#10b981"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 * i + 0.5, duration: 0.3 }}
                      />
                    ))}
                  </svg>
                  {/* Pulse indicator */}
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Live</span>
                  </div>
                </div>
              </div>
              <a href="/admin" className="absolute inset-0 z-20" />
            </motion.div>
          </div>

          {/* Animated AI Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '7h', label: 'Horas / Pessoa', color: 'blue' },
              { value: '98.2%', label: 'Uptime do Sistema', color: 'emerald' },
              { value: '24/7', label: 'Monitoramento IA', color: 'purple' },
              { value: '< 200ms', label: 'Latência API', color: 'orange' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-[2rem] border text-center transition-all duration-300 ${
                  isDarkMode 
                    ? `bg-${stat.color === 'blue' ? 'blue' : stat.color === 'emerald' ? 'emerald' : stat.color === 'purple' ? 'purple' : 'orange'}-500/5 border-white/10 hover:border-white/20` 
                    : 'bg-white border-gray-100 shadow-lg hover:shadow-xl'
                }`}
              >
                <motion.div 
                  className={`text-3xl font-black mb-2 ${isDarkMode ? `text-${stat.color === 'blue' ? 'blue' : stat.color === 'emerald' ? 'emerald' : stat.color === 'purple' ? 'purple' : 'orange'}-400` : 'text-gray-900'}`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className={`text-[10px] font-bold uppercase tracking-widest opacity-50 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Data Quality Section */}
      <div className={`w-full border-y transition-colors duration-500 py-40 ${isDarkMode ? 'bg-gradient-to-b from-[#030305] to-[#080512] border-white/5' : 'bg-gradient-to-b from-gray-50 to-white border-black/5'}`}>
        <section className="w-full max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto mb-20">
            <SectionHeading 
              icon={FileCheck2} 
              badge={t.data.badge} 
              title={t.data.title} 
              highlight={t.data.highlight}
              description={t.data.desc}
              isDarkMode={isDarkMode}
              color="zinc"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ToolCard icon={FileText} title="Padronização de Remarks" description={t.data.remarkDesc} url="/remarks" isDarkMode={isDarkMode} color="zinc" delay={0.1} />
            <ToolCard icon={Library} title={t.data.kbTitle} description={t.data.kbDesc} url="/knowledge-base" isDarkMode={isDarkMode} color="blue" delay={0.2} />
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
           <Canvas camera={{ position: [0, 0, 1] }}>
              <Stars radius={100} depth={80} count={5000} factor={6} saturation={0} fade speed={2} />
              <RotatingStarField />
           </Canvas>
        </div>
        {/* Animated radial glow */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#00f0ff]/20 to-[#b026ff]/20 blur-[100px]"
          />
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