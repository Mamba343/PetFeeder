#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <ESP32Servo.h>
#include "time.h"

// WiFi
#define WIFI_SSID "ACTFIBERNET"
#define WIFI_PASSWORD "Billi@123"

// Firebase
#define API_KEY "AIzaSyAqqklztKcJcGdiojY84qf4MXunIAeIyO4"
#define DATABASE_URL "https://pet-feeder-8dd60-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Auth
#define USER_EMAIL "mydevice@feeder.com"
#define USER_PASSWORD "device_password123"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Servo
Servo feederServo;
#define SERVO_PIN 13   // adjust to your wiring
#define BASE_FEED_TIME 2000  // ms per portion

// NTP
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800;   // UTC+5:30
const int daylightOffset_sec = 0;

String getTimeNow() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "Time Error";
  }
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(buffer);
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nConnected to Wi-Fi");

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  feederServo.attach(SERVO_PIN);
  feederServo.write(90); // stop position
}

void feedPortions(int portions) {
  if (portions <= 0) return;

  int feedDuration = portions * BASE_FEED_TIME;
  Serial.printf("Feeding %d portions (%d ms)\n", portions, feedDuration);

  // Update Firebase status
  Firebase.RTDB.setString(&fbdo, "/status/from_esp", "feeding");

  // Start servo
  feederServo.write(0);  // rotate
  delay(feedDuration);
  feederServo.write(90); // stop

  // Log in Firebase
  Firebase.RTDB.setString(&fbdo, "/status/last_feed_time", getTimeNow());

  // Increment totalFeeds
  int totalFeeds = 0;
  if (Firebase.RTDB.getInt(&fbdo, "/status/totalFeeds")) {
    totalFeeds = fbdo.intData();
  }
  totalFeeds += portions;
  Firebase.RTDB.setInt(&fbdo, "/status/totalFeeds", totalFeeds);

  // Reset command + status
  Firebase.RTDB.setInt(&fbdo, "/commands/portion_size", 0);
  Firebase.RTDB.setString(&fbdo, "/status/from_esp", "idle");

  Serial.println("Feeding done.");
}

void loop() {
  if (Firebase.RTDB.getInt(&fbdo, "/commands/portion_size")) {
    int portions = fbdo.intData();
    if (portions > 0) {
      feedPortions(portions);
    }
  }
  delay(1000);
}
