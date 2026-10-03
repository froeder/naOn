import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, BookOpen, Users, Award, User } from 'lucide-react-native';

const TABS = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'journal', label: 'Diário', icon: BookOpen },
  { id: 'community', label: 'Comunidade', icon: Users },
  { id: 'achievements', label: 'Conquistas', icon: Award },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
              <Icon
                size={22}
                color={isActive ? '#27AE60' : '#94A3B8'}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </View>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    padding: 4,
    borderRadius: 12,
  },
  activeIconContainer: {
    backgroundColor: '#E8F8F0',
  },
  tabLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#27AE60',
    fontWeight: '700',
  },
});
