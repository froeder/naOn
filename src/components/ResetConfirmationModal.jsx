import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, Heart, Shield, X } from 'lucide-react';

const COMMON_TRIGGERS = [
  'Estresse intenso / Trabalho',
  'Ambiente social / Pressão de amigos',
  'Solidão / Tédio',
  'Tristeza / Frustração',
  'Excesso de confiança / "Só um pouco"',
  'Cansaço físico / Insônia',
];

export default function ResetConfirmationModal({ isOpen, onClose, onConfirm, substanceName }) {
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [reflectionNote, setReflectionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleTrigger = (trigger) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleReset = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm({
        triggers: selectedTriggers,
        note: reflectionNote || 'Recomeço consciente com foco no aprendizado.',
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header acolhedor */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Reiniciar Cronômetro</h3>
              <p className="text-xs text-amber-100">{substanceName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-amber-200 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Diálogo */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Mensagem Terapêutica de Zero Culpa */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200/80">
            <Heart className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Sem julgamento:</strong> Uma recaída não apaga todos os dias e horas de clareza que você já conquistou. A sobriedade é uma maratona de aprendizado e autoconhecimento.
            </p>
          </div>

          {/* Gatilhos identificados */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              O que disparou a vontade dessa vez? (Opcional)
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_TRIGGERS.map((trigger) => {
                const isSelected = selectedTriggers.includes(trigger);
                return (
                  <button
                    key={trigger}
                    type="button"
                    onClick={() => toggleTrigger(trigger)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-[#2C3E50] text-white border-[#2C3E50] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {trigger}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Anotação de reflexão */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              O que você aprendeu para a próxima?
            </label>
            <textarea
              rows={3}
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="Ex: Não ir a lugares com fácil acesso quando estiver exausto..."
              className="w-full text-sm p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] resize-none"
            />
          </div>

          {/* Confirmação */}
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>O cronômetro será zerado a partir de agora e o histórico será preservado.</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-200/70 font-semibold text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleReset}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {isSubmitting ? 'Reiniciando...' : 'Recomeçar Agora'}
          </button>
        </div>

      </div>
    </div>
  );
}
