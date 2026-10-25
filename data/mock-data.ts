export type FeedSource = 'Manual' | 'Scheduled' | 'App';

export type FeedHistoryItem = {
  id: string;
  date: string;
  time: string;
  portionGrams: number;
  petName: string;
  source: FeedSource;
  status: 'Completed' | 'Skipped';
};

export type ScheduleItem = {
  id: string;
  days: string[];
  enabled: boolean;
  label: string;
  portionGrams: number;
  time: string;
};

export const mockFeederStatus = {
  batteryLevel: 78,
  deviceOnline: true,
  foodLevel: 64,
  foodRemainingGrams: 1280,
  lastSync: '2 min ago',
  petName: 'Luna',
};

export const mockSchedules: ScheduleItem[] = [
  {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: true,
    id: 'morning',
    label: 'Breakfast',
    portionGrams: 55,
    time: '7:30 AM',
  },
  {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    id: 'dinner',
    label: 'Dinner',
    portionGrams: 60,
    time: '6:00 PM',
  },
  {
    days: ['Sat', 'Sun'],
    enabled: false,
    id: 'weekend-snack',
    label: 'Weekend snack',
    portionGrams: 20,
    time: '2:00 PM',
  },
];

export const mockHistory: FeedHistoryItem[] = [
  {
    date: 'Today',
    id: 'feed-1',
    petName: 'Luna',
    portionGrams: 55,
    source: 'Scheduled',
    status: 'Completed',
    time: '7:30 AM',
  },
  {
    date: 'Yesterday',
    id: 'feed-2',
    petName: 'Luna',
    portionGrams: 60,
    source: 'Scheduled',
    status: 'Completed',
    time: '6:00 PM',
  },
  {
    date: 'Yesterday',
    id: 'feed-3',
    petName: 'Luna',
    portionGrams: 25,
    source: 'App',
    status: 'Completed',
    time: '1:15 PM',
  },
  {
    date: 'Yesterday',
    id: 'feed-4',
    petName: 'Luna',
    portionGrams: 55,
    source: 'Scheduled',
    status: 'Completed',
    time: '7:30 AM',
  },
  {
    date: 'Mon, Jun 15',
    id: 'feed-5',
    petName: 'Luna',
    portionGrams: 60,
    source: 'Scheduled',
    status: 'Skipped',
    time: '6:00 PM',
  },
];

export const mockSettings = {
  alertsEnabled: true,
  feederName: 'Kitchen Feeder',
  lowFoodAlertAt: 20,
  portionSizeGrams: 55,
  quietHours: '10:00 PM - 6:00 AM',
  timezone: 'Asia/Singapore',
};
