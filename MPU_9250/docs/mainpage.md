@mainpage 📡 Proyecto Final - Técnicas Digitales II

@section resumen 🧠 Resumen

Este proyecto implementa un sistema de adquisición y visualización de datos en tiempo real utilizando el sensor MPU-9250.  
La arquitectura se basa en un ESP8266 que lee los valores del sensor por I2C y los transmite por USB a una PC.  
Luego, una aplicación en C++ expone esos datos como una API REST accesible vía HTTP.

@section hardware 🔩 Hardware utilizado

- MPU-9250 (acelerómetro, giroscopio y magnetómetro)
- Placa ESP8266 NodeMCU
- Conexión I2C (SDA: GPIO4, SCL: GPIO5)
- Comunicación serial USB

@section software 🧰 Software utilizado

- PlatformIO (programación del ESP8266)
- C++ con `cpp-httplib` (servidor HTTP embebido)
- Doxygen (documentación automática)

@section equipo 👨‍💻 Autores

- Hernán Ariel Pérez  
- Franco Guarnieri  
- Mauricio Casasl  
- Año: 2025
