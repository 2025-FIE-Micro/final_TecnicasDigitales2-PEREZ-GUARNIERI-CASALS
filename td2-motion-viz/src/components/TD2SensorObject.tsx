import { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { Quaternion, Euler, Vector3 } from 'three';
import { SensorData } from '@/hooks/useSensorData';

interface TD2SensorObjectProps {
  sensorData: SensorData;
}

// Componente principal que representa el avión animado
export const TD2SensorObject = ({ sensorData }: TD2SensorObjectProps) => {
  const airplaneRef = useRef<any>(null); // Referencia al modelo 3D cargado
  const rotationQuat = useRef<Quaternion>(new Quaternion()); // Quaternion que acumula la rotación del sensor
  const [resetFlag, setResetFlag] = useState(false); // Bandera para resetear orientación

  const { scene } = useGLTF('/models/airplane.glb'); // Cargar modelo 3D del avión

  // useFrame se ejecuta en cada frame del renderizado
  useFrame((state, delta) => {
    // Obtenemos los datos del sensor en cada frame
    const {
      gyro_x = 0, // Velocidad angular en eje X (°/s)
      gyro_y = 0, // Velocidad angular en eje Y (°/s)
      gyro_z = 0, // Velocidad angular en eje Z (°/s)
      accel_x = 0, // Aceleración en eje X (m/s²)
      accel_y = 0, // Aceleración en eje Y (m/s²)
      accel_z = 9.81, // Aceleración en eje Z (m/s²). 9.81 es el valor en reposo por la gravedad.
    } = sensorData;

    // Si se presionó el botón "Resetear orientación"
    if (resetFlag) {
      rotationQuat.current.identity(); // Reseteamos el quaternion a sin rotación
      setResetFlag(false); // Limpiamos el flag
      return;
    }

    // 🔁 Paso 1: Convertimos giroscopio de °/s a radianes/s    
    const gx = (gyro_x * Math.PI) / 180; // giro en X en radianes/s
    const gy = (gyro_z * Math.PI) / 180; // giro en Y en radianes/s
    const gz = (gyro_y * Math.PI) / 180; // giro en Z en radianes/s

    // 🔁 Paso 2: Creamos una rotación incremental por frame usando un Euler
    const deltaEuler = new Euler(gx * delta, gy * delta, gz * delta, 'XYZ');

    // 🔁 Paso 3: Convertimos esa rotación a un quaternion incremental
    const deltaQuat = new Quaternion().setFromEuler(deltaEuler);

    // 🔁 Paso 4: Acumulamos la rotación general multiplicando quaternions
    rotationQuat.current.multiply(deltaQuat);

    // 📦 Paso 5: Aplicamos rotación y posición al modelo 3D
    if (airplaneRef.current) {
      // Rotación acumulada
      airplaneRef.current.quaternion.copy(rotationQuat.current);

      // Movimiento (posición) opcional basado en acelerómetro
      // Esto se puede eliminar si no querés que se mueva en el espacio
      const px = accel_x * 0.9;
      const py = accel_y * 0.9;
      const pz = accel_z * 0.9; 

      // Setear posición del modelo
      airplaneRef.current.position.set(
        px,
        py + Math.sin(state.clock.elapsedTime * 2) * 0.08, // flotación leve en Y
        pz
      );
    }
  });

  return (
    <group>
      {/* 🌍 Carga y renderiza el avión 3D */}
      <Suspense fallback={<Html>Loading avión...</Html>}>
        <primitive
          object={scene}            // Modelo importado (glTF)
          ref={airplaneRef}         // Referencia para manipularlo
          scale={0.8}               // Tamaño del avión
          rotation={[0, 0, 0]}      // Rotación inicial (sin efecto aquí, ya que usamos quaternion)
        />
      </Suspense>

      {/* 🛠️ Botón para resetear orientación del avión */}
      <Html position={[0, -3.5, 0]}>
        <button
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: '#00ffff',
            color: '#000',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 10px #00ffff',
          }}
          onClick={() => setResetFlag(true)}
        >
          Resetear orientación
        </button>
      </Html>
    </group>
  );
};
