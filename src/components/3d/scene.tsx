"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

function RobotPlaceholder() {
  return (
    <mesh rotation={[0.2, 0.4, 0]}>
      <boxGeometry args={[2, 3, 1.5]} />
      <meshStandardMaterial color="#22d3ee" />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">

      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>

        <ambientLight intensity={1.2} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
        />

        <Float
          speed={2}
          rotationIntensity={1}
          floatIntensity={2}
        >
          <RobotPlaceholder />
        </Float>

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.5}
        />

      </Canvas>
    </div>
  );
}