# Setup

## Prerequisites

For the app:

- Node.js and npm.
- Expo-compatible mobile device, simulator, emulator, or browser.

For firmware:

- Arduino IDE or compatible ESP32 build environment.
- ESP32 board support.
- Libraries: `Firebase_ESP_Client`, `ESP32Servo`.
- A servo connected to the configured pin.
- WiFi credentials and Firebase credentials supplied outside source control.

## Mobile App

```powershell
cd petfeeder
npm install
npm run start
```

Other scripts:

```powershell
npm run android
npm run ios
npm run web
npm run lint
```

Type checking is not currently exposed as an npm script. Run it directly:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
```

## Expo Configuration

`petfeeder/app.json` defines:

- App name: `Smart PetFeeder`.
- Slug: `petfeeder`.
- URL scheme: `petfeeder`.
- Portrait orientation.
- Automatic light/dark user interface style.
- Expo Router plugin.
- Splash screen image and colors.
- Typed routes and React Compiler experiments.
- Static web output.

## Configuration Files

- `.gitattributes` - enables automatic text line-ending normalization.
- `petfeeder/package.json` - npm scripts and app dependencies.
- `petfeeder/package-lock.json` - locked dependency versions.
- `petfeeder/app.json` - Expo runtime, platform, icon, splash, plugin, and experiment settings.
- `petfeeder/tsconfig.json` - extends Expo TypeScript defaults, enables `strict`, and defines the `@/*` path alias.
- `petfeeder/eslint.config.js` - Expo ESLint configuration.
- `petfeeder/AGENTS.md` - app-specific AI agent guidance and planned Firebase schema notes.
- `petfeeder/CLAUDE.md` - pointer to the nested agent guide.

## Key Dependencies

Runtime app dependencies include Expo SDK 54, React 19, React Native 0.81, Expo Router, React Navigation bottom tabs, Expo Haptics, Expo Image, Expo Symbols, Expo Web Browser, React Native Reanimated, and `@expo/vector-icons`.

Development dependencies include TypeScript and ESLint with Expo's ESLint config.

Firmware dependencies include ESP32 WiFi support, `Firebase_ESP_Client`, `ESP32Servo`, and the Arduino `time.h` NTP APIs.

## Firmware

The firmware sketches are at the repository root:

- `PetFeeder.ino`
- `PetFeeder (1).ino`

Both sketches contain hard-coded credentials today. Before flashing a real device, move credentials to a local-only configuration mechanism and rotate any values that were committed.

The current firmware expects:

- ESP32 WiFi support.
- Firebase Realtime Database credentials.
- Servo attached to GPIO 13.
- NTP access to `pool.ntp.org`.

## Build and Deployment

No production app build pipeline is present. Use Expo commands for development builds until an EAS or native deployment flow is added.

No firmware deployment automation is present. Flash manually through Arduino tooling after credentials and board settings are configured.
