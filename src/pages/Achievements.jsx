import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Sparkles,
  Flame,
  ShieldCheck,
  Medal,
  Gem,
  Crown,
  Lock,
  CheckCircle2,
  PartyPopper,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BADGES_DEFINITION } from '../services/mockData';
import { fetchSubstances } from '../services/storeService';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

const ICON_MAP = {
  Flame,
  Sparkles,
  ShieldCheck,
  Award,
  Medal,
  Gem,
  Crown,
};

export default function Achievements() {
  const { user } = useAuth();
  const [substances, setSubstances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubstances(user?.uid)
      .then(setSubstances)
      .finally(() => setLoading(false));
  }, [user?.uid]);

  // Calcula o maior tempo de sobriedade entre todas as substâncias cadastradas
  const maxSobrietyHours = useMemo(() => {
    if (!substances.length) return 0;
    const now = dayjs();
    let maxHours = 0;
    substances.forEach((sub) => {
      const diffHours = Math.max(0, now.diff(dayjs(sub.startDate), 'hour', true));
      if (diffHours > maxHours) {
        maxHours = diffHours;
      }
    });
    return maxHours;
  }, [substances]);

  // Processa as medalhas com status de desbloqueio e progresso
  const badgesWithProgress = useMemo(() => {
    return BADGES_DEFINITION.map((badge) => {
      const isUnlocked = maxSobrietyHours >= badge.hoursRequired;
      const progressPercent = Math.min(
        100,
        Math.round((maxSobrietyHours / badge.hoursRequired) * 100)
      );

      const hoursLeft = Math.max(0, Math.ceil(badge.hoursRequired - maxSobrietyHours));
      const daysLeft = Math.ceil(hoursLeft / 24);

      return {
        ...badge,
        isUnlocked,
        progressPercent,
        hoursLeft,
        daysLeft,
      };
    });
  }, [maxSobrietyHours]);

  const unlockedCount = badgesWithProgress.filter((b) => b.isUnlocked).length;
  const totalCount = badgesWithProgress.length;

  const handleCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#27AE60', '#2ECC71', '#F1C40F', '#3498DB', '#9B59B6'],
    });
  };

  return (
    <div className="space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      
      {/* Header das Conquistas */}
      <div className="bg-gradient-to-br from-[#2C3E50] to-[#1A252F] text-white rounded-3xl p-6 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                <Medal className="w-3.5 h-3.5" />
                Marcos de Sobriedade
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Suas Medalhas de Vitória
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
              Cada hora de lucidez conta uma história de bravura e amor próprio.
            </p>
          </div>

          <button
            onClick={handleCelebrate}
            className="flex items-center gap-2 py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/30 active:scale-95 transition-all shrink-0"
          >
            <PartyPopper className="w-4 h-4" />
            Celebrar Conquistas!
          </button>
        </div>

        {/* Barra de Progresso Geral */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-semibold">
              Desbloqueadas: {unlockedCount} de {totalCount} medalhas
            </span>
            <span className="text-[#2ECC71] font-bold">
              {Math.round((unlockedCount / totalCount) * 100)}% concluído
            </span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#27AE60] to-[#2ECC71] rounded-full transition-all duration-1000"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid de Medalhas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badgesWithProgress.map((badge) => {
          const IconComponent = ICON_MAP[badge.iconName] || Award;

          return (
            <div
              key={badge.id}
              className={`rounded-3xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                badge.isUnlocked
                  ? 'bg-white border-emerald-200/70 shadow-sm hover:shadow-md'
                  : 'bg-slate-100/70 border-slate-200/80 opacity-75 grayscale-[40%]'
              }`}
            >
              {/* Badge Top */}
              <div className="flex items-start gap-4">
                {/* Ícone da Medalha */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-transform ${
                    badge.isUnlocked
                      ? 'scale-105 shadow-emerald-500/20'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                  style={{
                    backgroundColor: badge.isUnlocked ? badge.color : undefined,
                    color: badge.isUnlocked ? '#FFFFFF' : undefined,
                  }}
                >
                  <IconComponent className="w-7 h-7" />
                </div>

                {/* Textos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-extrabold text-base text-[#2C3E50] truncate">
                      {badge.title}
                    </h3>
                    {badge.isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#27AE60] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Conquistada
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Pendente
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                    {badge.subtitle}
                  </span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Barra de Progresso / Requisito */}
              <div className="mt-4 pt-3 border-t border-slate-200/50">
                {!badge.isUnlocked ? (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Progresso</span>
                      <span className="font-bold">
                        {badge.progressPercent}% ({badge.daysLeft} {badge.daysLeft === 1 ? 'dia restante' : 'dias restantes'})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#27AE60] rounded-full transition-all duration-500"
                        style={{ width: `${badge.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-[#27AE60] font-bold">
                    <span>Brilhando em seu histórico</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
