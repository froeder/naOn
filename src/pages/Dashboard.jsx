import React, { useState, useEffect, useMemo } from 'react';
import { Plus, TrendingUp, Sparkles, ShieldCheck, HeartHandshake, Smile } from 'lucide-react';
import SubstanceCard from '../components/SubstanceCard';
import AddSubstanceModal from '../components/AddSubstanceModal';
import { fetchSubstances, saveSubstance, resetSubstanceStreak, deleteSubstance, subscribeToStoreChanges } from '../services/storeService';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

export default function Dashboard({ onNavigateTab }) {
  const { user } = useAuth();
  const [substances, setSubstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Carrega substâncias
  const loadSubstances = async () => {
    try {
      const data = await fetchSubstances(user?.uid);
      setSubstances(data);
    } catch (e) {
      console.error('Erro ao carregar substâncias:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubstances();
    const unsubscribe = subscribeToStoreChanges((type, payload) => {
      if (type === 'substances') {
        setSubstances(payload);
      }
    });
    return () => unsubscribe();
  }, [user?.uid]);

  // Cálculos agregados do Dashboard
  const summary = useMemo(() => {
    const now = dayjs();
    let totalSaved = 0;
    let maxDays = 0;

    substances.forEach((sub) => {
      const start = dayjs(sub.startDate);
      const daysFraction = Math.max(0, now.diff(start, 'day', true));
      const saved = daysFraction * (Number(sub.dailyCost) || 0);
      totalSaved += saved;
      if (daysFraction > maxDays) {
        maxDays = Math.floor(daysFraction);
      }
    });

    const formattedTotalSaved = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(totalSaved);

    return {
      totalSaved: formattedTotalSaved,
      maxDays,
      activeCount: substances.length,
    };
  }, [substances]);

  const handleAddSubstance = async (newSubData) => {
    await saveSubstance(user?.uid, newSubData);
    loadSubstances();
  };

  const handleResetSubstance = async (id, relapseData) => {
    await resetSubstanceStreak(user?.uid, id, relapseData);
    loadSubstances();
  };

  const handleDeleteSubstance = async (id) => {
    if (confirm('Tem certeza de que deseja remover este acompanhamento? O histórico desta substância será excluído.')) {
      await deleteSubstance(user?.uid, id);
      loadSubstances();
    }
  };

  return (
    <div className="space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      
      {/* Banner Principal de Boas-Vindas Terapêutico */}
      <div className="bg-gradient-to-br from-[#2C3E50] to-[#1A252F] text-white rounded-3xl p-6 shadow-xl border border-white/10 relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#27AE60]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2ECC71] bg-[#27AE60]/20 px-2.5 py-0.5 rounded-full border border-[#27AE60]/30">
                Jornada de Lucidez
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Olá, {user?.displayName || 'Guerreiro(a)'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-md">
              "Um dia de cada vez. O momento mais importante de toda a sua vida é a escolha lúcida do presente."
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 py-3 px-5 bg-[#27AE60] hover:bg-[#2ECC71] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#27AE60]/30 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" />
            Nova Substância
          </button>
        </div>

        {/* Estatísticas Agregadas */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10">
          <div>
            <span className="text-[11px] text-slate-300 uppercase tracking-wider block font-semibold">
              Economia Total
            </span>
            <span className="text-lg sm:text-2xl font-black text-[#2ECC71]">
              {summary.totalSaved}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-300 uppercase tracking-wider block font-semibold">
              Maior Sequência
            </span>
            <span className="text-lg sm:text-2xl font-black text-white">
              {summary.maxDays} {summary.maxDays === 1 ? 'Dia' : 'Dias'}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-300 uppercase tracking-wider block font-semibold">
              Acompanhadas
            </span>
            <span className="text-lg sm:text-2xl font-black text-amber-300">
              {summary.activeCount}
            </span>
          </div>
        </div>
      </div>

      {/* Atalho Rápido para Diário de Humor */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white shadow-xs text-[#27AE60]">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Como você está se sentindo hoje?</h4>
            <p className="text-xs text-slate-600">Registre suas emoções no Diário de Humor para antecipar gatilhos.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('journal')}
          className="text-xs font-bold py-2 px-3.5 bg-white hover:bg-emerald-100 text-[#27AE60] rounded-xl border border-emerald-200 shadow-xs transition-colors shrink-0"
        >
          Registrar
        </button>
      </div>

      {/* Lista de Substâncias Cadastradas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#2C3E50] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#27AE60]" />
            Cronômetros de Sobriedade
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Atualizado em tempo real
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            Carregando cronômetros...
          </div>
        ) : substances.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Plus className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-700">Nenhuma substância cadastrada ainda</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Adicione o hábito que você escolheu abandonar (álcool, tabaco, apostas, etc.) para iniciar seu contador de conquistas.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2.5 px-5 bg-[#27AE60] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Cadastrar Primeira Substância
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {substances.map((sub) => (
              <SubstanceCard
                key={sub.id}
                substance={sub}
                onReset={handleResetSubstance}
                onDelete={handleDeleteSubstance}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Nova Substância */}
      <AddSubstanceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubstance}
      />
    </div>
  );
}
