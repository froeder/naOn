import React, { useState } from 'react';
import {
  User,
  Shield,
  KeyRound,
  Download,
  LogOut,
  Edit2,
  Check,
  Smartphone,
  ExternalLink,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

export default function Profile({ onOpenAuthModal }) {
  const { user, logout, isFirebaseConfigured, updateUserName } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || '');
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateUserName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const handleExportData = () => {
    try {
      const data = {
        user,
        substances: JSON.parse(localStorage.getItem('naon_substances_v1') || '[]'),
        moods: JSON.parse(localStorage.getItem('naon_moods_v1') || '[]'),
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `naon-backup-sobriedade-${dayjs().format('YYYY-MM-DD')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Erro ao exportar dados.');
    }
  };

  return (
    <div className="space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      
      {/* Header Perfil */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#2C3E50] tracking-tight">
          Meu Perfil & Configurações
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Usuário'} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              user?.displayName?.[0]?.toUpperCase() || 'G'
            )}

            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Usuário'} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              user?.displayName?.[0]?.toUpperCase() || 'G'
            )}



        </h1>
        <p className="text-xs text-slate-500">
          Gerencie seus dados pessoais, status do Firebase e backup da sua jornada.
        </p>
      </div>

      {/* Card do Usuário */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user?.displayName?.charAt(0).toUpperCase() || 'G'}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2 max-w-sm mx-auto sm:mx-0">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="text-base font-bold p-2 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#27AE60] flex-1"
                />
                <button
                  onClick={handleSaveName}
                  className="p-2.5 bg-[#27AE60] text-white rounded-xl hover:bg-[#219653]"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-black text-[#2C3E50]">
                  {user?.displayName || 'Guerreiro(a) naOn'}
                </h2>
                <button
                  onClick={() => {
                    setNameInput(user?.displayName || '');
                    setIsEditingName(true);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  title="Editar nome"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="text-[11px] font-semibold bg-emerald-50 text-[#27AE60] border border-emerald-100 px-2.5 py-0.5 rounded-full">
                Membro desde {dayjs(user?.joinedAt).format('MMMM [de] YYYY')}
              </span>
              {user?.isAnonymous && (
                <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  Modo Convidado
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
          <button
            onClick={onOpenAuthModal}
            className="py-2 px-4 rounded-xl text-xs font-bold text-[#2C3E50] bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Entrar / Trocar Conta
          </button>
          <button
            onClick={logout}
            className="py-2 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </div>

      {/* Status do Firebase */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C3E50]">
              Status do Backend Firebase
            </h3>
            <p className="text-xs text-slate-500">
              Authentication & Cloud Firestore
            </p>
          </div>
        </div>

        {isFirebaseConfigured ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#27AE60] animate-ping" />
            <div>
              <h4 className="text-xs font-bold text-emerald-800">
                Firebase Conectado e Operacional
              </h4>
              <p className="text-[11px] text-emerald-700">
                Suas credenciais do Firebase no arquivo .env estão ativas e sincronizando dados na nuvem.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h4 className="text-xs font-bold text-amber-900">
                Operando em Modo de Demonstração / Local Seguro
              </h4>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              O aplicativo está funcionando 100% com armazenamento local (localStorage) para você testar todas as telas, cronômetros e postagens sem travar.
            </p>
            <p className="text-[11px] text-amber-700">
              Para conectar seu Firebase real, copie o arquivo <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.example</code> para <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code> e insira as credenciais do seu projeto Firebase Console.
            </p>
          </div>
        )}
      </div>

      {/* Exportar Dados & Privacidade */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C3E50]">
              Privacidade & Backup
            </h3>
            <p className="text-xs text-slate-500">
              Você é o único dono dos seus dados de sobriedade
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Faça o download de todo o seu histórico de sobriedade, economia financeira e anotações do diário em um arquivo seguro formato JSON.
        </p>

        <button
          onClick={handleExportData}
          className="flex items-center gap-2 py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
        >
          <Download className="w-4 h-4" />
          Exportar Backup Completo (JSON)
        </button>
      </div>

    </div>
  );
}
