import React, { useState, useEffect } from 'react';
import { ShieldAlert, Sparkles, Wifi, WifiOff, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenSOS }) {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#2C3E50]/95 backdrop-blur-md text-white border-b border-white/10 px-4 py-3 sm:px-6 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Slogan */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#27AE60] to-[#2ECC71] flex items-center justify-center shadow-md shadow-emerald-500/20">
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-white fill-current">
              <path d="M50 15 C50 15, 30 35, 30 55 C30 68, 40 78, 50 82 C60 78, 70 68, 70 55 C70 35, 50 15, 50 15 Z" />
              <circle cx="50" cy="14" r="5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                na<span className="text-[#2ECC71]">On</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-[#2ECC71] border border-[#2ECC71]/30 px-1.5 py-0.2 rounded">
                PWA
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium tracking-wide">
              Suporte à Sobriedade
            </p>
          </div>
        </div>

        {/* Botão de Emergência SOS & Status */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Indicador de Conexão */}
          <div
            className={`hidden sm:flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
            }`}
          >
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                Modo Offline PWA
              </>
            )}
          </div>

          {/* Botão SOS Prominente */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 py-2 px-3.5 sm:px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-rose-600/30 transition-all border border-rose-400/30"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>SOS (188)</span>
          </button>
        </div>

      </div>
    </header>
  );
}
