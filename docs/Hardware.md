# Hardware

## Current Hardware Evidence

The repository includes ESP32 firmware and 3D printing test files. No wiring diagram, bill of materials, sensor list, or assembly guide is currently present.

## Firmware Target

The sketches imply:

- ESP32 microcontroller.
- WiFi network connection.
- Servo controlled through `ESP32Servo`.
- Servo signal pin on GPIO 13.
- Firebase RTDB as the command/status transport.
- NTP time from `pool.ntp.org`.

## Dispensing Logic

The firmware defines:

- Stop position: servo write `90`.
- Rotate position: servo write `0`.
- Base feed time: `2000` milliseconds per portion.
- Feed duration: `portions * BASE_FEED_TIME`.

This is time-based dispensing, not weight-based dispensing.

## Mechanical Assets

`Printing Files/TESTING/` contains:

- `Petfeeder Auger Test1.3mf`
- `Petfeeder auger test 3.3mf`
- `Petfeeder auger test2.3mf`

The filenames suggest auger testing, but there are no documented print settings, material recommendations, or fit notes.

## Missing Hardware Documentation

- Board model.
- Servo model and power requirements.
- Wiring diagram.
- Feeder mechanism description.
- Food sensor, battery sensor, or signal-strength hardware details.
- Calibration process.
- Safety limits for motor runtime.
- Jam detection or recovery behavior.

