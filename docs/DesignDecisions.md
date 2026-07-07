# Design Decisions

## Current Decisions

- Use Expo SDK 54 for the mobile app.
- Use Expo Router for file-based routing.
- Use bottom tabs as the primary navigation model.
- Use TypeScript strict mode.
- Keep app data mock-only until a backend integration is explicitly added.
- Centralize mock feeder data in `petfeeder/data/mock-data.ts`.
- Use local screen state for temporary interactions such as selected portion and schedule toggles.
- Use `@expo/vector-icons` MaterialCommunityIcons for the current app UI.
- Use Firebase Realtime Database in firmware sketches.
- Use polling from firmware rather than push messaging or a broker.
- Use a servo on GPIO 13 for dispensing.

## Important Consequences

- App behavior is easy to preview without backend setup.
- Firmware can operate independently of the app if Firebase paths are written externally.
- There is currently duplicated product intent: the app's planned schema differs from the firmware's implemented schema.
- The project is not production-safe while credentials remain checked into firmware.

## Alternatives Not Yet Implemented

- MQTT or HTTP device API.
- Cloud Functions as a command mediator.
- Bluetooth pairing.
- Local persistent app storage.
- A typed app service layer.
- Automated test suite.

## Assumptions

- Firebase RTDB remains the intended first backend because it is already used in firmware and described in the nested agent guide.
- The current app visual style is intentionally quiet and utilitarian for an IoT control panel.

