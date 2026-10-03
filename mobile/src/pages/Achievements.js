import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Award, CheckCircle2, Lock, Sparkles } from 'lucide-react-native';
import { storeService } from '../services/storeService';
import { MILESTONES } from '../services/mockData';

export default function Achievements() {
  const [substances, setSubstances] = useState([]);

  const loadData = async () => {
    setSubstances(await storeService.getSubstances());
  };

  useEffect(() => {
    loadData();
    return storeService.subscribe((e) => {
      if (['substance_added', 'substance_reset', 'substance_deleted'].includes(e)) {
        loadData();
      }
    });
  }, []);

  // Compute maximum clean days across all tracked substances
  let maxCleanDays = 0;
  substances.forEach((s) => {
    const d = Math.max(0, Math.floor((Date.now() - new Date(s.startDate).getTime()) / (1000 * 60 * 60 * 24)));
    if (d > maxCleanDays) maxCleanDays = d;
  });

  const unlockedCount = MILESTONES.filter((m) => maxCleanDays >= m.days).length;
  const progressPercent = Math.round((unlockedCount / MILESTONES.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Conquistas e Medalhas</Text>
          <Text style={styles.subtitle}>Comemore cada marco no seu caminho de sobriedade.</Text>
        </View>

        {/* Top Progress Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroUnlockedText}>{unlockedCount} de {MILESTONES.length} Conquistas</Text>
              <Text style={styles.heroSubText}>Maior sequência atual: {maxCleanDays} dias</Text>
            </View>
            <View style={styles.heroPercentCircle}>
              <Text style={styles.heroPercentText}>{progressPercent}%</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Milestone Cards List */}
        <View style={styles.milestoneList}>
          {MILESTONES.map((m) => {
            const isUnlocked = maxCleanDays >= m.days;
            const remaining = m.days - maxCleanDays;
            return (
              <View
                key={m.id}
                style={[
                  styles.card,
                  isUnlocked ? styles.unlockedCard : styles.lockedCard
                ]}
              >
                <View style={[styles.badgeBox, isUnlocked ? styles.badgeBoxUnlocked : styles.badgeBoxLocked]}>
                  <Text style={styles.badgeEmoji}>{m.badge}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.cardTitleRow}>
                    <Text style={[styles.cardTitle, isUnlocked && styles.cardTitleUnlocked]}>{m.title}</Text>
                    {isUnlocked ? (
                      <View style={styles.statusUnlocked}>
                        <CheckCircle2 size={13} color="#27AE60" />
                        <Text style={styles.statusUnlockedText}>Conquistado</Text>
                      </View>
                    ) : (
                      <View style={styles.statusLocked}>

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
  heroCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroUnlockedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  heroSubText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  heroPercentCircle: {
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27AE60',
  },
  heroPercentText: {
    color: '#27AE60',
    fontWeight: '800',
    fontSize: 13,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 4,
  },
  milestoneList: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  unlockedCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  lockedCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.75,
  },
  badgeBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeBoxUnlocked: {
    backgroundColor: '#E8F8F0',
  },
  badgeBoxLocked: {
    backgroundColor: '#F1F5F9',
  },
  badgeEmoji: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  cardTitleUnlocked: {
    color: '#0F172A',
  },
  statusUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statusUnlockedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#27AE60',
  },
  statusLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statusLockedText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cardDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});

                        <Lock size={12} color="#94A3B8" />
                        <Text style={styles.statusLockedText}>Faltam {remaining}d</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardDesc}>{m.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
