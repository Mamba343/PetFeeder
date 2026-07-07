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
6. Avoid adding Firebase packages until integration is explicitly requested.

## Verification

Run from `petfeeder/`:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\eslint.cmd .
```

For app startup:

```powershell
npm run start
```

## Documentation Updates

When changing behavior, update the relevant docs:

- App architecture or data flow: [Architecture](Architecture.md)
- Firebase paths or schemas: [API](API.md) and [Database](Database.md)
- Device behavior: [Hardware](Hardware.md)
- Setup commands: [Setup](Setup.md)
- Gaps or bugs: [Known Issues](KnownIssues.md)
- Future work: [Roadmap](Roadmap.md)

## Technical Debt

- Hard-coded secrets in firmware.
- Duplicate firmware sketches.
- No tests.
- No real app data layer.
- No shared contract between app and firmware.
- Starter components and assets remain unused.
- Development log and unclassified text files are checked in.

