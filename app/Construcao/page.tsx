'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Construction, 
  Hammer, 
  HardHat, 
  Sun, 
  Moon,
  ChevronRight
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { useTheme } from "@/components/theme-provider";

// ==========================================
// 1. PÁGINA EM CONSTRUÇÃO (LIQUID GLASS)
// ==========================================

export default function WorkloadPage() {
  const { isDarkMode, toggleTheme } = useTheme();

  // --- BACKGROUND & LAYOUT ---
  const mainBgClass = isDarkMode 
    ? "bg-gradient-to-br from-[#050505] to-[#121212] text-gray-200" 
    : "bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] text-gray-800";
    
  const cardClass = `relative overflow-hidden rounded-3xl border p-8 flex flex-col items-center justify-center text-center transition-all duration-500
    ${isDarkMode 
      ? 'bg-[#111]/40 border-white/5 backdrop-blur-2xl shadow-2xl shadow-black/40' 
      : 'bg-white/40 border-white/60 backdrop-blur-xl shadow-xl shadow-black/5'}`;

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-8 transition-colors duration-500 ${mainBgClass}`}>
      
      {/* NAVBAR INTEGRADA */}
      <Navbar />

      {/* Background Glow Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[150px] opacity-20 ${isDarkMode ? 'bg-orange-500/20' : 'bg-yellow-400/30'}`} />
      </div>

      <div className="flex-grow flex items-center justify-center w-full max-w-2xl relative z-10">
          
        <div className={cardClass}>
            
            {/* Ícone Animado */}
            <div className={`mb-8 p-6 rounded-full border shadow-lg animate-pulse ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'}`}>
                <Construction className={`w-16 h-16 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
            </div>

            <h1 className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Em Construção
            </h1>
            
            <p className={`text-lg mb-8 max-w-md mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Estamos trabalhando duro para trazer essa funcionalidade para você. O módulo estará disponível em breve.
            </p>

            <div className="flex gap-4">
                <Button 
                    className={`rounded-full px-6 py-6 text-sm font-medium transition-all shadow-lg hover:scale-105 active:scale-95
                        ${isDarkMode 
                            ? 'bg-white text-black hover:bg-gray-200' 
                            : 'bg-black text-white hover:bg-gray-800'}`}
                    onClick={() => window.history.back()}
                >
                    Voltar
                </Button>
                
                <Button 
                    className={`rounded-full px-6 py-6 text-sm font-medium border transition-all hover:scale-105 active:scale-95
                        ${isDarkMode 
                            ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                            : 'bg-white/40 border-black/5 text-black hover:bg-white/60'}`}
                    onClick={() => window.location.href = '/'}
                >
                    Ir para o Início
                    <ChevronRight className="w-4 h-4 ml-2 opacity-60" />
                </Button>
            </div>

            {/* Rodapé Decorativo */}
            <div className={`mt-12 pt-6 border-t w-full flex justify-center gap-8 opacity-40 ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
                <div className="flex items-center gap-2 text-xs">
                    <Hammer className="w-3 h-3" />
                    <span>Engenharia</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <HardHat className="w-3 h-3" />
                    <span>Design</span>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}