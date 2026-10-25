import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';

export default function MessageScreen() {
  return (
    <AppScreen title="Message" subtitle="Custom note">
      <View style={styles.card}>
        <Text style={styles.message}>Zaed Chutiya Bhadko</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7e0d7',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 180,
    padding: 24,
  },
  message: {
    color: '#182422',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
});
