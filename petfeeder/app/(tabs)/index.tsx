import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { DimensionValue } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { mockFeederStatus, mockHistory, mockSchedules } from '@/data/mock-data';

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
  const latestFeed = mockHistory[0];
  const progressWidth: DimensionValue = `${mockFeederStatus.foodLevel}%`;

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

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Recent Activity</Text>
          <MaterialCommunityIcons name="history" size={22} color="#f8c471" />
        </View>
        <View style={styles.activityRow}>
          <View style={styles.activityIcon}>
            <MaterialCommunityIcons name="check" size={20} color="#07100f" />
          </View>
          <View style={styles.activityCopy}>
            <Text style={styles.activityTitle}>
              {latestFeed.portionGrams}g served to {latestFeed.petName}
            </Text>
            <Text style={styles.activityMeta}>
              {latestFeed.date} at {latestFeed.time} - {latestFeed.source}
            </Text>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  activityCopy: {
    flex: 1,
    gap: 3,
  },
  activityIcon: {
    alignItems: 'center',
    backgroundColor: '#89f7d2',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  activityMeta: {
    color: '#839893',
    fontSize: 13,
    lineHeight: 18,
  },
  activityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  activityTitle: {
    color: '#f4fbf9',
    fontSize: 16,
    fontWeight: '800',
  },
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
