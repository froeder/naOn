import React, { useState, useEffect } from 'react';
import { PhoneCall, HeartHandshake, Wind, X, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { MOTIVATIONAL_SOS_QUOTES } from '../services/mockData';

export default function SOSModal({ isOpen, onClose }) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [breathePhase, setBreathePhase] = useState('Inspire'); // 'Inspire', 'Segure', 'Expire'
  const [breatheSeconds, setBreatheSeconds] = useState(4);
  const [isBreatheActive, setIsBreatheActive] = useState(false);

  // Ciclo de respiração 4-7-8
  useEffect(() => {
    if (!isOpen || !isBreatheActive) return;

    let timer;
    if (breathePhase === 'Inspire') {
      if (breatheSeconds > 1) {
        timer = setTimeout(() => setBreatheSeconds(s => s - 1), 1000);
      } else {
        setBreathePhase('Segure');
        setBreatheSeconds(7);
      }
    } else if (breathePhase === 'Segure') {
      if (breatheSeconds > 1) {
        timer = setTimeout(() => setBreatheSeconds(s => s - 1), 1000);
      } else {
        setBreathePhase('Expire');
        setBreatheSeconds(8);
      }
    } else if (breathePhase === 'Expire') {
      if (breatheSeconds > 1) {
        timer = setTimeout(() => setBreatheSeconds(s => s - 1), 1000);
      } else {
        setBreathePhase('Inspire');
        setBreatheSeconds(4);
      }
    }

    return () => clearTimeout(timer);
  }, [isOpen, isBreatheActive, breathePhase, breatheSeconds]);

  if (!isOpen) return null;

  const currentQuote = MOTIVATIONAL_SOS_QUOTES[currentQuoteIndex];

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_SOS_QUOTES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header de Emergência Acolhedor */}
        <div className="bg-gradient-to-r from-[#2C3E50] to-[#1A252F] text-white p-5 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/20 border border-rose-400/30 rounded-2xl text-rose-300">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Apoio Imediato SOS
              </h2>
              <p className="text-xs text-slate-300">Respire, você não está sozinho(a) nessa onda.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Botão de Discagem Rápida CVV 188 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200/80 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                  Linha de Apoio Emocional Gratuita
                </span>
                <h3 className="text-lg font-bold text-slate-800">Precisa conversar agora?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  O CVV (Centro de Valorização da Vida) oferece apoio confidencial 24 horas por dia, 7 dias por semana.
                </p>
              </div>
            </div>

            <a
              href="tel:188"
              className="mt-4 flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all text-base"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              Ligar Imediatamente para o CVV (188)
            </a>
          </div>

          {/* Exercício de Respiração Guiada 4-7-8 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-700 font-semibold mb-2">
              <Wind className="w-5 h-5 text-[#27AE60]" />
              <span>Ancoragem: Respiração 4-7-8</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Ajuda a diminuir a frequência cardíaca e quebrar o circuito da fissura.
            </p>

            {!isBreatheActive ? (
              <button
                onClick={() => {
                  setIsBreatheActive(true);
                  setBreathePhase('Inspire');
                  setBreatheSeconds(4);
                }}
                className="py-2.5 px-5 bg-[#2C3E50] hover:bg-[#34495E] text-white rounded-xl text-sm font-medium transition-all shadow-sm"
              >
                Iniciar Exercício de Respiração
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 space-y-3">
                <div
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white font-bold transition-all duration-1000 ${
                    breathePhase === 'Inspire'
                      ? 'bg-gradient-to-br from-[#27AE60] to-[#2ECC71] scale-110 shadow-lg shadow-green-500/30'
                      : breathePhase === 'Segure'
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 scale-100 shadow-lg shadow-amber-500/30'
                      : 'bg-gradient-to-br from-[#2C3E50] to-[#3D566E] scale-90 shadow-lg shadow-slate-700/30'
                  }`}
                >
                  <span className="text-base tracking-wide uppercase">{breathePhase}</span>
                  <span className="text-2xl font-black">{breatheSeconds}s</span>
                </div>
                <p className="text-xs font-medium text-slate-600">
                  {breathePhase === 'Inspire' && 'Puxe o ar suavemente pelo nariz (4 segundos)'}
                  {breathePhase === 'Segure' && 'Mantenha os pulmões cheios em serenidade (7 segundos)'}
                  {breathePhase === 'Expire' && 'Solte todo o ar pela boca com calma (8 segundos)'}
                </p>
                <button
                  onClick={() => setIsBreatheActive(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline pt-1"
                >
                  Pausar respiração
                </button>
              </div>
            )}
          </div>

          {/* Frases Terapêuticas de Ancoragem */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#27AE60]" />
                Lembrete de Força
              </span>
              <button
                onClick={nextQuote}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
              >
                Outra frase <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm font-medium text-slate-800 italic leading-relaxed">
              "{currentQuote.quote}"
            </p>
            <p className="text-xs text-emerald-700 font-semibold mt-2 text-right">
              — {currentQuote.author}
            </p>
          </div>

          {/* Dica da Onda */}
          <div className="flex items-center gap-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-700">
            <HeartHandshake className="w-5 h-5 text-blue-600 shrink-0" />
            <span>
              <strong>Dica dos 15 minutos:</strong> beba um copo grande de água gelada, mude de ambiente físico e faça 10 polichinelos ou uma caminhada curta.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-200/60 font-medium text-sm transition-colors"
          >
            Estou me sentindo mais calmo(a) agora
          </button>
        </div>

      </div>
    </div>
  );
}
