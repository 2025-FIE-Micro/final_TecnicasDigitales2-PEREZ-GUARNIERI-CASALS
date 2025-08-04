# 🎯 TD2 Giróscopo

Proyecto final de la materia **Técnicas Digitales II**  
Visualización en tiempo real de sensores inerciales MPU-9250 a través de un flujo completo: **sensor físico + firmware + backend + frontend 3D**.

---

## 🧩 Tecnologías utilizadas

- **MPU-9250** (acelerómetro, giroscopio y magnetómetro)
- **ESP8266** (NodeMCU) para adquisición y transmisión de datos vía USB
- **C++** con `httplib` para exponer los datos como API HTTP local
- **Doxygen** para documentar todo el backend
- **React + Three.js (`@react-three/fiber`)** para visualización 3D en tiempo real
- 
---

<img width="1246" height="353" alt="image" src="https://github.com/user-attachments/assets/b278c9da-cabf-44e8-9b27-2626dd8f3230" />

## ⚙️ Flujo del sistema

```text
[Sensor MPU-9250]
         ↓ I2C
     [ESP8266 NodeMCU]
         ↓ USB Serial
     [API C++ local]
         ↓ HTTP JSON
     [Frontend React]
         ↓
  [Visualización 3D Interactiva]
```

---

## 📦 Estructura del proyecto

```bash
.
├── serial_api_cpp/         # Servidor C++ que lee del puerto serial y expone la API HTTP
│   ├── main.cpp
│   └── Makefile
├── src/                    # Código PlatformIO para el ESP8266
│   └── main.cpp
├── docs/                   # Doxygen config + documentación generada
│   └── Doxyfile
├── react-frontend/         # Interfaz web 3D hecha en React
│   ├── src/components/
│   │   └── TD2SensorObject.tsx
│   └── public/models/airplane.glb
└── README.md
```

---

## 🔌 1. Cargar firmware en el ESP8266

> 📍 Ubicarse en `/src/` y tener PlatformIO instalado

```bash
pio run --target upload --upload-port /dev/ttyUSB0
```

Este firmware configura el MPU-9250 por I2C y envía datos JSON vía Serial a 115200 baud.

---

## 🌐 2. Ejecutar el servidor C++ (API HTTP)

> 📍 Ubicarse en `serial_api_cpp/`

```bash
make
./serial_api
```

Esto abre `/dev/ttyUSB0`, lee los datos del sensor y los expone en:

```http
GET http://localhost:5000/data
```

Respuesta tipo:
```json
{
  "accel_x": -0.52,
  "accel_y": -0.94,
  "accel_z": 0.04,
  "gyro_x": -1.0,
  "gyro_y": 0.2,
  "gyro_z": -0.8,
  "mag_x": 23.0,
  "mag_y": 83.5,
  "mag_z": -57.2
}
```

---

## 📘 3. Documentación técnica con Doxygen

> 📍 Ubicarse en `docs/` y ejecutar:

```bash
doxygen Doxyfile
```

Se genera la documentación HTML navegable en `docs/html/index.html`.

---

## 🖥️ 4. Visualización React 3D

> 📍 Ubicarse en `react-frontend/`

### Instalar dependencias:

```bash
npm install
```

### Ejecutar en modo desarrollo:

```bash
npm run dev
```

Abrir [http://localhost:8080](http://localhost:8080)

---

## 🛩️ Características del visor 3D

- Visualización en tiempo real del movimiento del sensor
- Objeto 3D: modelo de avión (`airplane.glb`)
- Brillo dinámico según intensidad magnética
- Movimiento e inclinación según acelerómetro y giroscopio
- Botón para **resetear orientación acumulada**

---

## 🧠 Autores

- Hernán Ariel Pérez  
- Franco Guarnieri  
- Mauricio Casals  
- Año: 2025

---

## 📜 Licencia

MIT — Usalo, modificalo y compartilo libremente.
