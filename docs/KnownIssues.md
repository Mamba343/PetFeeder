# Known Issues

## Security

- Firmware sketches contain hard-coded WiFi credentials, Firebase API key, Firebase database URL, and Firebase user credentials.
- Treat all committed credentials as compromised and rotate them.
- No Firebase security rules are documented in this repository.

## App and Firmware Integration

- App uses mock data only.
- Firmware uses live Firebase RTDB paths.
- App planned schema and firmware implemented schema do not match.
- Feed actions in the app do not reach the device.
- Firmware has no app-visible command acknowledgement model beyond status fields.

## App Completeness

- No authentication.
- No persistent storage.
- No backend service layer.
- No automated tests.
- No loading, empty, offline, or error states.
- The Schedule screen's "Add mock schedule" button has no action.
- Some Expo starter components and assets remain even though current PetFeeder screens do not use them.
- `petfeeder/README.md` was originally a starter readme and has been replaced with a project pointer.

## Firmware Robustness

- Polls Firebase every second without backoff.
- Uses blocking `delay()` while dispensing.
- No explicit handling for Firebase read/write failures.
- No jam detection, motor fault detection, or low-food sensor integration.
- Portion size maps directly to time, not measured grams.

## Repository Hygiene

- Root text files `ali.txt` and `kjahdskahs.txt` have no documented purpose.
- `petfeeder/expo-dev.log` appears to be a development artifact.
- Duplicate firmware sketches differ mainly by WiFi SSID.

## TODOs Found in Code

No `TODO` or `FIXME` markers were found in the app or firmware source. Existing future work is described in `petfeeder/AGENTS.md` and summarized in [Roadmap](Roadmap.md).

