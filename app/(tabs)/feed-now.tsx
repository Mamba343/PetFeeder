import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { InfoCard } from '@/components/info-card';
import { mockFeederStatus, mockSettings } from '@/data/mock-data';

const portions = [25, 40, 55, 70];

export default function FeedNowScreen() {
  const [selectedPortion, setSelectedPortion] = useState(mockSettings.portionSizeGrams);
  const [lastAction, setLastAction] = useState('Ready to dispense');

  function feedNow() {
    setLastAction(`Mock feed sent: ${selectedPortion}g`);
  }

  return (
    <AppScreen title="Feed Now" subtitle="Send a one-time portion from the app.">
      <View style={styles.statusRow}>
        <InfoCard
          icon="food-variant"
          label="Pet"
          value={mockFeederStatus.petName}
          detail="Currently waiting"
          tone="green"
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Portion size</Text>
        <View style={styles.portionGrid}>
          {portions.map((portion) => {
            const selected = selectedPortion === portion;

            return (
              <Pressable
                accessibilityRole="button"
                key={portion}
                onPress={() => setSelectedPortion(portion)}
                style={[styles.portionButton, selected && styles.portionButtonSelected]}>
                <Text style={[styles.portionValue, selected && styles.portionValueSelected]}>
                  {portion}g
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable accessibilityRole="button" onPress={feedNow} style={styles.feedButton}>
          <MaterialCommunityIcons name="bowl-mix" size={24} color="#ffffff" />
          <Text style={styles.feedButtonText}>Dispense Food</Text>
        </Pressable>
      </View>

      <InfoCard icon="check-circle-outline" label="Mock action" value={lastAction} tone="blue" />
      <InfoCard
        icon="database-off-outline"
        label="Data mode"
        value="Mock only"
        detail="Firebase is intentionally not connected yet."
        tone="orange"
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  feedButton: {
    alignItems: 'center',
    backgroundColor: '#245c55',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 18,
  },
  feedButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  panel: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e0d7',
    borderRadius: 8,
    borderWidth: 1,
    gap: 18,
    padding: 18,
  },
  panelTitle: {
    color: '#182422',
    fontSize: 20,
    fontWeight: '800',
  },
  portionButton: {
    alignItems: 'center',
    backgroundColor: '#f6f3ee',
    borderColor: '#ddd5ca',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 54,
    justifyContent: 'center',
  },
  portionButtonSelected: {
    backgroundColor: '#e1f1ee',
    borderColor: '#245c55',
  },
  portionGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  portionValue: {
    color: '#485552',
    fontSize: 16,
    fontWeight: '800',
  },
  portionValueSelected: {
    color: '#245c55',
  },
  statusRow: {
    flexDirection: 'row',
  },
});
