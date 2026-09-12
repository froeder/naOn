import React, { useState, useEffect } from 'react';
import { Smile, Sparkles, Plus, Calendar, ShieldAlert, Heart, Check, History } from 'lucide-react';
import { fetchMoods, saveMoodCheckIn, subscribeToStoreChanges } from '../services/storeService';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

const MOOD_OPTIONS = [
  { id: 'radiante', emoji: '😄', label: 'Radiante', description: 'Cheio(a) de energia positiva e clareza', color: '#27AE60' },
  { id: 'bem', emoji: '🙂', label: 'Bem e Calmo', description: 'Tranquilo(a), em paz com o dia', color: '#2ECC71' },
  { id: 'ansioso', emoji: '😰', label: 'Ansioso(a)', description: 'Pensamentos acelerados ou inquietude', color: '#F39C12' },
  { id: 'cansado', emoji: '🥱', label: 'Exausto(a)', description: 'Cansaço físico ou mental elevado', color: '#3498DB' },
  { id: 'triste', emoji: '😔', label: 'Desanimado(a)', description: 'Sentindo aperto no peito ou tristeza', color: '#9B59B6' },
  { id: 'fissura', emoji: '⚡', label: 'Com Vontade/Fissura', description: 'Impulso ativo precisando de atenção', color: '#E74C3C' },
];

export default function MoodJournal() {
  const { user } = useAuth();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form check-in
  const [selectedMood, setSelectedMood] = useState('bem');
  const [cravingLevel, setCravingLevel] = useState(1); // 0 a 5
  const [triggerNote, setTriggerNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMoods = async () => {
    try {
      const data = await fetchMoods(user?.uid);
      setMoods(data);
    } catch (e) {
      console.error('Erro ao carregar diário:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoods();
    const unsubscribe = subscribeToStoreChanges((type, payload) => {
      if (type === 'moods') {
        setMoods(payload);
      }
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const handleSaveMood = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const option = MOOD_OPTIONS.find((m) => m.id === selectedMood);
      await saveMoodCheckIn(user?.uid, {
        mood: selectedMood,
        emoji: option?.emoji || '🙂',
        label: option?.label || 'Bem',
        cravingLevel,
        triggerNote: triggerNote.trim(),
      });
      setSavedSuccess(true);
      setTriggerNote('');
      loadMoods();
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      
      {/* Header do Diário */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#2C3E50] tracking-tight flex items-center gap-2">
          <Smile className="w-6 h-6 text-[#27AE60]" />
          Diário de Humor & Gatilhos
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Identificar como você se sente é o passo mais eficiente para prevenir recaídas antes que elas aconteçam.
        </p>
      </div>

      {/* Formulário de Check-in Diário */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">
            Check-in Emocional de Hoje
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {dayjs().format('DD/MM/YYYY')}
          </span>
        </div>

        <form onSubmit={handleSaveMood} className="space-y-5">
          {/* Seletor de Emojis */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Como está seu coração e sua mente agora?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {MOOD_OPTIONS.map((opt) => {
                const isSelected = selectedMood === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedMood(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#27AE60] bg-emerald-50/50 shadow-xs ring-2 ring-[#27AE60]/20'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{opt.emoji}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#27AE60]" />
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-bold text-slate-800 block">
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-1">
                        {opt.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nível de Fissura / Desejo (0 a 5) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Nível de Vontade / Fissura:
              </label>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                cravingLevel <= 1
                  ? 'bg-emerald-100 text-[#27AE60]'
                  : cravingLevel <= 3
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700'
              }`}>
                {cravingLevel === 0 && '0 - Nenhuma vontade'}
                {cravingLevel === 1 && '1 - Vontade muito fraca'}
                {cravingLevel === 2 && '2 - Leve pensamento'}
                {cravingLevel === 3 && '3 - Moderada, controlável'}
                {cravingLevel === 4 && '4 - Forte, usando técnicas'}
                {cravingLevel === 5 && '5 - Urgente (Acesse o SOS)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={cravingLevel}
              onChange={(e) => setCravingLevel(Number(e.target.value))}
              className="w-full accent-[#27AE60] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 (Paz total)</span>
              <span>3 (Alerta)</span>
              <span>5 (Fissura máxima)</span>
            </div>
          </div>

          {/* Anotação de pensamentos e gatilhos */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              O que aconteceu hoje? (Gatilhos, gratidão ou pensamentos)
            </label>
            <textarea
              rows={3}
              value={triggerNote}
              onChange={(e) => setTriggerNote(e.target.value)}
              placeholder="Ex: Tive uma reunião difícil no trabalho, mas fiz uma caminhada e não cedi..."
              className="w-full text-sm p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] resize-none"
            />
          </div>

          {/* Botão de salvar */}
          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#27AE60] animate-in fade-in">
                <Check className="w-4 h-4" />
                Registrado com sucesso no seu histórico!
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Seu registro é privado e confidencial.
              </span>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 bg-[#27AE60] hover:bg-[#219653] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Registro'}
            </button>
          </div>
        </form>
      </div>

      {/* Histórico Recente de Emoções */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#2C3E50] flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            Histórico Recente
          </h3>
          <span className="text-xs text-slate-400">{moods.length} registros</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400">Carregando histórico...</div>
        ) : moods.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-slate-200 text-slate-500 text-xs">
            Nenhum registro ainda. Faça seu primeiro check-in acima!
          </div>
        ) : (
          <div className="space-y-3">
            {moods.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-start gap-3.5"
              >
                <div className="text-3xl p-1 bg-slate-50 rounded-xl">
                  {m.emoji || '🙂'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#2C3E50]">
                      {m.label}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {dayjs(m.timestamp || m.date).format('DD/MM/YYYY [às] HH:mm')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold text-slate-500">
                      Fissura: {m.cravingLevel}/5
                    </span>
                  </div>
                  {m.triggerNote && (
                    <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 p-2 rounded-lg leading-relaxed">
                      "{m.triggerNote}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
