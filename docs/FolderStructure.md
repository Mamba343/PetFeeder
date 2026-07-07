# Folder Structure

## Root

- `.git/` - Git metadata.
- `.gitattributes` - Line-ending normalization.
- `README.md` - Repository overview.
- `AGENTS.md` - AI agent handoff guide.
- `docs/` - Architecture, setup, status, API, database, hardware, and maintenance docs.
- `PetFeeder.ino` - ESP32 firmware sketch using one WiFi SSID.
- `PetFeeder (1).ino` - ESP32 firmware sketch variant using a different WiFi SSID.
- `Printing Files/` - 3D printing assets.
- `ali.txt`, `kjahdskahs.txt` - Unclassified root text files with no apparent app or firmware role.

## `Printing Files/`

- `TESTING/` - `.3mf` test files for pet feeder auger parts.

## `petfeeder/`

- `app/` - Expo Router routes and screens.
- `assets/` - App icons, splash image, favicon, and starter React logo assets.
- `components/` - Shared React Native UI components.
- `constants/` - Theme constants.
- `data/` - Central mock data used by app screens.
- `hooks/` - Theme and color-scheme hooks.
- `scripts/` - Expo starter reset script.
- `package.json` - App scripts and dependencies.
- `package-lock.json` - Locked npm dependency graph.
- `app.json` - Expo app configuration.
- `tsconfig.json` - TypeScript configuration.
- `eslint.config.js` - Expo ESLint configuration.
- `AGENTS.md` - Existing nested agent guide with app-specific and planned Firebase notes.
- `CLAUDE.md` - Pointer to `AGENTS.md`.
- `expo-dev.log` - Development log artifact; not part of runtime.

## Major App Modules

- `app/(tabs)/index.tsx` - Dashboard screen with feeder status, next feed, and local dispense action.
- `app/(tabs)/feed-now.tsx` - One-time mock dispense screen.
- `app/(tabs)/schedule.tsx` - Mock schedule list and local toggles.
- `app/(tabs)/history.tsx` - Mock feeding history.
- `app/(tabs)/settings.tsx` - Mock settings and alert toggle.
- `app/(tabs)/message.tsx` - Simple message screen currently present in the working tree.
- `components/app-screen.tsx` - Shared safe-area scroll layout.
- `components/info-card.tsx` - Shared info/status card.
- `components/haptic-tab.tsx` - iOS tab press haptic wrapper.

