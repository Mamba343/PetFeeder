# Smart PetFeeder

Smart PetFeeder is a repository for an IoT pet-feeding project. It currently contains:

- A React Native Expo app prototype in `petfeeder/`.
- ESP32 Arduino firmware sketches at the repository root.
- 3D printing test files in `Printing Files/`.

The mobile app is currently mock-only. The firmware sketches connect directly to Firebase Realtime Database and drive a servo, but the app does not yet read or write that live Firebase data.

## Start Here

- [AGENTS.md](AGENTS.md) - operating guide for future AI coding agents.
- [Architecture](docs/Architecture.md) - system shape and data flow.
- [Current Status](docs/CurrentStatus.md) - what works now and what is incomplete.
- [Setup](docs/Setup.md) - local development and firmware setup notes.
- [Development Guide](docs/DevelopmentGuide.md) - coding conventions and verification.

## Quick App Setup

```powershell
cd petfeeder
npm install
npm run start
```

## Documentation Index

- [Folder Structure](docs/FolderStructure.md)
- [Design Decisions](docs/DesignDecisions.md)
- [Roadmap](docs/Roadmap.md)
- [Known Issues](docs/KnownIssues.md)
- [API](docs/API.md)
- [Database](docs/Database.md)
- [Hardware](docs/Hardware.md)

