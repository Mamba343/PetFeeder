# Smart PetFeeder Agent Guide

This repository combines a React Native mobile app, ESP32 firmware, and 3D printing files for a smart pet feeder. The current state is an early prototype with mock app data and basic firmware.

## First Principles

- Base changes on the current code, not planned features.
- Do not reorganize folders unless explicitly asked.
- Do not edit implementation code while doing documentation-only work.
- Avoid committing secrets. Use `secrets.h` (gitignored) for firmware credentials.
- Preserve user work. The current worktree may include uncommitted changes.

## Repository Map

- `petfeeder/` - Expo SDK 54 app using React Native, TypeScript, and Expo Router.
- `PetFeeder.ino` - ESP32 firmware sketch using WiFi, Firebase RTDB streaming, NTP, servo, and LED.
- `secrets.h` - Firmware credentials (NOT committed, gitignored).
- `Printing Files/TESTING/` - `.3mf` 3D-print test files for feeder auger parts.
- `docs/` - Repository documentation for future engineers and AI agents.

## App Rules

- The app is mock-only today. Firebase integration planned for Phase 2.
- Mock data lives in `petfeeder/data/mock-data.ts`.
- Screens live in `petfeeder/app/(tabs)/`.
- Shared UI lives in `petfeeder/components/`.
- Theme constants live in `petfeeder/constants/theme.ts`.
- Firebase integration will live in `petfeeder/lib/firebase.ts` (planned).
- Use TypeScript strict mode and existing component patterns.
- Keep temporary UI state local to screens unless it must be shared.

## Firmware Rules

- Firmware uses **Firebase streaming** (not polling) on `/commands/portion_size`.
- Firmware writes status under `/status`.
- Servo pin is defined as GPIO 13.
- LED pin is defined as GPIO 2.
- One portion is represented as `BASE_FEED_TIME` milliseconds of servo rotation.
- Use non-blocking state machine (IDLE → FEEDING → DONE).
- Credentials must be in `secrets.h` (not hard-coded).
- Treat the checked-in credentials as compromised and rotate them before any real deployment.

## Hardware

- ESP32 AI Thinker microcontroller
- SG90 micro servo (GPIO 13)
- Status LED (GPIO 2, through 330Ω resistor)
- See [Hardware Documentation](docs/Hardware.md) for wiring diagram

## Development Phases

See [Roadmap](docs/Roadmap.md) for the full development plan.

- **Phase 1:** Firmware core (streaming, non-blocking servo, LED)
- **Phase 2:** App-Firebase bridge (Firebase SDK, Feed Now, real-time status)
- **Phase 3:** Schedules and history

## Verification

For app changes, run from `petfeeder/`:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\eslint.cmd .
```

For firmware changes:

1. Compile in Arduino IDE (no errors)
2. Flash to ESP32
3. Test on hardware (see [Development Guide](docs/DevelopmentGuide.md))

For docs-only changes, at minimum verify that all local Markdown links point to files that exist.
