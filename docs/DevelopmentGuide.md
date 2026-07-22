# Development Guide

## Coding Conventions Already Used

- TypeScript with `strict` mode.
- Functional React components.
- React hooks for local UI state.
- Expo Router for navigation.
- Absolute imports through the `@/*` path alias.
- React Native `StyleSheet.create` per component.
- Reusable UI components for repeated layout and card patterns.
- MaterialCommunityIcons for app-specific icons.
- Light/dark theme values centralized in `constants/theme.ts`.

## App Development Flow

1. Work inside `petfeeder/` for mobile app changes.
2. Keep screens in `app/(tabs)/`.
3. Put reusable UI in `components/`.
4. Keep mock data in `data/mock-data.ts` until a real data layer is requested.
5. Prefer local component state for temporary interactions.
6. Firebase integration will be added in Phase 2 under `lib/firebase.ts`.

## Firmware Development Flow

1. Work in the root directory for firmware changes.
2. Keep credentials in `secrets.h` (not committed).
3. Use the non-blocking state machine pattern for servo control.
4. Use Firebase streaming, not polling.
5. Test on hardware after every major change.

### Firmware Architecture Pattern

```cpp
// State machine
enum FeederState { IDLE, FEEDING, DONE };

// Global state
FeederState feederState = IDLE;
unsigned long feedStartTime = 0;
bool commandReceived = false;
int pendingPortions = 0;

void setup() {
    // WiFi, Firebase streaming, servo, LED setup
}

void loop() {
    Firebase.ready();
    
    if (commandReceived) {
        commandReceived = false;
        startFeeding(pendingPortions);
    }
    
    updateFeeder(); // non-blocking state machine
}
```

### Firmware Testing Sequence

1. Flash firmware to ESP32
2. Open Serial Monitor (115200 baud)
3. Verify WiFi connection
4. Verify Firebase streaming connection
5. Write `portion_size = 2` from Firebase console
6. Verify servo rotates
7. Verify LED changes color (yellow → green)
8. Verify `totalFeeds` increments
9. Verify `last_feed_time` updates
10. Test WiFi disconnect/reconnect

## App Development Testing

1. Run `npm run start` in `petfeeder/`
2. Open on phone or emulator
3. Verify Dashboard loads
4. Test Feed Now button (after Phase 2)
5. Verify real-time status updates

## Verification

### App Changes

Run from `petfeeder/`:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\eslint.cmd .
```

For app startup:

```powershell
npm run start
```

### Firmware Changes

1. Compile in Arduino IDE (no errors)
2. Flash to ESP32
3. Test on hardware (see Firmware Testing Sequence above)

## Documentation Updates

When changing behavior, update the relevant docs:

- App architecture or data flow: [Architecture](Architecture.md)
- Firebase paths or schemas: [API](API.md) and [Database](Database.md)
- Device behavior: [Hardware](Hardware.md)
- Setup commands: [Setup](Setup.md)
- Gaps or bugs: [Known Issues](KnownIssues.md)
- Future work: [Roadmap](Roadmap.md)
- New decisions: [Design Decisions](DesignDecisions.md)

## Technical Debt

- Hard-coded secrets in firmware (fix: Phase 1.1).
- Duplicate firmware sketches (fix: consolidate to one).
- No tests (deferred).
- Starter components and assets remain unused.
- Development log and unclassified text files are checked in.
