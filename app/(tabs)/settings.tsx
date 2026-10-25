import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { InfoCard } from '@/components/info-card';
import { mockFeederStatus, mockSettings } from '@/data/mock-data';

export default function SettingsScreen() {
  const [alertsEnabled, setAlertsEnabled] = useState(mockSettings.alertsEnabled);

  return (
    <AppScreen title="Settings" subtitle="Device preferences stored as mock state.">
      <View style={styles.profile}>
        <View style={styles.profileIcon}>
          <MaterialCommunityIcons name="cat" size={34} color="#ffffff" />
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileLabel}>{mockSettings.feederName}</Text>
          <Text style={styles.profileMeta}>Paired with {mockFeederStatus.petName}</Text>
        </View>
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingTitle}>Low food alerts</Text>
          <Text style={styles.settingMeta}>Notify below {mockSettings.lowFoodAlertAt}%</Text>
        </View>
        <Switch
          onValueChange={setAlertsEnabled}
          thumbColor="#ffffff"
          trackColor={{ false: '#c8c0b6', true: '#245c55' }}
          value={alertsEnabled}
        />
      </View>

      <InfoCard
        icon="scale"
        label="Default portion"
        value={`${mockSettings.portionSizeGrams}g`}
        tone="green"
      />
      <InfoCard icon="weather-night" label="Quiet hours" value={mockSettings.quietHours} />
      <InfoCard icon="map-clock-outline" label="Timezone" value={mockSettings.timezone} tone="blue" />
      <InfoCard
        icon="sync"
        label="Last sync"
        value={mockFeederStatus.lastSync}
        detail="Mock device status"
        tone="orange"
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7e0d7',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  profileCopy: {
    flex: 1,
    gap: 3,
  },
  profileIcon: {
    alignItems: 'center',
    backgroundColor: '#245c55',
    borderRadius: 8,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  profileLabel: {
    color: '#182422',
    fontSize: 20,
    fontWeight: '800',
  },
  profileMeta: {
    color: '#71807d',
    fontSize: 14,
  },
  settingMeta: {
    color: '#71807d',
    fontSize: 14,
    marginTop: 4,
  },
  settingRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7e0d7',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingTitle: {
    color: '#182422',
    fontSize: 17,
    fontWeight: '800',
  },
});
