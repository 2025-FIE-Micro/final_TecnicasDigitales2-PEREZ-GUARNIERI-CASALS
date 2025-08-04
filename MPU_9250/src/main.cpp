/**
 * @file main.cpp
 * @brief Lectura del sensor MPU-9250 y transmisión de datos por puerto serial en formato JSON.
 * 
 * El programa mide aceleración (g), velocidad angular (°/s) y campo magnético (µT),
 * usando un ESP8266 y el sensor MPU-9250. Los datos se imprimen en formato JSON por serial.
 */

#include <Wire.h>
#include <Arduino.h>
#include <MPU9250_asukiaaa.h>

/// Instancia del sensor MPU9250 con dirección I2C por defecto (0x68)
MPU9250_asukiaaa mpu(0x68);

/**
 * @brief Configura la comunicación serial, el bus I2C y el sensor MPU-9250.
 */
void setup() {
  Serial.begin(115200);
  delay(1000);

  Wire.begin(4, 5); // SDA = GPIO4, SCL = GPIO5 (D2 y D1 en NodeMCU)

  mpu.setWire(&Wire);
  mpu.beginAccel();
  mpu.beginGyro();
  mpu.beginMag();
}

/**
 * @brief Loop principal que actualiza sensores y genera salida JSON.
 * 
 * Lectura de:
 * - Acelerómetro en g (`accel_x`, `accel_y`, `accel_z`)
 * - Giroscopio en grados/segundo (`gyro_x`, `gyro_y`, `gyro_z`)
 * - Magnetómetro en microteslas (`mag_x`, `mag_y`, `mag_z`)
 */
void loop() {
  mpu.accelUpdate();
  mpu.gyroUpdate();
  mpu.magUpdate();

  String json = "{";
  json += "\"accel_x\":" + String(mpu.accelX(), 3) + ",";
  json += "\"accel_y\":" + String(mpu.accelY(), 3) + ",";
  json += "\"accel_z\":" + String(mpu.accelZ(), 3) + ",";
  json += "\"gyro_x\":" + String(mpu.gyroX(), 3) + ",";
  json += "\"gyro_y\":" + String(mpu.gyroY(), 3) + ",";
  json += "\"gyro_z\":" + String(mpu.gyroZ(), 3) + ",";
  json += "\"mag_x\":" + String(mpu.magX(), 3) + ",";
  json += "\"mag_y\":" + String(mpu.magY(), 3) + ",";
  json += "\"mag_z\":" + String(mpu.magZ(), 3);
  json += "}";

  Serial.println(json);

  delay(100); // 10 Hz
}
