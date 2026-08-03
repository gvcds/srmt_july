'use client';

import React from 'react';
import { Info, X, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export function CustomToast({ message, type, isVisible, onClose, isDarkMode }: ToastProps) {
  if (!isVisible) return null;

  const glassStyle = isDarkMode 
    ? 'bg-[#1a1a1a]/80 border-white/10 text-gray-100' 
    : 'bg-white/80 border-white/40 text-gray-800';
  
  let iconColor = 'text-blue-500';
  let Icon = Info;

  if (type === 'success') {
    iconColor = 'text-green-500';
    Icon = CheckCircle2;
  } else if (type === 'error') {
    iconColor = 'text-red-500';
    Icon = AlertCircle;
  } else if (type === 'warning') {
    iconColor = 'text-orange-500';
    Icon = AlertTriangle;
  }

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 max-w-sm ${glassStyle}`}>
      <div className={`p-2 rounded-full bg-opacity-10 ${iconColor.replace('text-', 'bg-')}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-0.5">
          {type === 'error' ? 'Erro' : type === 'success' ? 'Sucesso' : 'Info'}
        </h4>
        <p className="text-sm font-medium leading-tight">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
      >
        <X className="w-4 h-4 opacity-60" />
      </button>
    </div>
  );
}
