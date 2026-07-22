# Design Decisions

## Current Decisions

### App Decisions

- Use Expo SDK 54 for the mobile app.
- Use Expo Router for file-based routing.
- Use bottom tabs as the primary navigation model.
- Use TypeScript strict mode.
- Keep app data mock-only until a backend integration is explicitly added.
- Centralize mock feeder data in `petfeeder/data/mock-data.ts`.
- Use local screen state for temporary interactions such as selected portion and schedule toggles.
- Use `@expo/vector-icons` MaterialCommunityIcons for the current app UI.

### Firmware Decisions

- Use Firebase Realtime Database in firmware sketches.
- Use **Firebase streaming** (not polling) for command reception.
- Use a **non-blocking state machine** for servo control (not `delay()`).
- Use a **status LED** for local visual feedback.
- Use `secrets.h` for credentials (not committed to Git).
- Use NTP time from `pool.ntp.org` for timestamps.
- Use time-based dispensing (servo rotation duration) not weight-based.

### Hardware Decisions

- Use **ESP32 AI Thinker** as the microcontroller.
- Use **SG90 micro servo** for auger rotation.
- Use **GPIO 13** for servo signal.
- Use **GPIO 2** for status LED.
- Use **330 ohm resistor** for LED current limiting.

## Important Consequences

- App behavior is easy to preview without backend setup.
- Firmware can operate independently of the app if Firebase paths are written externally.
- Streaming reduces latency and WiFi traffic compared to polling.
- Non-blocking servo allows the firmware to respond to commands during feeding.
- Status LED provides immediate local feedback without checking the app.
- Credentials are separated from source code, reducing security risk.

## Alternatives Considered

### Streaming vs Polling

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Polling every 1s | Simple, reliable | Latency, WiFi waste | Rejected |
| Streaming (SSE) | Low latency, event-driven | More complex setup | **Selected** |
| MQTT | Lightweight, bidirectional | Requires broker | Deferred |
| WebSocket | Full duplex | More complex | Deferred |

### Non-Blocking vs Blocking Servo

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| `delay()` blocking | Simple code | Blocks everything during feed | Rejected |
| `millis()` state machine | Non-blocking, responsive | More complex | **Selected** |
| FreeRTOS tasks | True multitasking | Overkill for this | Deferred |

### LED Status vs No LED

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| No LED | Simpler | No local feedback | Rejected |
| Single LED (color) | Simple, clear status | Limited states | **Selected** |
| RGB LED | More colors | More wiring | Deferred |
| OLED display | Rich info | More complexity | Deferred (v3) |

### Credential Management

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Hard-coded in .ino | Simple | Security risk | Rejected |
| `secrets.h` (gitignored) | Simple, secure | Requires manual setup | **Selected** |
| Environment variables | Best practice | Arduino IDE doesn't support | Deferred |
| NVS (Preferences) | Runtime configurable | More complex | Deferred |

## Deferred Decisions

- MQTT or HTTP device API.
- Cloud Functions as a command mediator.
- Bluetooth pairing.
- Local persistent app storage.
- A typed app service layer.
- Automated test suite.
- Weight-based portioning (load cell).
- Multi-user ownership.
- Multi-feeder support.

## Assumptions

- Firebase RTDB remains the intended backend because it is already used in firmware and described in the agent guide.
- The current app visual style is intentionally quiet and utilitarian for an IoT control panel.
- Single-device, single-user is the MVP. Multi-user/multi-feeder can be added later.
- Time-based dispensing is acceptable for initial prototype. Weight-based is a v2 improvement.
- The SG90 servo has sufficient torque for the auger mechanism. If not, upgrade to MG90S.
