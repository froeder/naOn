import React, { useState } from 'react';
import { Mail, Lock, User, X, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginAnonymously, mapAuthError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Por favor, informe como gostaria de ser chamado(a).');
        await registerWithEmail(name.trim(), email.trim(), password);
      } else {
        await loginWithEmail(email.trim(), password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(mapAuthError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError(mapAuthError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      await loginAnonymously();
      onClose();
    } catch (err) {
      setError(mapAuthError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header Acolhedor */}
        <div className="bg-gradient-to-r from-[#2C3E50] to-[#1A252F] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#27AE60] to-[#2ECC71] flex items-center justify-center mb-3 shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight">
        {/* Botão Google */}
        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-3 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="text-sm">Entrar com o Google</span>
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">ou com e-mail</span>
          </div>
        </div>


            {isRegister ? 'Criar sua Conta no naOn' : 'Bem-vindo(a) de volta'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Seu refúgio seguro de apoio à sobriedade e reconquista da sua vida.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Como quer ser chamado(a)?
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Seu nome ou apelido"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm py-3 pl-10 pr-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm py-3 pl-10 pr-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm py-3 pl-10 pr-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#27AE60] hover:bg-[#219653] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Aguarde...' : isRegister ? 'Concluir Cadastro' : 'Entrar na Minha Conta'}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Alternar entre login e cadastro */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs text-[#2C3E50] hover:underline font-semibold"
            >
              {isRegister
                ? 'Já possui uma conta? Faça login'
                : 'Novo por aqui? Crie sua conta'}
            </button>
          </div>

          {/* Divisor */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-[11px] text-slate-400 uppercase font-medium">
              Ou explore agora
            </span>
          </div>

          {/* Login de Convidado sem fricção */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            Continuar em Modo Convidado / Anônimo
          </button>
        </form>

      </div>
    </div>
  );
}
