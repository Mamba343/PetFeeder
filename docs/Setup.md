# Setup

## Prerequisites

For the app:

- Node.js and npm.
- Expo-compatible mobile device, simulator, emulator, or browser.

For firmware:

- Arduino IDE or compatible ESP32 build environment.
- ESP32 board support.
- Libraries: `Firebase_ESP_Client`, `ESP32Servo`.
- A servo connected to GPIO 13.
- An LED connected to GPIO 2 (through 330 ohm resistor).
- WiFi credentials and Firebase credentials in `secrets.h`.

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

## Firmware Setup

### 1. Create secrets.h

Create a file called `secrets.h` in the same directory as `PetFeeder.ino`:

```cpp
// secrets.h - DO NOT COMMIT TO GIT
#ifndef SECRETS_H
#define SECRETS_H

// WiFi credentials
#define WIFI_SSID "YourWiFiName"
#define WIFI_PASSWORD "YourWiFiPassword"

// Firebase credentials
#define API_KEY "YourFirebaseAPIKey"
#define DATABASE_URL "https://your-project.firebaseio.com/"
#define USER_EMAIL "device@feeder.com"
#define USER_PASSWORD "device_password"

#endif
```

### 2. Add secrets.h to .gitignore

Add this line to the root `.gitignore`:

```
secrets.h
```

### 3. Install Arduino Libraries

In Arduino IDE, go to Sketch > Include Library > Manage Libraries:

- Search for `Firebase ESP Client` and install
- Search for `ESP32Servo` and install

### 4. Wire the Hardware

See [Hardware](Hardware.md) for the full wiring diagram.

Basic wiring:

- Servo signal (orange) → GPIO 13
- Servo VCC (red) → 5V
- Servo GND (brown) → GND
- LED anode (+) → 330Ω resistor → GPIO 2
- LED cathode (-) → GND

### 5. Flash the Firmware

1. Open `PetFeeder.ino` in Arduino IDE
2. Select board: Tools > Board > ESP32 Arduino > AI Thinker ESP32
3. Select port: Tools > Port
4. Click Upload

### 6. Test

1. Open Serial Monitor at 115200 baud
2. Verify WiFi connection
3. Verify Firebase streaming connection
4. Write `portion_size = 2` from Firebase console
5. Verify servo rotates and LED changes color

## Build and Deployment

No production app build pipeline is present. Use Expo commands for development builds until an EAS or native deployment flow is added.

No firmware deployment automation is present. Flash manually through Arduino tooling after credentials and board settings are configured.
