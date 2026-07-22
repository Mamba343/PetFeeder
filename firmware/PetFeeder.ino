// ============================================================
// PetFeeder.ino - Smart PetFeeder ESP32 Firmware
// ============================================================
// THIS is the file you open in Arduino IDE. Click "Upload" and
// ALL the other files in this folder are automatically compiled.
//
// REQUIRED LIBRARIES (install in Arduino IDE > Tools > Manage Libraries):
//   1. "Firebase ESP Client" by Mobizt
//   2. "ESP32Servo" by John K. Bennett
//
// REQUIRED FILES in this folder:
//   - Config.h          : Pin numbers and timing values
//   - Secrets.h         : Your WiFi + Firebase passwords
//   - TimeUtil.h        : Network time (NTP) functions
//   - LedManager.h      : Status LED control
//   - ServoManager.h    : Servo motor control (non-blocking)
//   - FirebaseManager.h : Firebase communication
//
// HARDWARE SETUP (firmware/ folder):
//   ESP32 GPIO 13  --->  SG90 Servo Signal (orange wire)
//   ESP32 5V      --->  SG90 Servo Power   (red wire)
//   ESP32 GND     --->  SG90 Servo Ground  (brown wire)
//   ESP32 GPIO 2  --->  330 ohm resistor   ---> LED anode (+)
//   LED cathode (-) --->  ESP32 GND
//
// NOTE: This file lives in the firmware/ folder because Windows
// cannot tell the difference between "PetFeeder" and "petfeeder"
// (the Expo app folder). Opening firmware/PetFeeder.ino in Arduino
// IDE works exactly the same - all files in the folder are compiled
// together automatically.
// ============================================================

// ---- STEP 0: Include ALL module files ----
// Each #include is like snapping a Lego brick into place.
// The Arduino IDE finds these files in the same folder automatically.
#include "Config.h"             // Pin definitions and constants
#include "Secrets.h"            // YOUR WiFi and Firebase credentials
#include "TimeUtil.h"           // Network time synchronization
#include "LedManager.h"         // Status LED (blink patterns)
#include "ServoManager.h"       // Servo motor (non-blocking state machine)
#include "FirebaseManager.h"    // Firebase streaming + status writes

// ------------------------------------------------------------
// setup() - Runs ONCE when the ESP32 powers on or resets
// ------------------------------------------------------------
// Think of this as the "morning routine". Every subsystem must
// be started in the correct order:
//   1. Serial  -> to see debug messages on your PC
//   2. WiFi    -> needed for internet access
//   3. NTP     -> get the current time from the internet
//   4. LED     -> visual feedback (blinks to show it's alive)
//   5. Servo   -> hardware motor (starts in STOP position)
//   6. Firebase -> open streaming connection for commands
void setup() {
    // ---- STEP 1: Start Serial Monitor ----
    // Open Arduino IDE > Tools > Serial Monitor (set 115200 baud).
    // This lets you see what the ESP32 is doing.
    Serial.begin(115200);
    delay(500);   // Short pause so the Serial Monitor can connect
    Serial.println();
    Serial.println("========================================");
    Serial.println("  Smart PetFeeder v1.0 - Starting up...");
    Serial.println("========================================");

    // ---- STEP 2: Connect to WiFi ----
    // The ESP32 needs internet access to reach Firebase.
    // You'll see dots (....) in Serial Monitor while it tries.
    // Check your Secrets.h file if connection fails.
    connectWiFi();

    // ---- STEP 3: Sync the clock from the internet ----
    // Uses NTP (Network Time Protocol) to get accurate timestamps
    // for the feeding history logs saved to Firebase.
    initTime();

    // ---- STEP 4: Initialize the status LED ----
    // It will blink 3 times to show the LED is working.
    initLed();

    // ---- STEP 5: Initialize the servo motor ----
    // The servo is set to STOP position (90 degrees) immediately,
    // so the auger does NOT spin when the device turns on.
    initServo();

    // ---- STEP 6: Connect to Firebase and start streaming ----
    // Opens a "stream" (always-on connection) to listen for
    // commands from the mobile app. The LED turns solid when
    // the connection succeeds.
    initFirebase();

    // ---- SETUP COMPLETE ----
    Serial.println("--- Setup complete! Waiting for commands... ---");
    Serial.println();
}

// ------------------------------------------------------------
// loop() - Runs FOREVER, over and over again
// ------------------------------------------------------------
// This is the heart of the firmware. Every iteration does:
//   1. Keep Firebase alive (refresh auth tokens)
//   2. Update the LED blink pattern
//   3. Check if the servo timer has expired
//   4. If feeding just finished -> save record to Firebase
//   5. If idle and command received -> start feeding
//
// The ENTIRE loop is non-blocking. There are NO delay() calls.
// (Except the ones for the LED blink, but those are inside initLed()
// which only runs once during setup.)
// This means the ESP32 is ALWAYS listening for new commands,
// ALWAYS updating the LED, and NEVER frozen during feeding.
void loop() {
    // ---- TASK 1: Keep Firebase alive ----
    // Firebase auth tokens expire over time. This function
    // refreshes them automatically. It also handles auto-
    // reconnection if the stream drops.
    // MUST be called every loop iteration.
    maintainFirebase();

    // ---- TASK 2: Update the LED pattern ----
    // Reads the currentPattern variable and sets the LED
    // pin HIGH/LOW accordingly. This runs every loop so the
    // blink timing works correctly. Uses millis() internally -
    // no blocking!
    updateLed();

    // ---- TASK 3: Update the servo state machine ----
    // If we are currently FEEDING, this checks whether the
    // feeding time has expired. If yes, it STOPS the servo
    // and sets state to STATE_DONE.
    // If we are not feeding, this function does nothing and
    // returns immediately. Either way: zero delay.
    updateServo();

    // ---- TASK 4: Save feed record if feeding just finished ----
    // When updateServo() finishes, it sets state to STATE_DONE.
    // Here in the main loop we detect that and:
    //   1. Write the timestamp to Firebase (last_feed_time)
    //   2. Increment the total feeds counter
    //   3. Reset the command back to 0
    //   4. Set status to "idle"
    // Then we go back to STATE_IDLE to wait for the next command.
    if (isDone()) {
        Serial.println("Saving feed record to Firebase...");
        writeFeedComplete();      // Save time + total + status to Firebase
        resetToIdle();            // Go back to idle state
        setLedPattern(LED_IDLE);  // Solid LED = ready for next command
        Serial.println("Device is ready for next command");
    }

    // ---- TASK 5: Check for new commands from the app ----
    // The streamCallback function (in FirebaseManager.h) sets
    // a flag when the mobile app writes to /commands/portion_size.
    // Here we check that flag AND make sure we're not already
    // feeding (isIdle() prevents interrupting a feed in progress).
    if (isIdle() && isCommandReceived()) {
        int portions = getCommandValue();   // How many portions?
        Serial.println("NEW COMMAND: Dispensing " + String(portions) + " portion(s)");

        setLedPattern(LED_FEEDING);         // Fast blink = feeding
        startFeeding(portions);             // Start the servo motor
        writeFeedStart();                   // Tell Firebase: "Feeding..."
    }

    // No delay() at the end! The loop runs as fast as possible.
    // All timing is handled by millis() inside the individual
    // module functions (updateLed, updateServo).
}

// ============================================================
// THAT'S IT! The entire firmware logic in ~110 lines of main
// code. Each module (Config, Secrets, Time, LED, Servo,
// Firebase) handles its own logic in separate .h files.
// ============================================================
