import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { mockHistory } from '@/data/mock-data';

export default function HistoryScreen() {
  return (
    <AppScreen title="History" subtitle="Recent feeding events from mock records.">
      {mockHistory.map((item) => {
        const skipped = item.status === 'Skipped';

        return (
          <View key={item.id} style={styles.row}>
            <View style={[styles.statusIcon, skipped && styles.statusIconSkipped]}>
              <MaterialCommunityIcons
                name={skipped ? 'alert-circle-outline' : 'check-circle-outline'}
                size={24}
                color="#ffffff"
              />
            </View>

            <View style={styles.copy}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.portionGrams}g served</Text>
                <Text style={[styles.status, skipped && styles.statusSkipped]}>{item.status}</Text>
              </View>
              <Text style={styles.meta}>
                {item.date} at {item.time} - {item.source}
              </Text>
            </View>
          </View>
        );
      })}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    gap: 4,
  },
  meta: {
    color: '#71807d',
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7e0d7',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  status: {
    color: '#2f715f',
    fontSize: 13,
    fontWeight: '800',
  },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: '#2f715f',
    borderRadius: 8,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  statusIconSkipped: {
    backgroundColor: '#9a5a22',
  },
  statusSkipped: {
    color: '#9a5a22',
  },
  title: {
    color: '#182422',
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
