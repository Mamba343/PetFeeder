# Smart PetFeeder Agent Guide

This repository combines a mock React Native mobile app, ESP32 firmware sketches, and 3D printing files for a smart pet feeder. Treat it as an early prototype, not a production-connected system.

## First Principles

- Base changes on the current code, not planned features.
- Do not connect the Expo app to Firebase unless explicitly asked.
- Do not reorganize folders unless explicitly asked.
- Do not edit implementation code while doing documentation-only work.
- Avoid committing secrets. The current firmware sketches contain hard-coded network and Firebase credentials; document and remediate them before production use.
- Preserve user work. The current worktree may include uncommitted app changes.

## Repository Map

- `petfeeder/` - Expo SDK 54 app using React Native, TypeScript, and Expo Router.
- `PetFeeder.ino` and `PetFeeder (1).ino` - ESP32 firmware sketches using WiFi, Firebase RTDB, NTP, and a servo.
- `Printing Files/TESTING/` - `.3mf` 3D-print test files for feeder auger parts.
- `docs/` - repository documentation for future engineers and AI agents.

## App Rules

- The app is mock-only today.
- Mock data lives in `petfeeder/data/mock-data.ts`.
- Screens live in `petfeeder/app/(tabs)/`.
- Shared UI lives in `petfeeder/components/`.
- Theme constants live in `petfeeder/constants/theme.ts`.
- Use TypeScript strict mode and existing component patterns.
- Keep temporary UI state local to screens unless it must be shared.

## Firmware Rules

- Firmware currently polls Firebase RTDB path `/commands/portion_size`.
- Firmware writes status under `/status`.
- Servo pin is defined as GPIO 13.
- One portion is represented as `BASE_FEED_TIME` milliseconds of servo rotation.
- Treat the checked-in credentials as compromised and rotate them before any real deployment.

## Verification

For app changes, run from `petfeeder/`:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\eslint.cmd .
```

For docs-only changes, at minimum verify that all local Markdown links point to files that exist.

