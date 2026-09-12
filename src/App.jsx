import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import SOSModal from './components/SOSModal';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import CommunityFeed from './pages/CommunityFeed';
import MoodJournal from './pages/MoodJournal';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import { Download, X } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Captura evento de instalação PWA
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#27AE60] to-[#2ECC71] flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white mb-4 animate-bounce">
          <svg viewBox="0 0 100 100" className="w-9 h-9 fill-current">
            <path d="M50 15 C50 15, 30 35, 30 55 C30 68, 40 78, 50 82 C60 78, 70 68, 70 55 C70 35, 50 15, 50 15 Z" />
            <circle cx="50" cy="14" r="5" />
          </svg>
        </div>
        <div className="w-6 h-6 border-2 border-slate-300 border-t-[#27AE60] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#2C3E50] flex flex-col selection:bg-[#27AE60]/20 selection:text-[#2C3E50]">
      {/* Header Topo Fixo */}
      <Navbar onOpenSOS={() => setIsSOSOpen(true)} />

      {/* Banner de Instalação PWA */}
      {showInstallBanner && (
        <div className="bg-[#2C3E50] text-white px-4 py-2.5 text-xs flex items-center justify-between border-b border-white/10 shadow-md">
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-[#2ECC71]" />
            <span>Instale o <strong>naOn</strong> no seu celular para suporte offline e acesso instantâneo!</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallApp}
              className="py-1 px-3 bg-[#27AE60] hover:bg-[#2ECC71] text-white font-bold rounded-lg text-xs transition-colors"
            >
              Instalar PWA
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal com Layout Responsivo Focado em Mobile */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {activeTab === 'home' && <Dashboard onNavigateTab={setActiveTab} />}
        {activeTab === 'feed' && <CommunityFeed />}
        {activeTab === 'journal' && <MoodJournal />}
        {activeTab === 'badges' && <Achievements />}
        {activeTab === 'profile' && <Profile onOpenAuthModal={() => setIsAuthOpen(true)} />}
      </main>

      {/* Barra de Navegação Inferior */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Modais Globais */}
      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
