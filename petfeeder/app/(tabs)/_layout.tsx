import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TabIconName = keyof typeof MaterialCommunityIcons.glyphMap;

function TabIcon({ color, name }: { color: string; name: TabIconName }) {
  return <MaterialCommunityIcons color={color} name={name} size={26} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarButton: HapticTab,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 86,
          paddingBottom: 22,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="view-dashboard-outline" />,
        }}
      />
      <Tabs.Screen
        name="feed-now"
        options={{
          title: 'Feed Now',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="bowl-mix-outline" />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="calendar-clock" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="history" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="cog-outline" />,
        }}
      />
    </Tabs>
  );
}
