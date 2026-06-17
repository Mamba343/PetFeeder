import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type Tone = 'blue' | 'green' | 'orange' | 'red' | 'neutral';

const toneColors: Record<Tone, string> = {
  blue: '#2d5a7b',
  green: '#2f715f',
  neutral: '#59625f',
  orange: '#9a5a22',
  red: '#9b3f3f',
};

type InfoCardProps = {
  detail?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  tone?: Tone;
  value: string;
};

export function InfoCard({ detail, icon, label, tone = 'neutral', value }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: toneColors[tone] }]}>
        <MaterialCommunityIcons name={icon} size={22} color="#ffffff" />
      </View>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7e0d7',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 92,
    padding: 16,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  detail: {
    color: '#71807d',
    fontSize: 13,
    lineHeight: 18,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  label: {
    color: '#71807d',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: '#182422',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
