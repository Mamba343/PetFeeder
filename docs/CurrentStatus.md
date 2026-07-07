# Current Status

## What Exists

- Expo SDK 54 app in `petfeeder/`.
- Bottom-tab app shell with Dashboard, Feed Now, Schedule, History, Settings, and Message tabs.
- Local mock feeder status, schedule, history, and settings data.
- ESP32 sketches that connect to WiFi and Firebase RTDB.
- Servo-based dispensing logic in firmware.
- 3D printing test files for feeder auger parts.

## What Works Locally

- The app can be installed and started with Expo.
- App screens render static/mock information.
- Feed Now and Dashboard dispense buttons update local UI state only.
- Schedule toggles update local in-memory state only.

## What Is Not Connected

- The app is not connected to Firebase.
- The app does not communicate with the ESP32.
- There is no authentication in the app.
- There is no persistent app-side storage.
- Firmware and app database schemas do not currently match.

## Uncommitted Work Observed

At the time this documentation was generated, these app files had uncommitted changes:

- `petfeeder/app/(tabs)/_layout.tsx`
- `petfeeder/app/(tabs)/index.tsx`
- `petfeeder/app/(tabs)/message.tsx`

This documentation describes the files as they exist in the working tree.

## Assumptions

- The intended production backend is Firebase Realtime Database because both existing agent notes and firmware sketches reference Firebase RTDB.
- The ESP32 is the target microcontroller because the firmware includes `WiFi.h`, `Firebase_ESP_Client.h`, and `ESP32Servo.h`.
- The `.3mf` files are mechanical test assets for feeder auger hardware based on their filenames.

