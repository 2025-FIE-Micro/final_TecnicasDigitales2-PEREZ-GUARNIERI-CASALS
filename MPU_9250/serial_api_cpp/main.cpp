/**
 * @file main.cpp
 * @brief API en C++ para exponer los datos del sensor MPU-9250 leídos por puerto serial.
 * 
 * Este programa abre un puerto serial (por ejemplo, /dev/ttyUSBx), lee datos en formato JSON
 * enviados por un microcontrolador (ESP8266), y los expone a través de un servidor HTTP en la ruta `/data`.
 * 
 * Librerías usadas:
 * - cpp-httplib: para servidor HTTP embebido
 * - C++ estándar: para concurrencia, lectura de puerto serial, sincronización
 */

#include <iostream>
#include <string>
#include <thread>
#include <mutex>
#include <fcntl.h>
#include <termios.h>
#include <unistd.h>
#include "httplib.h"

/// Último JSON recibido desde el microcontrolador
std::string ultimo_json = "{}";

/// Mutex para acceso seguro al JSON compartido
std::mutex json_mutex;

/**
 * @brief Hilo lector del puerto serial.
 * 
 * Abre el puerto serial especificado y lee línea por línea.
 * Cada línea debe ser un JSON válido enviado por el ESP8266.
 * El último JSON recibido se guarda en una variable global protegida por mutex.
 * 
 * @param puerto Ruta del dispositivo serial (ejemplo: "/dev/ttyUSB0")
 */
void leer_serial(const std::string& puerto) {
    std::cout << "[Serial] Abriendo puerto: " << puerto << std::endl;
    int fd = open(puerto.c_str(), O_RDWR | O_NOCTTY | O_SYNC);
    if (fd < 0) {
        perror("[Error] No se pudo abrir el puerto serial");
        return;
    }

    std::cout << "[Serial] Puerto abierto correctamente." << std::endl;

    struct termios tty;
    tcgetattr(fd, &tty);
    cfsetospeed(&tty, B115200);
    cfsetispeed(&tty, B115200);

    tty.c_cflag = (tty.c_cflag & ~CSIZE) | CS8;
    tty.c_iflag &= ~IGNBRK;
    tty.c_lflag = 0;
    tty.c_oflag = 0;
    tty.c_cc[VMIN] = 1;
    tty.c_cc[VTIME] = 1;
    tty.c_iflag &= ~(IXON | IXOFF | IXANY);
    tty.c_cflag |= (CLOCAL | CREAD);
    tty.c_cflag &= ~(PARENB | PARODD);
    tty.c_cflag &= ~CSTOPB;
    tty.c_cflag &= ~CRTSCTS;
    tcsetattr(fd, TCSANOW, &tty);

    char buf[512];
    std::string linea;

    std::cout << "[Serial] Escuchando datos..." << std::endl;
    while (true) {
        int n = read(fd, buf, sizeof(buf));
        if (n > 0) {
            for (int i = 0; i < n; ++i) {
                if (buf[i] == '\n') {
                    if (!linea.empty()) {
                        std::lock_guard<std::mutex> lock(json_mutex);
                        ultimo_json = linea;
                        std::cout << "[Serial] JSON recibido: " << linea << std::endl;
                    }
                    linea.clear();
                } else {
                    linea += buf[i];
                }
            }
        }
    }
}

/**
 * @brief Función principal del programa.
 * 
 * - Inicia el hilo lector del puerto serial.
 * - Inicia un servidor HTTP que expone los datos del sensor en formato JSON.
 * - La ruta `/data` devuelve el último JSON recibido.
 * - La ruta OPTIONS maneja preflight para CORS.
 * 
 * @return int Código de salida del programa (0 = OK)
 */
int main() {
    std::string puerto_serial = "/dev/ttyUSB0";

    // Hilo lector del serial
    std::thread hilo_serial(leer_serial, puerto_serial);

    // Servidor HTTP embebido
    httplib::Server svr;

    // Manejo de preflight OPTIONS (CORS)
    svr.Options("/data", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 204; // No Content
    });

    // Respuesta GET real con JSON
    svr.Get("/data", [](const httplib::Request&, httplib::Response& res) {
        std::lock_guard<std::mutex> lock(json_mutex);
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(ultimo_json, "application/json");
    });

    std::cout << "[HTTP] Servidor levantado en http://localhost:5000/data" << std::endl;
    svr.listen("0.0.0.0", 5000);

    hilo_serial.join();
    return 0;
}
