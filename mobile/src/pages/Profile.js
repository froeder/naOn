import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native';
import { User, LogOut, ShieldCheck, Trash2, Edit2, Check, RefreshCw, Heart } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { storeService } from '../services/storeService';

export default function Profile({ onNavigateAuth }) {
  const { user, logout, updateProfile, isGuest } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.displayName || '');

  const handleSaveName = async () => {
    if (!name.trim()) return;
    await updateProfile({ displayName: name.trim() });
    setEditingName(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleResetAllData = () => {
    Alert.alert(
      'Limpar todos os dados',
      'Tem certeza de que deseja apagar todos os rastreadores e histórico? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar Tudo',
          style: 'destructive',
          onPress: async () => {
            await storeService.clearAllData();
            Alert.alert('Concluído', 'Dados restaurados para o padrão.');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sair da Conta', 'Deseja encerrar a sessão atual?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
          <Text style={styles.subtitle}>Gerencie sua conta e configurações</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>

          {editingName ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome ou apelido"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity style={styles.saveNameBtn} onPress={handleSaveName}>
                <Check size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.displayName}>{user?.displayName || 'Guerreiro(a) Anônimo'}</Text>
              <TouchableOpacity onPress={() => setEditingName(true)}>
                <Edit2 size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.emailText}>{isGuest ? 'Modo Visitante (Anônimo)' : user?.email}</Text>

          {isGuest && (
            <TouchableOpacity style={styles.authBanner} onPress={onNavigateAuth} activeOpacity={0.8}>
              <ShieldCheck size={16} color="#27AE60" />
              <View style={{ flex: 1 }}>
                <Text style={styles.authBannerTitle}>Criar conta / Fazer Login</Text>
                <Text style={styles.authBannerSub}>Salve seu progresso na nuvem de forma segura.</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Preferences / Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidade e Dados</Text>

          <View style={styles.infoCard}>
            <ShieldCheck size={20} color="#27AE60" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>100% Privado e Seguro</Text>
              <Text style={styles.infoDesc}>Seus dados de sobriedade e diário pertencem a você e são mantidos confidenciais.</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.dangerBtn} onPress={handleResetAllData} activeOpacity={0.7}>
            <Trash2 size={18} color="#EF4444" />
            <Text style={styles.dangerBtnText}>Resetar / Limpar todos os dados</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <LogOut size={18} color="#64748B" />
          <Text style={styles.logoutBtnText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#27AE60',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarTextLarge: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  emailText: {
    fontSize: 13,
    color: '#64748B',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 15,
    minWidth: 180,
  },
  saveNameBtn: {
    backgroundColor: '#27AE60',
    padding: 8,
    borderRadius: 8,
  },
  authBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E8F8F0',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    width: '100%',
  },
  authBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#27AE60',
  },
  authBannerSub: {
    fontSize: 11,
    color: '#065F46',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  infoDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  logoutBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
});
