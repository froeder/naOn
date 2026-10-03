import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RotateCcw, DollarSign, Trash2, Award, Heart } from 'lucide-react-native';
import { useSobrietyTimer } from '../hooks/useSobrietyTimer';
import ResetConfirmationModal from './ResetConfirmationModal';

export default function SubstanceCard({ substance, onReset, onDelete }) {
  const [showResetModal, setShowResetModal] = useState(false);
  const timer = useSobrietyTimer(substance.startDate, substance.dailyCost);

  const handleDelete = () => {
    Alert.alert(
      'Remover rastreador',
      `Deseja realmente remover o rastreamento de ${substance.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => onDelete(substance.id) }
      ]
    );
  };

  const color = substance.color || '#27AE60';

  return (
    <>
      <View style={styles.card}>
        <View style={[styles.topBar, { backgroundColor: color }]} />

        <View style={styles.header}>
          <View style={styles.titleInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{substance.name}</Text>
              <View style={styles.activeBadge}>
                <View style={[styles.activeDot, { backgroundColor: color }]} />
                <Text style={[styles.activeText, { color }]}>Ativo</Text>
              </View>
            </View>
            {substance.category ? (
              <Text style={styles.category}>{substance.category}</Text>
            ) : null}
          </View>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Trash2 size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.counterSection}>
          <View style={[styles.daysHeroBox, { backgroundColor: `${color}15` }]}>
            <Text style={[styles.daysNumber, { color }]}>{timer.days}</Text>
            <Text style={styles.daysLabel}>{timer.days === 1 ? 'DIA LIMPO' : 'DIAS LIMPOS'}</Text>
          </View>

          <View style={styles.timeGrid}>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{String(timer.hours).padStart(2, '0')}</Text>
              <Text style={styles.timeUnit}>HORAS</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{String(timer.minutes).padStart(2, '0')}</Text>
              <Text style={styles.timeUnit}>MIN</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{String(timer.seconds).padStart(2, '0')}</Text>
              <Text style={styles.timeUnit}>SEG</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {substance.dailyCost > 0 ? (
            <View style={styles.savingsBox}>
              <DollarSign size={13} color="#059669" />
              <Text style={styles.savingsValue}>R$ {timer.moneySaved.toFixed(2)} salvos</Text>
            </View>
          ) : null}

          {timer.nextMilestone ? (
            <View style={styles.milestonePill}>
              <Award size={13} color="#D97706" />
              <Text style={styles.milestoneText}>
                {timer.nextMilestone.badge} {timer.nextMilestone.title} ({timer.progressPercent}%)
              </Text>
            </View>
          ) : null}
        </View>

        {substance.reason ? (
          <View style={styles.reasonBox}>
            <Heart size={13} color="#DC2626" />
            <Text style={styles.reasonText} numberOfLines={2}>
              "{substance.reason}"
            </Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => setShowResetModal(true)}
            activeOpacity={0.7}
          >
            <RotateCcw size={13} color="#64748B" />
            <Text style={styles.resetBtnText}>Recomeçar contagem</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ResetConfirmationModal
        visible={showResetModal}
        substance={substance}
        onClose={() => setShowResetModal(false)}
        onConfirm={(reason, notes) => {
          setShowResetModal(false);
          onReset(substance.id, reason, notes);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginTop: 4,
  },
  titleInfo: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  category: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  deleteBtn: { padding: 4 },
  counterSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  daysHeroBox: {
    flex: 1.3,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysNumber: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
  },
  daysLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  timeGrid: {
    flex: 1.7,
    flexDirection: 'row',
    gap: 6,
  },
  timeBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  timeUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  savingsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  savingsValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  milestonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  milestoneText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  reasonText: {
    flex: 1,
    fontSize: 11,
    fontStyle: 'italic',
    color: '#991B1B',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
});
