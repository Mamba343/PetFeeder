# Known Issues

## Security (Planned Fix: Phase 1.1)

- **Firmware sketches contain hard-coded WiFi credentials, Firebase API key, Firebase database URL, and Firebase user credentials.**
- Treat all committed credentials as compromised and rotate them.
- **Fix:** Create `secrets.h` (gitignored) and remove credentials from source code.
- No Firebase security rules are documented in this repository.
- **Fix:** Add minimal security rules for authenticated access.

## Firmware Robustness (Planned Fix: Phase 1.2-1.3)

- **Polls Firebase every second without backoff.**
- **Fix:** Replace with Firebase streaming (persistent HTTP connection).
- **Uses blocking `delay()` while dispensing.**
- **Fix:** Replace with `millis()` state machine (non-blocking).
- No explicit handling for Firebase read/write failures.
- No jam detection, motor fault detection, or low-food sensor integration.
- Portion size maps directly to time, not measured grams.
- **Status:** Acceptable for v1. Weight-based portioning is a v2 feature.

## App and Firmware Integration (Planned Fix: Phase 2)

- App uses mock data only.
- Firmware uses live Firebase RTDB paths.
- App planned schema and firmware implemented schema do not match.
- **Fix:** Adopt simplified flat schema from firmware.
- Feed actions in the app do not reach the device.
- **Fix:** Add Firebase SDK to app, connect Feed Now screen.
- Firmware has no app-visible command acknowledgement model beyond status fields.
- **Fix:** Add `lastSeenAt` heartbeat for offline detection.

## App Completeness (Planned Fix: Phase 2-3)

- No authentication.
- **Fix:** Add Firebase Anonymous auth (Phase 2.4).
- No persistent storage.
- No backend service layer.
- No automated tests.
- No loading, empty, offline, or error states.
- The Schedule screen's "Add mock schedule" button has no action.
- **Fix:** Add schedule CRUD in Phase 3.
- Some Expo starter components and assets remain even though current PetFeeder screens do not use them.
- `petfeeder/README.md` was originally a starter readme and has been replaced with a project pointer.

## Hardware (Planned Fix: Phase 1.4)

- **No status LED wired or programmed.**
- **Fix:** Wire LED on GPIO 2, add LED state functions.
- No load cell for weight-based portioning.
- **Status:** Deferred to v2.
- No jam detection sensor.
- **Status:** Deferred to v2.

## Repository Hygiene

- Root text files `ali.txt` and `kjahdskahs.txt` have no documented purpose.
- `petfeeder/expo-dev.log` appears to be a development artifact.
- Duplicate firmware sketches differ mainly by WiFi SSID.
- **Fix:** Consolidate to single firmware with configurable WiFi.

## TODOs Found in Code

No `TODO` or `FIXME` markers were found in the app or firmware source. Existing future work is described in `petfeeder/AGENTS.md` and summarized in [Roadmap](Roadmap.md).
