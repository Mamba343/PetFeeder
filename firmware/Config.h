// ============================================================
// Config.h - Pin mappings and constants for Smart PetFeeder
// ============================================================
// This file defines all the hardware pins and timing values.
// Change these numbers if you wire things differently.
// ============================================================

#ifndef CONFIG_H
#define CONFIG_H

// ---- SERVO SETTINGS ----
// The servo controls the auger that pushes food out.
// GPIO 13 is a standard PWM-capable pin on the ESP32.
#define SERVO_PIN      13    // Signal wire (orange) connected here
#define SERVO_STOP     90    // Pulse width that stops the servo (center)
#define SERVO_RUN      0     // Pulse width that runs the servo (full speed)

// Feeding timing:
//   BASE_FEED_TIME = how long (in milliseconds) the servo runs for ONE portion.
//   2000ms = 2 seconds per portion. Adjust after calibrating with your food.
//   MAX_FEED_TIME = safety limit. The servo stops after this even if more
//   portions were requested. Prevents motor burnout if something jams.
#define BASE_FEED_TIME  2000  // ms per portion (1 portion = ~25-30g with default auger)
#define MAX_FEED_TIME   30000 // 30 seconds max continuous rotation

// ---- LED SETTINGS ----
// A single-color LED connected here shows the device status.
// The 330 ohm resistor protects the LED and GPIO pin.
#define LED_PIN         2     // Anode (+) goes here through a 330 ohm resistor
#define LED_ON          HIGH  // GPIO HIGH = LED lights up
#define LED_OFF         LOW   // GPIO LOW = LED turns off

// ---- NTP (NETWORK TIME) SETTINGS ----
// The ESP32 gets the current time from the internet using NTP.
// pool.ntp.org is a free public time server.
// GMT_OFFSET = your timezone offset in seconds:
//   UTC+5:30 (India)  = 19800
//   UTC+8:00 (China)  = 28800
//   UTC+0:00 (London) = 0
//   UTC-5:00 (NYC)    = -18000
#define NTP_SERVER    "pool.ntp.org"
#define GMT_OFFSET    19800     // Seconds from UTC (adjust for your timezone)
#define DAYLIGHT_OFFSET 0       // Daylight saving adjustment (0 = none)

// ---- FIREBASE PATHS ----
// These are the locations in the Firebase Realtime Database
// where the ESP32 reads commands and writes status.
#define PATH_COMMAND      "/commands/portion_size"
#define PATH_STATUS_ESP   "/status/from_esp"
#define PATH_LAST_FEED    "/status/last_feed_time"
#define PATH_TOTAL_FEEDS  "/status/totalFeeds"
#define PATH_LAST_SEEN    "/status/lastSeenAt"

#endif
