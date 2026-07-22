# Roadmap

## Phase 1: Firmware Core (ESP32 + Servo + LED)

**Goal:** Working firmware with streaming, non-blocking servo, and status LED.

### 1.1 Security

- [ ] Create `secrets.h` with WiFi and Firebase credentials
- [ ] Add `secrets.h` to `.gitignore`
- [ ] Remove hard-coded credentials from `PetFeeder.ino`
- [ ] Rotate compromised Firebase credentials

### 1.2 Non-Blocking Servo

- [ ] Replace `delay()` with `millis()` state machine
- [ ] Implement IDLE → FEEDING → DONE states
- [ ] Add maximum feed time safety limit (30s)
- [ ] Verify servo stops even if Firebase write fails

### 1.3 Firebase Streaming

- [ ] Add second `FirebaseData stream` object
- [ ] Implement `beginStream` on `/commands/portion_size`
- [ ] Register `streamCallback` and `streamTimeoutCallback`
- [ ] Enable TCP KeepAlive: `stream.keepAlive(5, 5, 1)`
- [ ] Remove polling `delay(1000)` from `loop()`

### 1.4 Status LED

- [ ] Wire LED: GPIO 2 → 330Ω → LED → GND
- [ ] Implement LED state functions: `setLedGreen()`, `setLedYellow()`, `setLedRed()`
- [ ] Green = idle, Yellow = feeding, Red = error
- [ ] Blinking states for connection issues

### 1.5 Testing

- [ ] Flash firmware to ESP32
- [ ] Verify serial output shows streaming connection
- [ ] Test: write `portion_size = 2` from Firebase console → servo rotates
- [ ] Test: servo stops after correct duration
- [ ] Test: LED changes color during feed cycle
- [ ] Test: `totalFeeds` increments correctly
- [ ] Test: `last_feed_time` updates correctly
- [ ] Test: WiFi reconnection after disconnect

---

## Phase 2: App-Firebase Bridge

**Goal:** Expo app reads/writes Firebase, triggers real feeds.

### 2.1 Firebase SDK Setup

- [ ] Install `firebase` package in petfeeder/
- [ ] Create `petfeeder/lib/firebase.ts` with config
- [ ] Use environment variables for credentials
- [ ] Initialize Firebase app

### 2.2 Connect Feed Now

- [ ] Modify `feed-now.tsx` to write to Firebase
- [ ] On "Dispense Food" press: write `portion_size` to `/commands/portion_size`
- [ ] Add confirmation dialog before sending
- [ ] Show loading state while waiting for response
- [ ] Show success/failure after status update

### 2.3 Real-Time Dashboard

- [ ] Modify `index.tsx` to subscribe to `/status` paths
- [ ] Show live `from_esp` status (idle/feeding)
- [ ] Show `last_feed_time` from Firebase
- [ ] Show `totalFeeds` counter
- [ ] Animate "Feeding..." state while `from_esp == "feeding"`
- [ ] Show offline indicator if `lastSeenAt` > 30s old

### 2.4 Basic Auth

- [ ] Add Firebase Anonymous auth
- [ ] Update security rules for authenticated users
- [ ] Store feeder ID in local storage

### 2.5 Testing

- [ ] Run Expo app on phone/emulator
- [ ] Test: press Feed Now → ESP32 feeds
- [ ] Test: dashboard shows real-time status
- [ ] Test: app shows offline when ESP32 disconnects
- [ ] Test: app reconnects when ESP32 comes back

---

## Phase 3: Schedules and History

**Goal:** App manages schedules, stores feed history.

### 3.1 Schedule Management

- [ ] Create `/schedules/{feederId}` path in Firebase
- [ ] Add schedule CRUD operations in app
- [ ] Modify firmware to read schedules from Firebase
- [ ] Add schedule checking in firmware loop (compare current time)
- [ ] Test: create schedule → firmware feeds at scheduled time

### 3.2 Feed History

- [ ] Create `/history/{feederId}` path in Firebase
- [ ] ESP32 writes feed events to history
- [ ] App reads history and displays in History tab
- [ ] Replace mock history data

### 3.3 Testing

- [ ] Test: create breakfast schedule → feeds at 7:30 AM
- [ ] Test: disable schedule → no feed
- [ ] Test: history shows all feed events
- [ ] Test: history includes source (manual/scheduled)

---

## Future Improvements (v2)

### Hardware

- [ ] Add load cell (HX711) for weight-based portioning
- [ ] Add IR break-beam sensor for jam detection
- [ ] Add battery backup for power outage handling
- [ ] Add buzzer for audio alerts

### Firmware

- [ ] OTA firmware updates via WiFi
- [ ] Servo calibration stored in NVS
- [ ] Error reporting to Firebase
- [ ] Watchdog timer for auto-recovery

### App

- [ ] Push notifications (low food, device offline)
- [ ] Multi-feeder support
- [ ] Feeding analytics (daily/weekly charts)
- [ ] Pet weight tracking
- [ ] Vacation mode

---

## Nice-to-Have Features (v3)

- [ ] Camera (ESP32-CAM) for feed verification
- [ ] Voice assistant integration (Alexa/Google)
- [ ] Mobile app on Play Store
- [ ] Multi-pet recognition (RFID/camera)
- [ ] Food inventory tracking
- [ ] Automated food ordering

---

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| SG90 stalls on auger | Servo burnout | Add max feed time limit, current monitoring |
| Firebase stream disconnects | Commands lost | KeepAlive + auto-reconnect built-in |
| WiFi instability | Device offline | Add reconnection logic, AP fallback |
| Power outage | Missed feeds | Battery backup (v2) |
| Scope creep | Never finishes | Strict MVP, cut features ruthlessly |
| Credential leak | Security breach | Immediate rotation, .gitignore |

---

## Recommended Development Order

1. **Phase 1.1-1.2:** Security + non-blocking servo (firmware core)
2. **Phase 1.3-1.4:** Firebase streaming + LED
3. **Phase 1.5:** Firmware testing
4. **Phase 2.1-2.2:** Firebase SDK + Feed Now connection
5. **Phase 2.3-2.4:** Real-time dashboard + basic auth
6. **Phase 2.5:** App-firmware integration testing
7. **Phase 3.1-3.3:** Schedules and history
8. **Future:** Hardware expansion, advanced features

**Key principle:** Get a working end-to-end demo (app → Firebase → ESP32 → servo) before adding features.
