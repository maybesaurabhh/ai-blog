"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function AIOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !ringRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    meshRef.current.rotation.y = t * 0.15;
    ringRef.current.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.2) * 0.1;
    ringRef.current.rotation.z = t * 0.08;
  });

  return (
    <group>
      {/* Core orb */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <MeshDistortMaterial
            color="#4f9eff"
            attach="material"
            distort={0.35}
            speed={2}
            roughness={0}
            metalness={0.1}
            opacity={0.85}
            transparent
          />
        </mesh>

        {/* Inner core glow */}
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
        </mesh>

        {/* Outer shell */}
        <mesh>
          <sphereGeometry args={[1.4, 32, 32]} />
          <meshBasicMaterial color="#4f9eff" transparent opacity={0.06} wireframe />
        </mesh>
      </Float>

      {/* Orbital ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.0, 0.012, 16, 100]} />
        <meshBasicMaterial color="#4f9eff" transparent opacity={0.4} />
      </mesh>

      {/* Second orbital ring */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[2.4, 0.008, 16, 100]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.25} />
      </mesh>

      {/* Point lights */}
      <pointLight color="#4f9eff" intensity={3} distance={6} position={[2, 2, 2]} />
      <pointLight color="#a855f7" intensity={2} distance={6} position={[-2, -1, 1]} />
      <ambientLight intensity={0.2} />
    </group>
  );
}

export default function OrbScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <AIOrb />
          <Stars radius={80} depth={50} count={800} factor={3} saturation={0} fade speed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
