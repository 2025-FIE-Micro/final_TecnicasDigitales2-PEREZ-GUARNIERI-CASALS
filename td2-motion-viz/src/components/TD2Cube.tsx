import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { Mesh, Euler, Vector3, ArrowHelper } from 'three';
import { SensorData } from '@/hooks/useSensorData';

interface TD2CubeProps {
  sensorData: SensorData;
}

export const TD2Cube = ({ sensorData }: TD2CubeProps) => {
  const meshRef = useRef<Mesh>(null);
  const arrowRef = useRef<ArrowHelper>(null);

  const accumulatedRotation = useRef<Euler>(new Euler(0, 0, 0));
  const emissionIntensity = useRef(0.2);
  const [resetFlag, setResetFlag] = useState(false);

  useFrame((state, delta) => {
    const {
      gyro_x = 0,
      gyro_y = 0,
      gyro_z = 0,
      accel_x = 0,
      accel_y = 0,
      accel_z = 9.81,
      mag_x = 0,
      mag_y = 0,
      mag_z = 0,
    } = sensorData;

    // Si se activó el reset, reiniciar acumuladores
    if (resetFlag) {
      accumulatedRotation.current.set(0, 0, 0);
      if (arrowRef.current) {
        arrowRef.current.setDirection(new Vector3(1, 0, 0));
      }
      setResetFlag(false); // limpiar flag
      return;
    }

    // 1. Rotación acumulada (giroscopio)
    const gx = (gyro_x * Math.PI) / 180;
    const gy = (gyro_y * Math.PI) / 180;
    const gz = (gyro_z * Math.PI) / 180;

    accumulatedRotation.current.x += gx * delta;
    accumulatedRotation.current.y += gy * delta;
    accumulatedRotation.current.z += gz * delta;

    // 2. Posición (acelerómetro)
    const px = accel_x * 0.3;
    const py = accel_y * 0.3;
    const pz = (accel_z - 9.81) * 0.1;

    // 3. Brillo dinámico por intensidad magnética
    const magMagnitude = Math.sqrt(mag_x ** 2 + mag_y ** 2 + mag_z ** 2);
    const targetEmission = Math.min(1.0, Math.max(0.1, magMagnitude / 100));
    emissionIntensity.current += (targetEmission - emissionIntensity.current) * delta * 3;

    // 4. Aplicar al cubo
    if (meshRef.current) {
      meshRef.current.rotation.copy(accumulatedRotation.current);
      meshRef.current.position.set(px, py + Math.sin(state.clock.elapsedTime * 2) * 0.02, pz);

      const material = meshRef.current.material as any;
      if (material?.emissiveIntensity !== undefined) {
        material.emissiveIntensity = emissionIntensity.current;
      }
    }

    // 5. Actualizar flecha del campo magnético
    if (arrowRef.current) {
      const dir = new Vector3(mag_x, mag_y, mag_z);
      if (dir.length() > 0.0001) {
        arrowRef.current.setDirection(dir.normalize());
        arrowRef.current.setLength(4);
      }
    }
  });

  return (
    <group>
      {/* Cubo principal */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#004444"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
        <Text position={[0, 0, 1.01]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">TD2</Text>
        <Text position={[0, 0, -1.01]} rotation={[0, Math.PI, 0]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">MPU</Text>
        <Text position={[1.01, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.25} color="#00ffff" anchorX="center" anchorY="middle">9250</Text>
        <Text position={[-1.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.25} color="#00ffff" anchorX="center" anchorY="middle">SENSOR</Text>
      </mesh>

      {/* Wireframe */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.1, 2.1, 2.1]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Flecha del campo magnético */}
      <primitive
        object={
          new ArrowHelper(
            new Vector3(1, 0, 0),
            new Vector3(0, 0, 0),
            4,
            0xffaa00
          )
        }
        ref={arrowRef}
        dispose={null}
      />

      {/* Botón de reseteo en la escena */}
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
