import React, { useState } from 'react';
import { Plus, X, Sparkles, DollarSign, Calendar, Tag } from 'lucide-react';

const SUBSTANCE_PRESETS = [
  { name: 'Álcool', category: 'Bebidas', defaultCost: 30, color: '#27AE60' },
  { name: 'Cigarro / Nicotina', category: 'Tabaco', defaultCost: 18, color: '#3498DB' },
  { name: 'Vape / Pod Eletrônico', category: 'Tabaco', defaultCost: 25, color: '#9B59B6' },
  { name: 'Apostas / Bets', category: 'Comportamental', defaultCost: 50, color: '#E67E22' },
  { name: 'Maconha / Cannabis', category: 'Ervas', defaultCost: 20, color: '#16A085' },
  { name: 'Medicamentos / Calmantes', category: 'Químico', defaultCost: 15, color: '#E74C3C' },
  { name: 'Açúcar / Doces em Excesso', category: 'Alimentação', defaultCost: 12, color: '#F39C12' },
];

export default function AddSubstanceModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [dailyCost, setDailyCost] = useState('');
  const [startDate, setStartDate] = useState(() => {
    // Formata para datetime-local (YYYY-MM-DDTHH:mm)
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  });
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('#27AE60');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setName(preset.name);
    setCategory(preset.category);
    setDailyCost(String(preset.defaultCost));
    setColor(preset.color);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        category: category.trim() || 'Geral',
        dailyCost: parseFloat(dailyCost) || 0,
        startDate: new Date(startDate).toISOString(),
        notes: notes.trim(),
        color: color || '#27AE60',
        relapsesCount: 0,
        history: [],
      });
      onClose();
      // Reseta form
      setName('');
      setCategory('');
      setDailyCost('');
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C3E50] to-[#1A252F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#27AE60]/20 border border-[#27AE60]/40 rounded-2xl text-[#2ECC71]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Cadastrar Nova Substância</h3>
              <p className="text-xs text-slate-300">Dê o primeiro passo rumo a uma nova vida livre.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Sugestões Rápidas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Escolha rápida ou personalize:
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBSTANCE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    name === preset.name
                      ? 'bg-[#27AE60] text-white border-[#27AE60] font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Nome da Substância */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Nome da Substância / Hábito *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Álcool, Cigarro, Apostas..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
            />
          </div>

          {/* Custo Diário e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#27AE60]" />
                Custo Diário Estimado (R$)
              </label>
              <input
                type="number"
                step="0.50"
                min="0"
                placeholder="Ex: 30.00"
                value={dailyCost}
                onChange={(e) => setDailyCost(e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Usado para calcular sua economia acumulada.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#2C3E50]" />
                Início da Sobriedade *
              </label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Pode ser hoje ou no passado.
              </span>
            </div>
          </div>

          {/* Motivação Pessoal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Seu maior motivo para parar (Sua âncora)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Ter mais saúde para brincar com meus filhos e paz de espírito..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] resize-none"
            />
          </div>

          {/* Botões */}
          <div className="pt-3 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-[#27AE60] hover:bg-[#219653] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-[#27AE60]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {isSubmitting ? 'Salvando...' : 'Iniciar Jornada'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
