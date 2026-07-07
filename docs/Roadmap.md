# Roadmap

This roadmap is based on existing code, existing agent notes, and current gaps. It does not describe completed features.

## Near Term

- Remove or rotate hard-coded WiFi and Firebase credentials from firmware.
- Decide whether the Firebase schema should follow the existing firmware paths or the planned app schema in `petfeeder/AGENTS.md`.
- Connect the app to read live feeder status.
- Implement app-side feed commands only after the device command contract is agreed.
- Add loading, empty, offline, and error states to app screens.
- Replace mock schedule/history/settings data with a real data layer.

## Device Integration

- Add a documented firmware-to-database contract.
- Add command acknowledgement and error states for failed dispensing.
- Add calibration for grams-per-portion or grams-per-second.
- Add jam detection or motor fault reporting if supported by hardware.
- Add heartbeat or `lastSeenAt` status.

## App Product Improvements

- Add authentication.
- Add feeder pairing.
- Add editable schedule creation.
- Add persistent settings.
- Add low-food and missed-meal alerts.
- Add accessibility labels for all controls.
- Add tablet/responsive layout checks.

## Documentation Improvements

- Add firmware flashing steps after hardware details are confirmed.
- Add real Firebase security rules once a schema is chosen.
- Add screenshots or screen recordings for the app.
- Add 3D print parameters for the `.3mf` files.

