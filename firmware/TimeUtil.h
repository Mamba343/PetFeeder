// ============================================================
// TimeUtil.h - Network time (NTP) functions
// ============================================================
// The ESP32 gets the current date/time from the internet
// using NTP (Network Time Protocol). This happens automatically
// when the device connects to WiFi.
//
// The time is used to:
//   - Timestamp the last feeding event
//   - (Future) Run scheduled feeds at specific times
// ============================================================

#ifndef TIME_UTIL_H
#define TIME_UTIL_H

#include <time.h>   // Arduino library for time functions

// ------------------------------------------------------------
// initTime() - Call once in setup() to start NTP sync
// ------------------------------------------------------------
// This tells the ESP32 to fetch the current time from
// pool.ntp.org using the timezone offset from Config.h.
// The ESP32 handles background sync automatically after this.
void initTime() {
    configTime(GMT_OFFSET, DAYLIGHT_OFFSET, NTP_SERVER);
    Serial.println("NTP time sync started");
}

// ------------------------------------------------------------
// getFormattedTime() - Returns current time as a readable string
// ------------------------------------------------------------
// Example output: "2026-07-07 14:30:00"
//
// If NTP hasn't synced yet (no WiFi), it returns "Time Error"
// so you can check for problems in the Serial Monitor.
String getFormattedTime() {
    struct tm timeinfo;                     // Structure that holds broken-down time
    if (!getLocalTime(&timeinfo)) {         // If NTP hasn't responded yet
        return "Time Error";                // Return error string
    }
    char buffer[30];                        // Temporary storage for the string
    strftime(buffer, sizeof(buffer),        // Format: Year-Month-Day Hour:Minute:Second
             "%Y-%m-%d %H:%M:%S", &timeinfo);
    return String(buffer);                  // Convert to Arduino String and return
}

#endif
