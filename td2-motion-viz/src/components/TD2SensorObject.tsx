import { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { Euler, Vector3 } from 'three';
import { SensorData } from '@/hooks/useSensorData';

interface TD2SensorObjectProps {
  sensorData: SensorData;
}

export const TD2SensorObject = ({ sensorData }: TD2SensorObjectProps) => {
  const airplaneRef = useRef<any>(null);
  const accumulatedRotation = useRef<Euler>(new Euler(0, 0, 0));
  const [resetFlag, setResetFlag] = useState(false);

  const { scene } = useGLTF('/models/airplane.glb');

  useFrame((state, delta) => {
    const {
      gyro_x = 0,
      gyro_y = 0,
      gyro_z = 0,
      accel_x = 0,
      accel_y = 0,
      accel_z = 9.81,
    } = sensorData;

    if (resetFlag) {
      accumulatedRotation.current.set(0, 0, 0);
      setResetFlag(false);
      return;
    }

    // 1. Rotación acumulativa
    const gx = (gyro_x * Math.PI) / 180;
    const gy = (gyro_y * Math.PI) / 180;
    const gz = (gyro_z * Math.PI) / 180;

    accumulatedRotation.current.x += gx * delta;
    accumulatedRotation.current.y += gy * delta;
    accumulatedRotation.current.z += gz * delta;

    // 2. Posición desde acelerómetro
    const px = accel_x * 0.3;
    const py = accel_y * 0.3;
    const pz = (accel_z - 9.81) * 0.1;

    // 3. Aplicar al avión
    if (airplaneRef.current) {
      airplaneRef.current.rotation.copy(accumulatedRotation.current);
      airplaneRef.current.position.set(px, py + Math.sin(state.clock.elapsedTime * 2) * 0.02, pz);
    }
  });

  return (
    <group>
      {/* Avión 3D */}
      <Suspense fallback={<Html>Loading avión...</Html>}>
        <primitive
          object={scene}
          ref={airplaneRef}
          scale={0.8}
          rotation={[0, 0, 0]}
        />
      </Suspense>

      {/* Botón de reset */}
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
