import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { mockSchedules, ScheduleItem } from '@/data/mock-data';

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(mockSchedules);

  function toggleSchedule(id: string) {
    setSchedules((current) =>
      current.map((schedule) =>
        schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
      )
    );
  }

  return (
    <AppScreen title="Schedule" subtitle="Manage recurring meals with local mock data.">
      {schedules.map((schedule) => (
        <View key={schedule.id} style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.icon}>
              <MaterialCommunityIcons name="calendar-clock" size={24} color="#ffffff" />
            </View>
            <View style={styles.copy}>
              <Text style={styles.label}>{schedule.label}</Text>
              <Text style={styles.time}>{schedule.time}</Text>
            </View>
            <Switch
              onValueChange={() => toggleSchedule(schedule.id)}
              thumbColor="#ffffff"
              trackColor={{ false: '#c8c0b6', true: '#245c55' }}
              value={schedule.enabled}
            />
          </View>

          <View style={styles.details}>
            <Text style={styles.detailText}>{schedule.portionGrams}g portion</Text>
            <Text style={styles.detailText}>{schedule.days.join(', ')}</Text>
          </View>
        </View>
      ))}

      <Pressable accessibilityRole="button" style={styles.addButton}>
        <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#245c55" />
        <Text style={styles.addButtonText}>Add mock schedule</Text>
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#245c55',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 56,
  },
  addButtonText: {
    color: '#245c55',
    fontSize: 16,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e0d7',
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 16,
  },
  copy: {
    flex: 1,
  },
  details: {
    backgroundColor: '#f6f3ee',
    borderRadius: 8,
    gap: 4,
    padding: 12,
  },
  detailText: {
    color: '#64716f',
    fontSize: 14,
    fontWeight: '700',
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#2d5a7b',
    borderRadius: 8,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  label: {
    color: '#182422',
    fontSize: 18,
    fontWeight: '800',
  },
  time: {
    color: '#245c55',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});
