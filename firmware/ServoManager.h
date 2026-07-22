// ============================================================
// ServoManager.h - Non-blocking servo control
// ============================================================
// The SG90 servo rotates an auger to push food into the bowl.
//
// Why "non-blocking"?
//   The old code used delay(4000) which FREEZES the entire ESP32
//   for 4 seconds. No Firebase, no LED, nothing works during that time.
//
//   Instead, we use a STATE MACHINE:
//     IDLE     -> waiting for a command
//     FEEDING  -> servo is running, checking timer every loop()
//     DONE     -> feeding finished, waiting for main loop to save to Firebase
//
//   The timer uses millis(), which is like a stopwatch. We check
//   "has it been long enough?" each loop() without blocking.
// ============================================================

#ifndef SERVO_MANAGER_H
#define SERVO_MANAGER_H

#include <ESP32Servo.h>    // Arduino library for servo control

// ---- STATE MACHINE ----
// These are the possible states of the feeder.
enum FeederState {
    STATE_IDLE,      // Nothing happening, waiting for a command
    STATE_FEEDING,   // Servo is rotating, food is being dispensed
    STATE_DONE       // Feeding finished, needs Firebase update
};

// Global state variable
FeederState feederState = STATE_IDLE;  // Start in idle
Servo feederServo;                      // The servo object
int feedDuration = 0;                   // How long to run (calculated from portions)
unsigned long feedStartTime = 0;        // When did the feeding start? (millis())
int portionsToFeed = 0;                 // How many portions requested

// ------------------------------------------------------------
// initServo() - Call once in setup()
// ------------------------------------------------------------
// Attaches the servo to its pin and sets it to the STOP position
// so the auger doesn't spin when the device powers on.
void initServo() {
    feederServo.attach(SERVO_PIN);      // Tell Arduino "servo is on this pin"
    feederServo.write(SERVO_STOP);      // Start in the STOP position (90 degrees)
    Serial.println("Servo ready on GPIO " + String(SERVO_PIN));
}

// ------------------------------------------------------------
// startFeeding(portions) - Begin a feeding cycle
// ------------------------------------------------------------
// Called when a command is received from Firebase.
// Calculates the run time and immediately starts the servo.
//
// Safety: if the calculated time exceeds MAX_FEED_TIME (30 seconds),
// it caps it. This prevents the servo from burning out if it jams.
void startFeeding(int portions) {
    if (portions <= 0) return;              // Ignore invalid commands
    if (feederState != STATE_IDLE) return;  // Already feeding, ignore

    portionsToFeed = portions;

    // Calculate run time: each portion gets BASE_FEED_TIME milliseconds
    feedDuration = portions * BASE_FEED_TIME;

    // Safety cap: never run longer than MAX_FEED_TIME
    if (feedDuration > MAX_FEED_TIME) {
        feedDuration = MAX_FEED_TIME;
        Serial.println("WARNING: Feed time capped to " + String(MAX_FEED_TIME) + "ms safety limit");
    }

    feedStartTime = millis();   // Record the start time
    feederState = STATE_FEEDING; // Move to FEEDING state

    // Start the servo rotating (dispense position)
    feederServo.write(SERVO_RUN);

    Serial.println("Feeding " + String(portions) + " portion(s) for " + String(feedDuration) + "ms");
}

// ------------------------------------------------------------
// updateServo() - Must be called every loop()
// ------------------------------------------------------------
// This is the heart of the non-blocking control.
// It checks: "Has the feeding time expired?"
// If yes, it stops the servo and moves to STATE_DONE.
// If no, it does nothing - the servo keeps running.
// Either way, this function returns immediately (no delay!).
void updateServo() {
    if (feederState == STATE_FEEDING) {
        unsigned long elapsed = millis() - feedStartTime;
        if (elapsed >= (unsigned long)feedDuration) {
            // Time's up - stop the servo
            feederServo.write(SERVO_STOP);
            feederState = STATE_DONE;
            Serial.println("Feeding complete (" + String(elapsed) + "ms)");
        }
    }
}

// ---- STATE CHECKERS ----
// These are simple helper functions the main loop uses to
// decide what to do next.
bool isIdle()   { return feederState == STATE_IDLE; }
bool isFeeding(){ return feederState == STATE_FEEDING; }
bool isDone()   { return feederState == STATE_DONE; }
int  getPortionsFed() { return portionsToFeed; }

// ------------------------------------------------------------
// resetToIdle() - Return to idle after Firebase is updated
// ------------------------------------------------------------
// Called by the main loop AFTER it writes the feed record
// to Firebase. Clears everything and waits for the next command.
void resetToIdle() {
    feederState = STATE_IDLE;
    portionsToFeed = 0;
    feedDuration = 0;
}

#endif
