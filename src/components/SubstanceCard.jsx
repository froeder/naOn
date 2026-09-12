import React, { useState } from 'react';
import { useSobrietyTimer } from '../hooks/useSobrietyTimer';
import { RotateCcw, DollarSign, Calendar, Flame, Trash2, HeartHandshake } from 'lucide-react';
import ResetConfirmationModal from './ResetConfirmationModal';

export default function SubstanceCard({ substance, onReset, onDelete }) {
  const [showResetModal, setShowResetModal] = useState(false);
  const timer = useSobrietyTimer(substance.startDate, substance.dailyCost);

  return (
    <>
      <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100/80 relative overflow-hidden flex flex-col justify-between">
        {/* Barra sutil superior de status */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: substance.color || '#27AE60' }}
        />

        {/* Topo do Card */}
        <div className="flex items-start justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#2C3E50] tracking-tight">
                {substance.name}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#27AE60] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60] animate-pulse" />
                Ativo
              </span>
            </div>
            {substance.category && (
              <p className="text-xs text-slate-400 mt-0.5">{substance.category}</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(substance.id)}
              className="p-2 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
              title="Remover substância"
              aria-label="Excluir substância"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bloco do Cronômetro Vivo (Dias, Horas, Minutos, Segundos) */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 my-2 text-center">
          {/* Dias */}
          <div className="bg-[#F4F7F6] rounded-2xl p-2.5 sm:p-3 border border-slate-200/50 flex flex-col justify-center">
            <span className="text-2xl sm:text-3xl font-black text-[#2C3E50] tracking-tight">
              {timer.days}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Dias
            </span>
          </div>

          {/* Horas */}
          <div className="bg-[#F4F7F6] rounded-2xl p-2.5 sm:p-3 border border-slate-200/50 flex flex-col justify-center">
            <span className="text-2xl sm:text-3xl font-black text-[#2C3E50] tracking-tight">
              {String(timer.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Horas
            </span>
          </div>

          {/* Minutos */}
          <div className="bg-[#F4F7F6] rounded-2xl p-2.5 sm:p-3 border border-slate-200/50 flex flex-col justify-center">
            <span className="text-2xl sm:text-3xl font-black text-[#2C3E50] tracking-tight">
              {String(timer.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Min
            </span>
          </div>

          {/* Segundos (com animação sutil pulsante) */}
          <div className="bg-emerald-50/70 rounded-2xl p-2.5 sm:p-3 border border-emerald-200/60 flex flex-col justify-center">
            <span className="text-2xl sm:text-3xl font-black text-[#27AE60] tracking-tight animate-soft-pulse">
              {String(timer.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#27AE60] mt-0.5">
              Seg
            </span>
          </div>
        </div>

        {/* Motivação do Usuário */}
        {substance.notes && (
          <p className="text-xs italic text-slate-500 my-3 line-clamp-2 px-1">
            "{substance.notes}"
          </p>
        )}

        {/* Métricas: Economia & Data Inicial */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-[#27AE60]">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Economia Total</span>
              <span className="text-sm sm:text-base font-extrabold text-[#27AE60]">
                {timer.formattedMoney}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium flex items-center gap-1 justify-end">
              <Calendar className="w-3 h-3 text-slate-400" />
              Início
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {timer.startDateFormatted}
            </span>
          </div>
        </div>

        {/* Rodapé do Card com Ação de Reiniciar */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-dashed border-slate-100">
          <span className="text-[11px] text-slate-400">
            {substance.relapsesCount > 0
              ? `${substance.relapsesCount} recomeço(s) consciente(s)`
              : 'Jornada contínua'}
          </span>
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>
      </div>

      <ResetConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        substanceName={substance.name}
        onConfirm={(relapseData) => onReset(substance.id, relapseData)}
      />
    </>
  );
}
