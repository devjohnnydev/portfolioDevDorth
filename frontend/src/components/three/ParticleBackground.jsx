import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 800 }) {
  const mesh = useRef();
  const light = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, sizes };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (mesh.current) {
      mesh.current.rotation.x = time * 0.02;
      mesh.current.rotation.y = time * 0.03;

      const positions = mesh.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.002;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }

    if (light.current) {
      light.current.position.x = Math.sin(time * 0.5) * 5;
      light.current.position.y = Math.cos(time * 0.3) * 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight ref={light} intensity={1} color="#3B82F6" distance={15} />
      <pointLight position={[5, -3, -5]} intensity={0.5} color="#8B5CF6" distance={10} />
      
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#3B82F6"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

function FloatingOrbs() {
  const group = useRef();
  
  const orbs = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
      ],
      scale: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
      color: i % 2 === 0 ? '#3B82F6' : '#8B5CF6',
    })),
    []
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (group.current) {
      group.current.children.forEach((child, i) => {
        child.position.y += Math.sin(time * orbs[i].speed + i) * 0.003;
        child.position.x += Math.cos(time * orbs[i].speed + i) * 0.002;
      });
    }
  });

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.scale, 16, 16]} />
          <meshStandardMaterial
            color={orb.color}
            transparent
            opacity={0.15}
            emissive={orb.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ParticleBackground({ className = '' }) {
  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
