import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Flashlight component that tracks the mouse pointer
const FlashlightSpotlight = () => {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!lightRef.current || !targetRef.current) return;

    // Convert mouse state (normalized device coordinates -1 to 1) to 3D world space
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;

    // Position light slightly in front of camera
    lightRef.current.position.set(x, y, 4.5);

    // Target the spot directly onto the wall (z = -2)
    targetRef.current.position.set(x, y, -2);
    lightRef.current.target = targetRef.current;
  });

  return (
    <>
      <object3D ref={targetRef} />
      <spotLight
        ref={lightRef}
        intensity={40}
        distance={15}
        angle={Math.PI / 5.5}
        penumbra={0.7}
        decay={1.5}
        color="#fef08a" // Pale yellow candle/flashlight bulb color
        castShadow
      />
      {/* Dark red center ambient glow to make shadows less harsh */}
      <pointLight position={[0, 0, 1]} intensity={0.4} distance={8} color="#450a0a" />
    </>
  );
};

// Floating dust particle system
interface FloatingDustProps {
  count?: number;
}

const FloatingDust: React.FC<FloatingDustProps> = ({ count = 200 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate initial random particle array
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 12;     // x
      temp[i * 3 + 1] = (Math.random() - 0.5) * 12; // y
      temp[i * 3 + 2] = (Math.random() - 0.5) * 6;  // z
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime() * 0.05;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Drift particles slowly upwards
      positions[i * 3 + 1] += 0.003;
      // Add slight left/right wave drift
      positions[i * 3] += Math.sin(time + i) * 0.0015;

      // Wrap-around particles if they go off screen
      if (positions[i * 3 + 1] > 6) {
        positions[i * 3 + 1] = -6;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#fafaf9"
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Main canvas wrapper
export const ThreeCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#020202]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.02} />
        <FlashlightSpotlight />
        <FloatingDust count={150} />

        {/* Dark background wall geometry to catch the spotlight beam */}
        <mesh position={[0, 0, -2.5]}>
          <planeGeometry args={[25, 18]} />
          <meshStandardMaterial color="#0b0b0c" roughness={0.9} metalness={0.1} />
        </mesh>
      </Canvas>
    </div>
  );
};
export default ThreeCanvas;
