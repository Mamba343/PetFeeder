import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppScreenProps = PropsWithChildren<{
  theme?: 'dark' | 'light';
  title: string;
  subtitle?: string;
}>;

export function AppScreen({ children, theme = 'light', title, subtitle }: AppScreenProps) {
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{subtitle}</Text>
          ) : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 108,
  },
  header: {
    gap: 6,
    paddingTop: 8,
  },
  safeArea: {
    backgroundColor: '#f6f3ee',
    flex: 1,
  },
  safeAreaDark: {
    backgroundColor: '#07100f',
  },
  subtitle: {
    color: '#64716f',
    fontSize: 16,
    lineHeight: 22,
  },
  subtitleDark: {
    color: '#8aa09b',
  },
  title: {
    color: '#182422',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0,
  },
  titleDark: {
    color: '#f4fbf9',
  },
});
