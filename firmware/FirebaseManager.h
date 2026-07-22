// ============================================================
// FirebaseManager.h - Firebase Realtime Database communication
// ============================================================
// This module handles ALL communication between the ESP32 and
// Google Firebase Realtime Database (RTDB).
//
// How it works:
//   1. The ESP32 connects to your home WiFi.
//   2. It opens a "stream" (a permanent internet connection)
//      to the path "/commands/portion_size" in Firebase.
//   3. When the app writes a number to that path (e.g., 2 portions),
//      Firebase PUSHES the change to the ESP32 instantly.
//      This is called "streaming" - no polling needed!
//   4. The ESP32 responds by writing status updates back to Firebase.
//
// Why streaming instead of polling?
//   Polling = ask "any commands?" every 1 second = wasteful.
//   Streaming = Firebase tells us immediately when something changes.
// ============================================================

#ifndef FIREBASE_MANAGER_H
#define FIREBASE_MANAGER_H

#include <WiFi.h>                       // Built-in ESP32 WiFi library
#include <Firebase_ESP_Client.h>        // Arduino library for Firebase

// ---- FIREBASE OBJECTS ----
// We need TWO separate FirebaseData objects because:
//   - One is dedicated to the STREAM (listening for commands)
//   - The other is for regular READ/WRITE (sending status updates)
// They cannot share a single connection.
FirebaseData stream;    // For listening to commands
FirebaseData fbdo;      // For reading/writing status
FirebaseAuth auth;      // Authentication credentials
FirebaseConfig config;  // Connection configuration

// ---- COMMAND FLAGS ----
// These are set by the stream callback and read by the main loop.
// "volatile" tells the compiler "this variable can change at any
// time" (because it changes inside a callback, not inside loop()).
volatile bool commandReceived = false;   // True when a new command arrives
volatile int commandPortions = 0;       // How many portions to feed

// ------------------------------------------------------------
// connectWiFi() - Connect to your home WiFi
// ------------------------------------------------------------
// Tries to connect for up to 20 seconds (40 attempts x 500ms delay).
// In the Serial Monitor you will see dots (....) as it tries.
// If it fails, check your WIFI_SSID and WIFI_PASSWORD in Secrets.h.
void connectWiFi() {
    Serial.print("Connecting to WiFi");
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);   // Start WiFi with your credentials

    // Try for 20 seconds (40 attempts x 500ms)
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 40) {
        Serial.print(".");
        delay(500);
        attempts++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println();
        Serial.println("WiFi connected! IP address: " + WiFi.localIP().toString());
    } else {
        Serial.println();
        Serial.println("ERROR: WiFi connection failed! Check your WiFi credentials in Secrets.h");
        setLedPattern(LED_ERROR);   // Show error on the status LED
    }
}

// ------------------------------------------------------------
// streamCallback(data) - Called when Firebase sends us a command
// ------------------------------------------------------------
// This function runs AUTOMATICALLY when the Firebase stream
// detects a change at "/commands/portion_size".
//
// It reads the new value and sets the commandReceived flag.
// The main loop (in PetFeeder.ino) checks this flag and starts feeding.
//
// Key detail: This runs in a "callback context" - keep it fast!
// No delays or long Serial prints inside callback functions.
void streamCallback(FirebaseStream data) {
    // "put" and "patch" are Firebase events for new/changed data.
    // Ignore "keep-alive" events which are just connection checks.
    if (data.eventType() == "put" || data.eventType() == "patch") {
        if (data.dataType() == "int") {
            int val = data.intData();       // The new portion_size value
            if (val > 0) {                  // Only react to positive values
                commandPortions = val;       // Save how many portions to feed
                commandReceived = true;     // Tell the main loop to start feeding
                Serial.println("COMMAND RECEIVED: " + String(val) + " portion(s) from Firebase");
            }
        }
    }
}

// ------------------------------------------------------------
// streamTimeoutCallback(timeout) - Called if the stream disconnects
// ------------------------------------------------------------
// If the internet connection drops, this lets us know.
// The Firebase library will automatically try to reconnect.
void streamTimeoutCallback(bool timeout) {
    if (timeout) {
        Serial.println("Firebase stream timed out - will auto-reconnect");
        setLedPattern(LED_ERROR);   // Show error until reconnected
    }
}

// ------------------------------------------------------------
// initFirebase() - Set up Firebase connection and start streaming
// ------------------------------------------------------------
// Call once in setup() after WiFi is connected.
// This:
//   1. Configures Firebase with your API key and database URL
//   2. Authenticates using the email/password credentials
//   3. Opens a stream on "/commands/portion_size" so we
//      instantly receive commands from the app
//   4. Sets up TCP keepalive to prevent the connection from
//      being dropped by your home router
void initFirebase() {
    config.api_key = API_KEY;               // From Secrets.h
    config.database_url = DATABASE_URL;     // From Secrets.h

    auth.user.email = USER_EMAIL;           // From Secrets.h
    auth.user.password = USER_PASSWORD;     // From Secrets.h

    Firebase.begin(&config, &auth);          // Start Firebase
    Firebase.reconnectWiFi(true);            // Auto-reconnect WiFi if it drops

    // Set buffer sizes for secure (SSL) connections
    // Larger buffers prevent parsing errors with big payloads
    fbdo.setBSSLBufferSize(4096, 1024);      // 4KB receive, 1KB transmit

    // Open a stream on the command path
    if (Firebase.RTDB.beginStream(&stream, PATH_COMMAND)) {
        // Register our callback functions
        Firebase.RTDB.setStreamCallback(&stream, streamCallback, streamTimeoutCallback);

        // TCP Keepalive: sends a tiny packet every 5 seconds to keep
        // the connection alive. Without this, some routers drop idle
        // connections after 30-60 seconds.
        stream.keepAlive(5, 5, 1);           // 5s idle, 5s interval, 1 retry

        Serial.println("Firebase streaming on " + String(PATH_COMMAND));
        setLedPattern(LED_IDLE);            // LED solid = connected
    } else {
        Serial.println("ERROR: Could not start Firebase stream!");
        Serial.println("  Reason: " + stream.errorReason());
        setLedPattern(LED_ERROR);
    }
}

// ------------------------------------------------------------
// maintainFirebase() - Must be called every loop()
// ------------------------------------------------------------
// This function handles:
//   - Token refresh (Firebase auth tokens expire periodically)
//   - Auto-reconnection if the stream drops
// If you forget to call this, Firebase will stop working after ~1 hour.
void maintainFirebase() {
    Firebase.ready();   // Handle token refresh and reconnection
}

// ------------------------------------------------------------
// Command checker helpers - used by the main loop
// ------------------------------------------------------------
bool isCommandReceived() {
    return commandReceived;
}

int getCommandValue() {
    commandReceived = false;        // Reset the flag
    return commandPortions;
}

void clearCommand() {
    commandPortions = 0;
}

// ------------------------------------------------------------
// writeFeedStart() - Tell Firebase "device is now feeding"
// ------------------------------------------------------------
// Immediately updates Firebase so the app can show "Feeding..."
// status to the user.
void writeFeedStart() {
    Firebase.RTDB.setString(&fbdo, PATH_STATUS_ESP, "feeding");
    Serial.println("Status sent: feeding");
}

// ------------------------------------------------------------
// writeFeedComplete() - Save the feed record to Firebase
// ------------------------------------------------------------
// Called AFTER the servo stops. Writes:
//   1. Last feed timestamp (e.g., "2026-07-07 14:30:00")
//   2. Increment the total feed counter
//   3. Reset the command back to 0
//   4. Set status to "idle"
//
// Together, these updates make the app show accurate info.
void writeFeedComplete() {
    // 1. Save the current time as the last feed time
    Firebase.RTDB.setString(&fbdo, PATH_LAST_FEED, getFormattedTime());

    // 2. Read the current total, add our portions, write it back
    int total = 0;
    if (Firebase.RTDB.getInt(&fbdo, PATH_TOTAL_FEEDS)) {
        total = fbdo.intData();     // Read existing count
    }
    total += getPortionsFed();      // Add this feeding
    Firebase.RTDB.setInt(&fbdo, PATH_TOTAL_FEEDS, total);

    // 3. Reset the command to 0 (command is complete)
    Firebase.RTDB.setInt(&fbdo, PATH_COMMAND, 0);

    // 4. Set device status to idle
    Firebase.RTDB.setString(&fbdo, PATH_STATUS_ESP, "idle");

    Serial.println("Feed record saved to Firebase (total: " + String(total) + ")");
}

#endif
