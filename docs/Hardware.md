# Hardware

## Bill of Materials

| Component | Model | Qty | Purpose |
| --- | --- | --- | --- |
| Microcontroller | AI Thinker ESP32 | 1 | Main controller, WiFi, Firebase |
| Servo | SG90 (9g micro servo) | 1 | Auger rotation for food dispensing |
| LED | 5mm diffused LED (any color) | 1 | Status indicator |
| Resistor | 330 ohm (1/4W) | 1 | Current limiter for LED |
| Breadboard | Half-size (400 tie points) | 1 | Prototyping |
| Jumper wires | Male-to-male | ~10 | Connections |
| USB cable | Micro-USB or USB-C | 1 | ESP32 power and flashing |

## GPIO Pin Assignments

| GPIO | Function | Component | Notes |
| --- | --- | --- | --- |
| 13 | PWM output | SG90 Servo signal | Already implemented in firmware |
| 2 | Digital output | Status LED | Active HIGH, through 330 ohm resistor |
| 21 | I2C SDA | Reserved | Future OLED display |
| 22 | I2C SCL | Reserved | Future OLED display |

## Wiring Diagram

```
ESP32 AI Thinker
┌─────────────────────────────┐
│                             │
│  GPIO 13 ──────────────────┼──► SG90 Signal (Orange wire)
│  5V       ─────────────────┼──► SG90 VCC (Red wire)
│  GND      ─────────────────┼──► SG90 GND (Brown wire)
│                             │
│  GPIO 2  ──────────────────┼──► 330 ohm resistor ──► LED (+) ──► GND
│                             │
│  5V or 3.3V ───────────────┼──► (Future: OLED VCC)
│  GPIO 21 (SDA) ───────────┼──► (Future: OLED SDA)
│  GPIO 22 (SCL) ───────────┼──► (Future: OLED SCL)
│                             │
└─────────────────────────────┘
```

### Servo Wiring Detail

SG90 servo has a 3-pin connector:

| Wire Color | Function | Connect To |
| --- | --- | --- |
| Orange | Signal (PWM) | ESP32 GPIO 13 |
| Red | VCC (4.8-6V) | ESP32 5V pin |
| Brown | GND | ESP32 GND |

**Note:** The SG90 runs on 5V. The ESP32 5V pin provides enough current for the servo. Do NOT power the servo from 3.3V - it will not have enough torque.

### LED Wiring Detail

```
GPIO 2 ──── 330 ohm ──── LED Anode (+) ──── LED Cathode (-) ──── GND
```

- Use any standard 5mm LED
- 330 ohm resistor limits current to ~10mA (safe for ESP32 GPIO)
- LED colors: Green (idle), Yellow (feeding), Red (error) - or use a single RGB LED

## Dispensing Logic

The firmware controls the SG90 servo:

- **Stop position:** Servo write `90` (center pulse width)
- **Rotate position:** Servo write `0` (full counter-clockwise)
- **Base feed time:** `2000` milliseconds per portion
- **Feed duration:** `portions * BASE_FEED_TIME`

This is time-based dispensing, not weight-based. The auger rotates for a fixed duration proportional to the number of portions requested.

**Future improvement:** Add a load cell (HX711 + strain gauge) for weight-based portioning.

## Status LED Behavior

| LED State | Meaning |
| --- | --- |
| Solid GREEN | Online, idle, connected to Firebase |
| Solid YELLOW | Feeding in progress |
| Solid RED | Error (WiFi disconnected, Firebase failed) |
| Blinking GREEN | Connecting to WiFi |
| Blinking RED | WiFi connection failed, retrying |

## Safety Considerations

- The SG90 has a stall torque of ~1.2 kg/cm. If the auger jams, the servo may stall and draw excess current.
- Add a maximum feed time limit in firmware (e.g., 30 seconds) to prevent motor burnout.
- The ESP32 5V pin can source ~500mA. A single SG90 draws ~100-250mA under load, which is within limits.
- Do not run the servo continuously for more than 30 seconds without a pause.

## Mechanical Assets

`Printing Files/TESTING/` contains:

- `Petfeeder Auger Test1.3mf`
- `Petfeeder auger test 3.3mf`
- `Petfeeder auger test2.3mf`

The filenames suggest auger testing, but there are no documented print settings, material recommendations, or fit notes.

## Missing Hardware Documentation (Future)

- Load cell for weight-based portioning (v2)
- IR break-beam sensor for jam detection (v2)
- Battery backup for power outage handling (v2)
- OLED display for local status (v3)
