'use client';

import React, { useState } from 'react';
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  FileText,
  LayoutGrid,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

// ==========================================
// 1. CONFIGURAÇÃO & DADOS
// ==========================================

const modules = [
  {
    key: "login",
    title: "Acesso seguro e onboarding",
    description: "Login com credenciais CORP e cadastro guiado do time.",
    icon: ShieldCheck,
    href: "/login",
    color: "blue",
    tag: "Acesso",
    pill: "Login seguro"
  },
  {
    key: "ferias",
    title: "Solicitar férias",
    description: "Planejamento com regras CLT e calendário da equipe.",
    icon: CalendarRange,
    href: "/ferias",
    color: "emerald",
    tag: "Férias",
    pill: "Solicitar férias"
  },
  {
    key: "gestao-ferias",
    title: "Gestão de ausências",
    description: "Visão gerencial, filtros e indicadores do time.",
    icon: LayoutGrid,
    href: "/ferias/gestao",
    color: "blue",
    tag: "Gestão",
    pill: "Gestão do time"
  },
  {
    key: "aprovacao-ferias",
    title: "Aprovação de solicitações",
    description: "Aprove ou rejeite pedidos pendentes rapidamente.",
    icon: CheckCircle2,
    href: "/ferias/aprovacao",
    color: "emerald",
    tag: "Aprovação",
    pill: "Aprovação"
  },
  {
    key: "remarks",
    title: "Gerador de Remarks",
    description: "Relatórios padronizados para SVP, FOTA e Wearables.",
    icon: FileText,
    href: "/remarks",
    color: "purple",
    tag: "Relatórios",
    pill: "Gerar remarks"
  },
  {
    key: "workload",
    title: "Workload & Alocação",
    description: "Dashboard de carga e distribuição de tarefas.",
    icon: BarChart3,
    href: "/Construcao",
    color: "orange",
    tag: "Workload",
    status: "Em construção",
    pill: "Workload (em breve)"
  },
  {
    key: "daily-issues",
    title: "Daily Issues",
    description: "Cadastre projetos e acompanhe problemas e bugs diários.",
    icon: LayoutGrid, // You can change this to another suitable icon like ListTodo if imported
    href: "/daily-issues",
    color: "emerald",
    tag: "Issues",
    pill: "Daily Issues"
  }
];

const capabilityPills = modules.map((module) => ({
  key: module.key,
  label: module.pill || module.title,
  icon: module.icon
}));

// ==========================================
// 2. PÁGINA HOME (PRINCIPAL)
// ==========================================

export default function Home() {
  const { isDarkMode, toggleTheme } = useTheme();

  // --- DESIGN SYSTEM: BACKGROUND & CARDS ---
  const mainBgClass = isDarkMode
    ? "bg-gradient-to-br from-[#050505] to-[#121212] text-gray-200"
    : "bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] text-gray-800";

  const getCardStyle = (color: string) => {
    // Mapeamento de cores para gradientes sutis
    const gradients: Record<string, string> = {
      blue: isDarkMode ? 'from-blue-500/20 to-blue-600/5' : 'from-blue-100/80 to-blue-50/50',
      purple: isDarkMode ? 'from-purple-500/20 to-purple-600/5' : 'from-purple-100/80 to-purple-50/50',
      orange: isDarkMode ? 'from-orange-500/20 to-orange-600/5' : 'from-orange-100/80 to-orange-50/50',
      emerald: isDarkMode ? 'from-emerald-500/20 to-emerald-600/5' : 'from-emerald-100/80 to-emerald-50/50',
    };

    const borderColor = isDarkMode ? 'border-white/10 group-hover:border-white/20' : 'border-white/60 group-hover:border-white/80';
    const bgBase = isDarkMode ? 'bg-[#1a1a1a]/40' : 'bg-white/40';

    return `${bgBase} bg-gradient-to-br ${gradients[color]} border ${borderColor} backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 rounded-3xl p-6 h-full flex flex-col justify-between group relative overflow-hidden`;
  };

  return (
    <div className={`relative flex min-h-screen flex-col font-sans transition-colors duration-500 ${mainBgClass}`}>

      {/* Background Glow Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] left-[20%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} />
        <div className={`absolute top-[40%] -right-[10%] w-[35%] h-[35%] rounded-full blur-[100px] opacity-20 ${isDarkMode ? 'bg-purple-600' : 'bg-blue-400'}`} />
        <div className={`absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-15 ${isDarkMode ? 'bg-emerald-600' : 'bg-emerald-400'}`} />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center px-6 pb-24 pt-10">
        <div className="w-full max-w-6xl flex flex-col gap-16">

          {/* HERO SECTION */}
          <section className="flex flex-col items-center text-center gap-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-700">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] border backdrop-blur-md
                ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-white/60 border-white/60 text-blue-600 shadow-sm'}`}>
              <Sparkles className="size-3" />
              Sidia | SVP Hub
            </span>

            <div className="space-y-6">
              <h1 className={`text-5xl md:text-7xl font-semibold leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Tudo o que o SRMT faz,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">em um só lugar.</span>
              </h1>
              <p className={`text-lg md:text-xl leading-relaxed max-w-3xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Login seguro, férias, aprovações e remarks com a mesma experiência leve. Workload e alocação em breve.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {capabilityPills.map((item) => {
                const Icon = item.icon;
                return (
                  <span
                    key={item.key}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5
                      ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10' : 'bg-white/70 border-white/60 text-gray-700 hover:bg-white'}`}
                  >
                    <Icon className="size-3" />
                    {item.label}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className={`rounded-full px-8 py-6 text-sm font-medium transition-all shadow-lg hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`} asChild>
                <Link href="/login">
                  Acessar Plataforma
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </section>

          {/* GRID DE MÓDULOS */}
          <section id="modulos" className="space-y-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <h2 className={`text-2xl md:text-3xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tudo o que o site entrega
                </h2>
                <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Cada módulo cobre uma etapa do fluxo SVP, do acesso ao relatório final.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {modules.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="h-full motion-safe:animate-in motion-safe:fade-in duration-700">
                    <div className={getCardStyle(item.color)}>
                      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em]">
                        <span className={`rounded-full px-3 py-1 border backdrop-blur-md ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white/70 border-white/70 text-gray-600'}`}>
                          {item.tag}
                        </span>
                        {item.status && (
                          <span className={`rounded-full px-3 py-1 border ${isDarkMode ? 'bg-orange-500/10 border-orange-400/20 text-orange-300' : 'bg-orange-100 border-orange-200 text-orange-600'}`}>
                            {item.status}
                          </span>
                        )}
                      </div>

                      {/* Icone */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mt-6 mb-6 transition-transform duration-500 group-hover:scale-110 shadow-inner
                          ${isDarkMode
                          ? 'bg-white/5 border border-white/10 text-gray-200'
                          : 'bg-white/80 border border-white/50 text-gray-700'
                        }`}>
                        <Icon className={`size-6 ${item.color === 'blue' ? 'text-blue-500' :
                            item.color === 'purple' ? 'text-purple-500' :
                              item.color === 'orange' ? 'text-orange-500' : 'text-emerald-500'
                          }`} />
                      </div>

                      {/* Texto */}
                      <div className="space-y-3 relative z-10">
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.title}
                        </h3>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.description}
                        </p>
                      </div>

                      {/* Efeito Hover Sutil */}
                      <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none transform translate-x-10 translate-y-10
                          ${item.color === 'blue' ? 'bg-blue-400' :
                          item.color === 'purple' ? 'bg-blue-400' :
                            item.color === 'orange' ? 'bg-orange-400' : 'bg-emerald-400'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}