import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Navbar from './src/components/Navbar';
import BottomNav from './src/components/BottomNav';
import SOSModal from './src/components/SOSModal';
import Dashboard from './src/pages/Dashboard';
import MoodJournal from './src/pages/MoodJournal';
import Achievements from './src/pages/Achievements';
import CommunityFeed from './src/pages/CommunityFeed';
import Profile from './src/pages/Profile';
import LoginPage from './src/pages/LoginPage';

function MainApp() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showSOSModal, setShowSOSModal] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  if (!user && currentTab !== 'login') {
    return <LoginPage onDone={() => setCurrentTab('dashboard')} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      {currentTab !== 'login' && (
        <Navbar
          onOpenSOS={() => setShowSOSModal(true)}
          onNavigateProfile={() => setCurrentTab('profile')}
        />
      )}

      <View style={styles.content}>
        {(currentTab === 'dashboard' || currentTab === 'home') && <Dashboard onOpenSOS={() => setShowSOSModal(true)} />}
        {currentTab === 'journal' && <MoodJournal />}
        {currentTab === 'achievements' && <Achievements />}
        {currentTab === 'community' && <CommunityFeed />}
        {currentTab === 'profile' && <Profile onNavigateAuth={() => setCurrentTab('login')} />}
        {currentTab === 'login' && <LoginPage onDone={() => setCurrentTab('dashboard')} />}
      </View>

      {currentTab !== 'login' && (
        <BottomNav
          activeTab={currentTab}
          onTabChange={setCurrentTab}
          onOpenSOS={() => setShowSOSModal(true)}
        />
      )}

      <SOSModal visible={showSOSModal} onClose={() => setShowSOSModal(false)} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

