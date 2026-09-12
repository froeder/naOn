import React from 'react';
import { Home, Users, Award, Smile, User } from 'lucide-react';

export default function BottomNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'feed', label: 'Feed', icon: Users },
    { id: 'journal', label: 'Diário', icon: Smile },
    { id: 'badges', label: 'Conquistas', icon: Award },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-2 safe-bottom shadow-lg shadow-slate-900/5">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-[#27AE60] font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#27AE60]/10 text-[#27AE60]' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">
                {tab.label}
              </span>

              {/* Indicador de aba ativa */}
              {isActive && (
                <span className="absolute -bottom-1 w-4 h-1 rounded-full bg-[#27AE60]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
