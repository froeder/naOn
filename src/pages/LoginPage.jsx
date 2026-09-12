import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound, HeartHandshake, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { loginWithEmail, registerWithEmail, loginAnonymously, resetPassword, mapAuthError } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = () => { setErrorMessage(''); setSuccessMessage(''); };
  const handleModeChange = (m) => { setMode(m); clearMessages(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim()) return setErrorMessage('Informe o e-mail.');
    if (mode === 'forgot') {
      try {
        setLoading(true);
        await resetPassword(email.trim());
        setSuccessMessage('E-mail de recuperação enviado com sucesso!');
      } catch (err) {
        setErrorMessage(mapAuthError(err.code || err.message));
      } finally { setLoading(false); }
      return;
    }
    if (!password) return setErrorMessage('Informe a senha.');
    if (mode === 'register') {
      if (password.length < 6) return setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      if (password !== confirmPassword) return setErrorMessage('As senhas não coincidem.');
    }
    try {
      setLoading(true);
      if (mode === 'login') await loginWithEmail(email, password);
      else await registerWithEmail(name, email, password);
    } catch (err) {
      setErrorMessage(mapAuthError(err.code || err.message));
    } finally { setLoading(false); }
  };

  const handleGuest = async () => {
    clearMessages();
    try {
      setLoading(true);
      await loginAnonymously();
    } catch (err) {
      setErrorMessage(mapAuthError(err.code || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#2C3E50] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#27AE60] to-[#2ECC71] shadow-lg text-white mb-3">
            <svg viewBox="0 0 100 100" className="w-9 h-9 fill-current">
              <path d="M50 15 C50 15, 30 35, 30 55 C30 68, 40 78, 50 82 C60 78, 70 68, 70 55 C70 35, 50 15, 50 15 Z" />
              <circle cx="50" cy="14" r="5" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-[#2C3E50]">naOn</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Sua jornada diária de sobriedade e liberdade</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
          {mode !== 'forgot' ? (
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button type="button" onClick={() => handleModeChange('login')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-white text-[#2C3E50] shadow-sm' : 'text-slate-500'}`}>Entrar</button>
              <button type="button" onClick={() => handleModeChange('register')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === 'register' ? 'bg-white text-[#2C3E50] shadow-sm' : 'text-slate-500'}`}>Cadastrar</button>
            </div>
          ) : (
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2"><KeyRound className="w-5 h-5 text-[#27AE60]" /><h2 className="font-bold">Recuperar Senha</h2></div>
              <button type="button" onClick={() => handleModeChange('login')} className="text-xs font-bold text-emerald-600 underline">Voltar</button>
            </div>
          )}

          {errorMessage && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center space-x-2"><AlertCircle className="w-4 h-4 text-rose-500 shrink-0" /><span>{errorMessage}</span></div>}
          {successMessage && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-2xl flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>{successMessage}</span></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 ml-1">Seu Nome / Apelido</label>
                <div className="relative"><User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Guerreiro(a)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#27AE60]" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 ml-1">E-mail</label>
              <div className="relative"><Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#27AE60]" />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1 ml-1 mr-1">
                  <label className="text-xs font-bold text-slate-600">Senha</label>
                  {mode === 'login' && <button type="button" onClick={() => handleModeChange('forgot')} className="text-xs text-slate-500 hover:text-emerald-600 font-semibold">Esqueceu?</button>}
                </div>
                <div className="relative"><Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#27AE60]" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 ml-1">Confirmar Senha</label>
                <div className="relative"><Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#27AE60]" />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3.5 px-4 bg-gradient-to-r from-[#27AE60] to-[#2ECC71] hover:from-[#219653] hover:to-[#27AE60] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>{mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar Conta' : 'Enviar Link'}</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <span className="relative bg-white px-3 text-[11px] font-bold uppercase text-slate-400">Ou</span>
          </div>

          <button type="button" onClick={handleGuest} disabled={loading} className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all">
            <HeartHandshake className="w-4 h-4 text-[#27AE60]" />
            <span>Continuar como Visitante Anônimo</span>
          </button>
        </div>
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-1 text-xs text-slate-500"><ShieldCheck className="w-4 h-4 text-emerald-600" /><span>Ambiente seguro e confidencial</span></div>
        </div>
      </div>
    </div>
  );
}
