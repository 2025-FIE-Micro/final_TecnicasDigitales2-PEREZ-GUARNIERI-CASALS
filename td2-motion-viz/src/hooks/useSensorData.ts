import { useState, useEffect } from 'react';

export interface SensorData {
  accel_x: number;
  accel_y: number;
  accel_z: number;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  mag_x: number;
  mag_y: number;
  mag_z: number;
}

const API_ENDPOINT = 'http://localhost:5000/data';

export const useSensorData = () => {
  const [data, setData] = useState<SensorData>({
    accel_x: 0, accel_y: 0, accel_z: 9.81,
    gyro_x: 0, gyro_y: 0, gyro_z: 0,
    mag_x: 0, mag_y: 0, mag_z: 0
  });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchSensorData = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const sensorData = await response.json();
      setData(sensorData);
      setIsConnected(true);
      setLastUpdate(new Date());

    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error conectando al sensor:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 250);
    return () => clearInterval(interval);
  }, []);

  return { data, isConnected, lastUpdate };
};