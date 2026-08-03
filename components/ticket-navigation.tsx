'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';

type RecordType = 'ticket' | 'improvement' | 'project';

interface TicketNavigationProps {
  activeTab?: RecordType;
  onTabChange?: (tab: RecordType) => void;
}

export function TicketNavigation({ activeTab, onTabChange }: TicketNavigationProps) {
  const { isDarkMode } = useTheme();
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  const isLinkActive = (path: string) => pathname === path;

  // --- DESIGN SYSTEM: ALINHADO COM APP/FERIAS ---
  const glassContainerClass = isDarkMode
    ? 'bg-black/40 border-white/10 shadow-2xl shadow-black/40'
    : 'bg-white/80 border-black/5 shadow-2xl shadow-black/5';

  const getButtonClass = (active: boolean) => `
    px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all
    ${active
      ? "bg-blue-600 text-white shadow-xl"
      : "opacity-40 hover:opacity-100"
    }
  `;

  const separatorClass = isDarkMode ? 'bg-white/20' : 'bg-black/10';

  return (
    <div className={`flex flex-wrap items-center justify-center p-1.5 rounded-xl border backdrop-blur-3xl ${glassContainerClass}`}>
      
      {(['ticket', 'improvement', 'project'] as RecordType[]).map((tab) => {
        const label = tab === 'ticket' ? 'Tickets' : tab === 'improvement' ? 'Melhoria' : 'Projeto';
        const active = (pathname === '/tickets' && activeTab === tab);
        
        if (onTabChange && pathname === '/tickets') {
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={getButtonClass(active)}
            >
              {label}
            </button>
          );
        }

        return (
          <Link
            key={tab}
            href={`/tickets?type=${tab}`}
            className={getButtonClass(active)}
          >
            {label}
          </Link>
        );
      })}

      <Link 
        href="/tickets/dashboard" 
        className={getButtonClass(isLinkActive('/tickets/dashboard'))}
      >
        Dashboard
      </Link>

      <Link 
        href="/tickets/acompanhamento" 
        className={getButtonClass(isLinkActive('/tickets/acompanhamento'))}
      >
        Acompanhamento
      </Link>

      <div className={`w-px h-6 my-auto mx-2 ${separatorClass}`} />

      <Link 
        href="/tickets/automacoes" 
        className={getButtonClass(isLinkActive('/tickets/automacoes'))}
      >
        Automações
      </Link>

      <Link 
        href="/tickets/automacoes/dashboard" 
        className={getButtonClass(isLinkActive('/tickets/automacoes/dashboard'))}
      >
        Dashboard Automações
      </Link>

      <Link 
        href="/tickets/automacoes/acompanhamento" 
        className={getButtonClass(isLinkActive('/tickets/automacoes/acompanhamento'))}
      >
        Gestão Automações
      </Link>
    </div>
  );
}
