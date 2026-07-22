# Smart PetFeeder - ESP32 Firmware

Controls an SG90 servo to dispense pet food on demand via Firebase Realtime Database. Uses streaming (not polling) for instant command reception.

## Folder Structure

```
firmware/
├── PetFeeder.ino        # Main file - open this in Arduino IDE
├── Config.h             # GPIO pins, timing, NTP, Firebase paths
├── Secrets.h            # YOUR WiFi + Firebase credentials (gitignored)
├── TimeUtil.h           # NTP time sync for feed timestamps
├── LedManager.h         # Status LED - solid/fast blink/slow blink
├── ServoManager.h       # Non-blocking servo state machine
└── FirebaseManager.h    # Firebase streaming + status writes
```

- **PetFeeder.ino** is the entry point. Opening it in Arduino IDE shows all files as tabs.
- **All .h files** compile automatically together when you click Upload. No manual adding needed.
- **Secrets.h** is in `.gitignore`. It stays on your computer and never gets committed.

## Required Libraries

Install these in Arduino IDE: **Tools → Manage Libraries**

| Library | Author | Search Term |
| --- | --- | --- |
| Firebase ESP Client | mobizt | `Firebase ESP Client` |
| ESP32Servo | John K. Bennett | `ESP32Servo` |

To install:
1. Open Arduino IDE
2. Go to **Tools → Manage Libraries** (or Ctrl+Shift+I)
3. Search for each library name
4. Click **Install**

## Board Settings

Before uploading, configure Arduino IDE for the AI Thinker ESP32:

1. **Install ESP32 board support** (if not already done):
   - File → Preferences → "Additional Boards Manager URLs"
   - Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Tools → Board → Boards Manager → search "ESP32" → Install

2. **Select the correct board:**
   - **Tools → Board → ESP32 Arduino → AI Thinker ESP32**

3. **Select the COM port:**
   - **Tools → Port → COMx** (check Windows Device Manager if unsure)

4. **Other settings (defaults are fine):**
   - Flash Size: 4MB
   - Partition Scheme: Default
   - Upload Speed: 921600

## Pin Mapping

| ESP32 GPIO | Connected To | Wire Color / Notes |
| --- | --- | --- |
| GPIO 13 | SG90 Servo Signal | Orange wire |
| 5V pin | SG90 Servo VCC | Red wire (do NOT use 3.3V) |
| GND | SG90 Servo Ground | Brown wire |
| GPIO 2 | Status LED Anode (+) | Through 330 ohm resistor |
| GND | Status LED Cathode (-) | Direct connection |

### Wiring Diagram

```
ESP32 AI Thinker                  SG90 Micro Servo
┌─────────────┐                  ┌──────────────┐
│ GPIO 13 ────┼──────────────────► Orange (SIG) │
│             │                  │              │
│ 5V     ─────┼──────────────────► Red    (VCC) │
│             │                  │              │
│ GND    ─────┼──────────────────► Brown (GND)  │
│             │                  └──────────────┘
│ GPIO 2 ────┼─── 330Ω ──► LED(+)  LED(-) ──► GND
│             │
└─────────────┘
```

**Important:** The SG90 runs on 5V. The ESP32 5V pin provides enough current for one servo. Do NOT power the servo from 3.3V.

## How to Compile

1. Open `firmware/PetFeeder.ino` in Arduino IDE
2. Arduino IDE will show all 7 files as tabs automatically
3. Click the **✓ (Verify)** button to compile without uploading
4. Watch the console at the bottom for any errors

If compilation fails:
- Double-check that both required libraries are installed
- Make sure **AI Thinker ESP32** board is selected
- Check the console for specific error messages

## How to Flash

### First-time setup:

1. **Edit `Secrets.h`** with your actual credentials:
   - WiFi name and password (2.4GHz only - ESP32 doesn't support 5GHz)
   - Firebase API key and database URL
   - Firebase user email and password

2. Plug the ESP32 into your computer via USB

3. Select the correct **Port** in Arduino IDE (Tools → Port)

4. Hold the **BOOT** button on the ESP32 (if auto-reset doesn't work)

5. Click **→ (Upload)** button

6. Watch the console for "Done uploading" message

### After flashing:

1. Open **Tools → Serial Monitor** (set baud rate to **115200**)
2. You should see startup messages:
   - `WiFi connected! IP address: 192.168.x.x`
   - `Firebase streaming on /commands/portion_size`
   - `Setup complete! Waiting for commands...`
3. The LED will turn solid once Firebase is connected

### Testing without the app:

Write to Firebase directly from the Firebase Console:
1. Go to your Firebase project → Realtime Database
2. Navigate to `/commands/portion_size`
3. Set the value to `2`
4. The ESP32 should receive it instantly and start feeding

## LED Status Reference

| Pattern | Meaning |
| --- | --- |
| **Solid ON** | Idle, connected to Firebase, waiting for commands |
| **Fast blink** (100ms) | Feeding in progress |
| **Slow blink** (500ms) | Error: WiFi or Firebase connection failed |
| **3 quick blinks** | Power-on self-test (occurs once on startup) |

## Firebase Database Schema

The device reads and writes these paths:

| Path | Type | Description |
| --- | --- | --- |
| `/commands/portion_size` | int | App writes N here → ESP32 feeds N portions |
| `/status/from_esp` | string | `"idle"` or `"feeding"` |
| `/status/last_feed_time` | string | Timestamp of last feed: `YYYY-MM-DD HH:mm:ss` |
| `/status/totalFeeds` | int | Running total of portions dispensed |

## Troubleshooting

| Problem | Likely Cause | Fix |
| --- | --- | --- |
| "Connecting..._____" forever | Wrong WiFi credentials | Check Secrets.h, ensure 2.4GHz network |
| Firebase stream error | Wrong API key or URL | Check Firebase Console → Project Settings |
| Servo doesn't move | Wrong GPIO or power | Check SERVO_PIN in Config.h, ensure 5V power |
| LED stays off | Wrong pin or wiring | Check LED_PIN in Config.h, check resistor |
| Board not detected | Missing driver | Install CP210x or CH340 USB driver for ESP32 |
| Upload fails | Wrong board selected | Select "AI Thinker ESP32" in Board menu |

## Adjusting Portion Size

The default calibration is **2000ms per portion** (~25-30g). To change:

1. Open `Config.h`
2. Change `BASE_FEED_TIME 2000` to your desired milliseconds
3. Re-flash the firmware

The safety limit (`MAX_FEED_TIME = 30000`) prevents the servo from running longer than 30 seconds in case of a jam.
