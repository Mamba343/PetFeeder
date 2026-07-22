// ============================================================
// LedManager.h - Status LED control
// ============================================================
// Controls a single LED connected to GPIO 2 through a 330 ohm
// resistor. Since we only have one color (no RGB LED), we use
// different BLINKING PATTERNS to show the device state:
//
//   SOLID ON     = Device is IDLE and connected to Firebase
//   FAST BLINK   = FEEDING in progress (100ms on/off)
//   SLOW BLINK   = ERROR (WiFi/Firebase problem) (500ms on/off)
//   OFF          = Device powered off or sleeping
//
// The LED is updated in loop() via updateLed(), which uses
// millis() to control timing (non-blocking).
// ============================================================

#ifndef LED_MANAGER_H
#define LED_MANAGER_H

// Possible LED patterns
enum LedPattern {
    LED_IDLE,       // Solid ON - everything is fine, waiting for commands
    LED_FEEDING,    // Fast blink - currently dispensing food
    LED_ERROR,      // Slow blink - something went wrong
    LED_OFF_STATE   // Completely off
};

// Current active pattern. Changed by calling setLedPattern().
LedPattern currentPattern = LED_OFF_STATE;

// ------------------------------------------------------------
// initLed() - Call once in setup()
// ------------------------------------------------------------
// Sets the LED pin as an output and does a quick power-on blink
// to show the LED is working.
void initLed() {
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, LOW);

    // Power-on blink: 3 quick flashes so you know it's alive
    for (int i = 0; i < 3; i++) {
        digitalWrite(LED_PIN, HIGH);
        delay(100);
        digitalWrite(LED_PIN, LOW);
        delay(100);
    }
    Serial.println("Status LED ready on GPIO " + String(LED_PIN));
}

// ------------------------------------------------------------
// setLedPattern() - Change the LED behavior
// ------------------------------------------------------------
// Call this to switch between states:
//   setLedPattern(LED_IDLE);     // Solid on
//   setLedPattern(LED_FEEDING);  // Fast blink
//   setLedPattern(LED_ERROR);    // Slow blink
void setLedPattern(LedPattern pattern) {
    currentPattern = pattern;
}

// ------------------------------------------------------------
// updateLed() - Must be called repeatedly in loop()
// ------------------------------------------------------------
// This function reads currentPattern and updates the LED
// accordingly. It uses millis() so it never blocks.
void updateLed() {
    static unsigned long lastToggle = 0;  // Last time we switched the LED
    static bool ledState = false;          // Current LED on/off
    unsigned long now = millis();          // Current time in milliseconds

    switch (currentPattern) {

        case LED_IDLE:
            // Solid ON: just keep the LED lit
            digitalWrite(LED_PIN, HIGH);
            break;

        case LED_FEEDING:
            // Fast blink: toggle every 100ms
            if (now - lastToggle >= 100) {
                ledState = !ledState;
                digitalWrite(LED_PIN, ledState ? HIGH : LOW);
                lastToggle = now;
            }
            break;

        case LED_ERROR:
            // Slow blink: toggle every 500ms
            if (now - lastToggle >= 500) {
                ledState = !ledState;
                digitalWrite(LED_PIN, ledState ? HIGH : LOW);
                lastToggle = now;
            }
            break;

        case LED_OFF_STATE:
            // Off: ensure the pin is LOW
            digitalWrite(LED_PIN, LOW);
            break;
    }
}

#endif
