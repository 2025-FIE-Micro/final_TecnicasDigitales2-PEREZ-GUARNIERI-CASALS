import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { TD2Cube } from './TD2Cube';
import { SensorData } from '@/hooks/useSensorData';
import { TD2SensorObject } from './TD2SensorObject';
import { MagCompass } from './MagCompass';

interface Scene3DProps {
  sensorData: SensorData;
}

export const Scene3D = ({ sensorData }: Scene3DProps) => {
  return (
    <div className="h-full w-full relative">
      <Canvas
        camera={{ position: [8, 8, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} color="#004466" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          color="#00ffff"
          castShadow
        />
        <pointLight
          position={[-10, -10, -5]}
          intensity={0.5}
          color="#ff0088"
        />

        {/* Environment and controls */}
        <Environment preset="night" />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxDistance={20}
          minDistance={3}
        />

        {/* Grid floor */}
        <Grid
          position={[0, -3, 0]}
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#00ffff"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#0088ff"
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid
        />

        {/* Main TD2 Cube */}
        {/* <TD2Cube sensorData={sensorData} /> */}
        <TD2SensorObject sensorData={sensorData} />

        {/* <MagCompass sensorData={sensorData} /> */}

        {/* Additional atmospheric elements */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[15, 32, 32]} />
          <meshBasicMaterial
            color="#001122"
            transparent
            opacity={0.1}
            side={1} // BackSide
          />
        </mesh>
      </Canvas>
      
      {/* Overlay grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
    </div>
  );
};