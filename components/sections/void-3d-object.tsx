"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";

/** Yavaşça dönen, yüzeyi dalgalanan ana çekirdek. */
function Core() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.15;
      ref.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.4, 12]} />
        <MeshDistortMaterial
          color="#8B5CF6"
          emissive="#3B82F6"
          emissiveIntensity={0.25}
          roughness={0.15}
          metalness={0.6}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

/** Etrafını saran ince tel kafes (derinlik hissi). */
function Wire() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.1;
  });
  return (
    <mesh ref={ref} scale={1.9}>
      <icosahedronGeometry args={[1.4, 1]} />
      <meshBasicMaterial color="#3B82F6" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

export default function Void3DObject() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={80} color="#8B5CF6" />
        <pointLight position={[-5, -3, 2]} intensity={60} color="#3B82F6" />
        <pointLight position={[0, 3, -4]} intensity={40} color="#ffffff" />
        <Core />
        <Wire />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          rotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  );
}
