import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import type { DimensionValue } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { mockFeederStatus, mockSchedules, mockSettings } from '@/data/mock-data';

const portions = [25, 40, 55, 70];

type MetricCardProps = {
  accent: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  meta: string;
  value: string;
};

function StatusPill({ label, online }: { label: string; online: boolean }) {
  return (
    <View style={styles.statusPill}>
      <View style={[styles.statusDot, online ? styles.statusDotOnline : styles.statusDotOffline]} />
      <Text style={styles.statusPillText}>{label}</Text>
    </View>
  );
}

function MetricCard({ accent, icon, label, meta, value }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: accent }]}>
        <MaterialCommunityIcons name={icon} size={23} color="#07100f" />
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricMeta}>{meta}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const nextFeed = mockSchedules.find((schedule) => schedule.enabled);
  const [selectedPortion, setSelectedPortion] = useState(mockSettings.portionSizeGrams);
  const [sentPortion, setSentPortion] = useState<number | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressWidth: DimensionValue = `${mockFeederStatus.foodLevel}%`;

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  function dispenseFood() {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }

    setSentPortion(selectedPortion);
    resetTimer.current = setTimeout(() => {
      setSentPortion(null);
      resetTimer.current = null;
    }, 4000);
  }

  return (
    <AppScreen
      theme="dark"
      title="Dashboard"
      subtitle="Kitchen Feeder is monitoring Luna's meals in real time.">
      <View style={styles.commandCard}>
        <View style={styles.commandTopRow}>
          <View>
            <Text style={styles.eyebrow}>Smart PetFeeder</Text>
            <Text style={styles.deviceName}>Kitchen Feeder</Text>
          </View>
          <StatusPill
            label={mockFeederStatus.deviceOnline ? 'Online' : 'Offline'}
            online={mockFeederStatus.deviceOnline}
          />
        </View>

        <View style={styles.bowlRow}>
          <View style={styles.bowlGauge}>
            <Text style={styles.bowlValue}>{mockFeederStatus.foodLevel}%</Text>
            <Text style={styles.bowlLabel}>Food level</Text>
          </View>
          <View style={styles.bowlStats}>
            <Text style={styles.panelLabel}>Remaining</Text>
            <Text style={styles.remainingValue}>{mockFeederStatus.foodRemainingGrams}g</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <Text style={styles.syncText}>Last sync {mockFeederStatus.lastSync}</Text>
          </View>
        </View>
      </View>

      <View style={styles.metricGrid}>
        <MetricCard
          accent="#89f7d2"
          icon="battery-70"
          label="Battery"
          meta="Stable"
          value={`${mockFeederStatus.batteryLevel}%`}
        />
        <MetricCard
          accent="#9bd6ff"
          icon="wifi"
          label="Signal"
          meta="2.4 GHz"
          value="Strong"
        />
      </View>

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Next Feed</Text>
          <MaterialCommunityIcons name="calendar-clock" size={22} color="#89f7d2" />
        </View>
        <View style={styles.feedRow}>
          <Text style={styles.feedTime}>{nextFeed?.time ?? 'No schedule'}</Text>
          <View style={styles.feedChip}>
            <Text style={styles.feedChipText}>{nextFeed ? `${nextFeed.portionGrams}g` : 'Off'}</Text>
          </View>
        </View>
        <Text style={styles.panelMeta}>{nextFeed?.days.join(', ') ?? 'Create a feeding plan'}</Text>
      </View>

      {sentPortion ? (
        <View style={[styles.panel, styles.sentPanel]}>
          <View style={styles.sentIcon}>
            <MaterialCommunityIcons name="check" size={28} color="#07100f" />
          </View>
          <Text style={styles.sentTitle}>Feed sent</Text>
          <Text style={styles.sentMeta}>
            {sentPortion}g dispense action queued for {mockFeederStatus.petName}.
          </Text>
        </View>
      ) : (
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Dispense Food</Text>
            <MaterialCommunityIcons name="bowl-mix-outline" size={22} color="#89f7d2" />
          </View>

          <View style={styles.portionGrid}>
            {portions.map((portion) => {
              const selected = selectedPortion === portion;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={portion}
                  onPress={() => setSelectedPortion(portion)}
                  style={[styles.portionButton, selected && styles.portionButtonSelected]}>
                  <Text style={[styles.portionText, selected && styles.portionTextSelected]}>
                    {portion}g
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable accessibilityRole="button" onPress={dispenseFood} style={styles.dispenseButton}>
            <MaterialCommunityIcons name="send" size={20} color="#07100f" />
            <Text style={styles.dispenseButtonText}>Dispense Now</Text>
          </Pressable>
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  bowlGauge: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#10211f',
    borderColor: '#2d4641',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    width: 132,
  },
  bowlLabel: {
    color: '#8aa09b',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  bowlRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
  },
  bowlStats: {
    flex: 1,
    gap: 8,
  },
  bowlValue: {
    color: '#89f7d2',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 0,
  },
  commandCard: {
    backgroundColor: '#0d1b19',
    borderColor: '#213834',
    borderRadius: 8,
    borderWidth: 1,
    gap: 22,
    padding: 18,
  },
  commandTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceName: {
    color: '#f4fbf9',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 3,
  },
  eyebrow: {
    color: '#89f7d2',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dispenseButton: {
    alignItems: 'center',
    backgroundColor: '#89f7d2',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  dispenseButtonText: {
    color: '#07100f',
    fontSize: 16,
    fontWeight: '900',
  },
  feedChip: {
    backgroundColor: '#1c302c',
    borderColor: '#31534d',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  feedChipText: {
    color: '#89f7d2',
    fontSize: 14,
    fontWeight: '900',
  },
  feedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedTime: {
    color: '#f4fbf9',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
  },
  metricCard: {
    backgroundColor: '#0d1b19',
    borderColor: '#213834',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 7,
    minHeight: 146,
    padding: 16,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  metricLabel: {
    color: '#8aa09b',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metricMeta: {
    color: '#71847f',
    fontSize: 13,
  },
  metricValue: {
    color: '#f4fbf9',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0,
  },
  panel: {
    backgroundColor: '#0d1b19',
    borderColor: '#213834',
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  panelLabel: {
    color: '#8aa09b',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  panelMeta: {
    color: '#839893',
    fontSize: 14,
    lineHeight: 20,
  },
  panelTitle: {
    color: '#f4fbf9',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  progressFill: {
    backgroundColor: '#89f7d2',
    borderRadius: 8,
    height: '100%',
  },
  portionButton: {
    alignItems: 'center',
    backgroundColor: '#132522',
    borderColor: '#294640',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  portionButtonSelected: {
    backgroundColor: '#1f3c36',
    borderColor: '#89f7d2',
  },
  portionGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  portionText: {
    color: '#9caeaa',
    fontSize: 15,
    fontWeight: '900',
  },
  portionTextSelected: {
    color: '#89f7d2',
  },
  progressTrack: {
    backgroundColor: '#172a27',
    borderRadius: 8,
    height: 10,
    overflow: 'hidden',
  },
  remainingValue: {
    color: '#f4fbf9',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sentIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#89f7d2',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  sentMeta: {
    color: '#a5b8b3',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  sentPanel: {
    alignItems: 'center',
    borderColor: '#3d6f63',
    minHeight: 176,
  },
  sentTitle: {
    color: '#f4fbf9',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  statusDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  statusDotOffline: {
    backgroundColor: '#ff817a',
  },
  statusDotOnline: {
    backgroundColor: '#89f7d2',
  },
  statusPill: {
    alignItems: 'center',
    backgroundColor: '#152825',
    borderColor: '#294640',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  statusPillText: {
    color: '#d7e7e3',
    fontSize: 13,
    fontWeight: '800',
  },
  syncText: {
    color: '#71847f',
    fontSize: 13,
  },
});
