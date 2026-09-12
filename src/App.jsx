import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
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
