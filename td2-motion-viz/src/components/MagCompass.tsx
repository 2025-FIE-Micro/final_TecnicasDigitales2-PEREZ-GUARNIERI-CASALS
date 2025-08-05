import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ArrowHelper, Vector3 } from 'three';
import { SensorData } from '@/hooks/useSensorData';

interface MagCompassProps {
  sensorData: SensorData;
}

export const MagCompass = ({ sensorData }: MagCompassProps) => {
  const arrowRef = useRef<ArrowHelper>(null);

  useFrame(() => {
    const { mag_x = 0, mag_y = 0 } = sensorData;

    const dir = new Vector3(mag_x, mag_y, 0);
    if (dir.length() > 0.001) {
      dir.normalize();
      arrowRef.current?.setDirection(dir);
    }
  });

  return (
    <group position={[6, -4, -8]} scale={1.5}>
      {/* Flecha de brújula */}
      <primitive
        object={
          new ArrowHelper(
            new Vector3(1, 0, 0), // dirección inicial
            new Vector3(0, 0, 0), // origen
            2,                   // longitud
            0xff0000             // color rojo
          )
        }
        ref={arrowRef}
        dispose={null}
      />

      {/* Base circular opcional */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial color="#222" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};
