import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Linking, Animated, Easing } from 'react-native';
import { ShieldAlert, Phone, Wind, X, Sparkles } from 'lucide-react-native';
import { EMERGENCY_CONTACTS, COPING_EXERCISES } from '../services/mockData';

export default function SOSModal({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState('call');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Pronto para começar?');
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleCall = (phone) => Linking.openURL(`tel:${phone}`);

  useEffect(() => {
    let timer;
    if (visible && isBreathing) {
      const runCycle = () => {
        setBreathPhase('Inspire pelo nariz (4s)...');
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();

        timer = setTimeout(() => {
          setBreathPhase('Segure o ar (7s)...');
          timer = setTimeout(() => {
            setBreathPhase('Solte pela boca (8s)...');
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 8000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }).start();
            timer = setTimeout(() => runCycle(), 8000);
          }, 7000);
        }, 4000);
      };
      runCycle();
    } else {
      scaleAnim.setValue(1);
      setBreathPhase('Pronto para começar?');
    }
    return () => clearTimeout(timer);
  }, [visible, isBreathing]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.alertIcon}>
                <ShieldAlert size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>SOS Emergência</Text>
                <Text style={styles.headerSubtitle}>Essa fissura vai passar.</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}><X size={20} color="#64748B" /></TouchableOpacity>
          </View>

          <View style={styles.navRow}>
            {['call', 'breathe', 'tips'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.navBtn, activeTab === tab && styles.navBtnActive]}
                onPress={() => { setActiveTab(tab); if (tab !== 'breathe') setIsBreathing(false); }}
              >
                <Text style={[styles.navBtnText, activeTab === tab && styles.navBtnTextActive]}>
                  {tab === 'call' ? 'Ligar' : tab === 'breathe' ? 'Respiração' : 'Dicas'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {activeTab === 'call' && EMERGENCY_CONTACTS.map((item) => (
              <TouchableOpacity key={item.phone} style={styles.contactCard} onPress={() => handleCall(item.phone)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactDesc}>{item.description}</Text>
                </View>
                <View style={styles.callBadge}>
                  <Phone size={12} color="#FFFFFF" />
                  <Text style={styles.callBadgeText}>{item.phone}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {activeTab === 'breathe' && (
              <View style={styles.breatheBox}>
                <Animated.View style={[styles.breathCircle, { transform: [{ scale: scaleAnim }] }]}>
                  <Text style={styles.circlePhaseText}>{breathPhase}</Text>
                </Animated.View>
                <TouchableOpacity
                  style={[styles.toggleBreatheBtn, isBreathing ? styles.stopBreathe : styles.startBreathe]}
                  onPress={() => setIsBreathing(!isBreathing)}
                >
                  <Text style={styles.toggleBreatheText}>{isBreathing ? 'Pausar' : 'Iniciar Respiração'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'tips' && COPING_EXERCISES.map((ex) => (
              <View key={ex.id} style={styles.exerciseCard}>
                <Text style={styles.exerciseTitle}>{ex.title} ({ex.duration})</Text>
                <Text style={styles.exerciseDesc}>{ex.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertIcon: {
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  navRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  navBtnActive: {
    backgroundColor: '#FEE2E2',
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  navBtnTextActive: {
    color: '#EF4444',
    fontWeight: '700',
  },
  scrollBody: {
    maxHeight: 380,
    marginBottom: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  contactDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  callBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  callBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  breatheBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  circleContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E0F2FE',
    borderWidth: 4,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  circlePhaseText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
    textAlign: 'center',
  },
  toggleBreatheBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startBreathe: {
    backgroundColor: '#0284C7',
  },
  stopBreathe: {
    backgroundColor: '#EF4444',
  },
  toggleBreatheText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  exerciseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  exerciseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  exerciseDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
