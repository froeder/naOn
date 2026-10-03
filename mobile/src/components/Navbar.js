import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShieldAlert, Sparkles, Heart } from 'lucide-react-native';

export default function Navbar({ onOpenSOS }) {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Sparkles size={18} color="#27AE60" />
        </View>
        <View>
          <Text style={styles.logoText}>na<Text style={styles.logoAccent}>On</Text></Text>
          <Text style={styles.tagline}>Só por hoje</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.sosButton}
        onPress={onOpenSOS}
        activeOpacity={0.8}
      >
        <ShieldAlert size={18} color="#FFFFFF" />
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E8F8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  logoAccent: {
    color: '#27AE60',
  },
  tagline: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: -2,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
