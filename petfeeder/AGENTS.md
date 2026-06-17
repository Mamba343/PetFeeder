# Smart PetFeeder Agents Guide

## Project Overview

Smart PetFeeder is a React Native Expo app built with TypeScript and Expo Router. The current app is a mock-only prototype for controlling and monitoring an IoT pet feeder.

The app currently includes:

- Dashboard: dark IoT-style control panel with device status, food level, battery, signal, next feed, and recent activity.
- Feed Now: local mock portion selector and mock dispense action.
- Schedule: local mock schedule list with toggles.
- History: mock feeding event log.
- Settings: mock device and alert settings.

Do not connect Firebase or any real device API until that work is explicitly requested.

## Technical Stack

- Expo SDK 54
- React Native
- TypeScript
- Expo Router file-based routing
- Bottom tab navigation
- `@expo/vector-icons` for icons
- Mock data in `data/mock-data.ts`

Important: Expo has changed across versions. Before making Expo-specific changes, check the exact SDK 54 docs at:

https://docs.expo.dev/versions/v54.0.0/

## App Architecture

The main app lives under `app/` and uses Expo Router.

- `app/_layout.tsx`: root stack layout.
- `app/(tabs)/_layout.tsx`: bottom tab navigator.
- `app/(tabs)/index.tsx`: Dashboard screen.
- `app/(tabs)/feed-now.tsx`: Feed Now screen.
- `app/(tabs)/schedule.tsx`: Schedule screen.
- `app/(tabs)/history.tsx`: History screen.
- `app/(tabs)/settings.tsx`: Settings screen.

Shared UI lives under `components/`.

- `components/app-screen.tsx`: shared screen wrapper with light and dark theme support.
- `components/info-card.tsx`: reusable status/info card.
- `components/haptic-tab.tsx`: haptic tab button behavior.

Shared mock app data lives in:

- `data/mock-data.ts`

Theme constants live in:

- `constants/theme.ts`

## Current Data Rules

Use mock data only for now.

- Do not add Firebase packages yet.
- Do not add Firebase config files yet.
- Do not read or write remote data.
- Keep temporary UI state inside screen components unless the state needs to be shared.
- Keep mock data centralized in `data/mock-data.ts`.

## Planned Firebase Realtime Database Schema

This schema is planned for a future Firebase RTDB integration. It is not implemented yet.

```json
{
  "users": {
    "{userId}": {
      "displayName": "Ali",
      "email": "ali@example.com",
      "createdAt": 1764547200000,
      "defaultFeederId": "{feederId}"
    }
  },
  "feeders": {
    "{feederId}": {
      "name": "Kitchen Feeder",
      "ownerId": "{userId}",
      "petName": "Luna",
      "timezone": "Asia/Singapore",
      "deviceOnline": true,
      "lastSeenAt": 1764547200000,
      "lastSyncAt": 1764547200000,
      "foodLevel": 64,
      "foodRemainingGrams": 1280,
      "batteryLevel": 78,
      "signalStrength": "strong",
      "firmwareVersion": "1.0.0"
    }
  },
  "settings": {
    "{feederId}": {
      "alertsEnabled": true,
      "lowFoodAlertAt": 20,
      "defaultPortionGrams": 55,
      "quietHours": {
        "enabled": true,
        "start": "22:00",
        "end": "06:00"
      }
    }
  },
  "schedules": {
    "{feederId}": {
      "{scheduleId}": {
        "label": "Breakfast",
        "time": "07:30",
        "days": ["mon", "tue", "wed", "thu", "fri"],
        "portionGrams": 55,
        "enabled": true,
        "createdAt": 1764547200000,
        "updatedAt": 1764547200000
      }
    }
  },
  "feedCommands": {
    "{feederId}": {
      "{commandId}": {
        "requestedBy": "{userId}",
        "portionGrams": 55,
        "source": "app",
        "status": "pending",
        "createdAt": 1764547200000,
        "completedAt": null,
        "errorMessage": null
      }
    }
  },
  "feedHistory": {
    "{feederId}": {
      "{historyId}": {
        "petName": "Luna",
        "portionGrams": 55,
        "source": "scheduled",
        "status": "completed",
        "scheduledId": "{scheduleId}",
        "createdAt": 1764547200000,
        "completedAt": 1764547212000
      }
    }
  },
  "alerts": {
    "{feederId}": {
      "{alertId}": {
        "type": "low_food",
        "severity": "warning",
        "message": "Food level is below 20%.",
        "createdAt": 1764547200000,
        "read": false
      }
    }
  }
}
```

## RTDB Design Notes

- Store timestamps as Unix milliseconds.
- Use lowercase enum values in Firebase, such as `scheduled`, `manual`, `app`, `completed`, `pending`, and `skipped`.
- Keep feeder status under `feeders/{feederId}` so Dashboard can subscribe to one compact path.
- Keep write-only feed requests under `feedCommands/{feederId}` so the app can request a dispense without directly mutating hardware state.
- Keep historical records under `feedHistory/{feederId}` and query by timestamp when needed.
- Keep user-owned feeder access rules strict when Firebase Auth is added.

## Planned Features

Near term:

- Add Firebase Auth sign-in.
- Connect Dashboard to Firebase RTDB live feeder status.
- Send Feed Now requests to `feedCommands/{feederId}`.
- Read schedules from `schedules/{feederId}`.
- Read feed logs from `feedHistory/{feederId}`.
- Add loading, empty, offline, and error states.

Device and IoT:

- Add ESP/Arduino device sync contract.
- Mark feeder online/offline based on `lastSeenAt`.
- Add command acknowledgement from device firmware.
- Add calibration for grams-per-second dispensing.
- Add jam detection and motor fault alerts.

Product features:

- Multi-pet profiles.
- Multiple feeders per user.
- Low food push notifications.
- Missed meal alerts.
- Feeding analytics by day and week.
- Vacation mode.
- Manual device pairing flow.
- Firmware version display and update status.

UX improvements:

- Add editable schedule creation.
- Add confirmation and success states for Feed Now.
- Add charting for food usage.
- Add accessible labels for all interactive controls.
- Add responsive tablet layouts.

## Coding Guidelines

- Keep TypeScript strict and avoid `any`.
- Prefer existing app patterns before adding new abstractions.
- Keep Firebase integration isolated when it is introduced, likely under a future `services/` or `lib/firebase/` folder.
- Keep screens focused on presentation and local interaction.
- Use shared components for repeated UI patterns.
- Do not hard-code real credentials, API keys, device IDs, or user IDs.
- Do not introduce real backend writes without clear user approval.

## Verification

Before handing off app changes, run:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\eslint.cmd .
```

If `npm` or `npx` is not available on PATH, use the local project binaries as shown above.
