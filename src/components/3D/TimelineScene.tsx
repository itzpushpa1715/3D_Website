import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

const TimelineNode = ({ position, experience, index }: { 
  position: [number, number, number]; 
  experience: any; 
  index: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
    }
  });

  const color = experience.type === 'education' ? '#00D9FF' : 
                experience.type === 'work' ? '#8B5CF6' : '#FF6B35';

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        
        <Text
          position={[1, 0, 0]}
          fontSize={0.2}
          color={color}
          anchorX="left"
          anchorY="middle"
          maxWidth={3}
        >
          {experience.title}
        </Text>
        
        <Text
          position={[1, -0.3, 0]}
          fontSize={0.15}
          color="#94A3B8"
          anchorX="left"
          anchorY="middle"
          maxWidth={3}
        >
          {experience.company} • {experience.location}
        </Text>
        
        <Text
          position={[1, -0.5, 0]}
          fontSize={0.12}
          color="#64748B"
          anchorX="left"
          anchorY="middle"
          maxWidth={3}
        >
          {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
        </Text>
      </Float>
    </group>
  );
};

const TimelineConnector = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#334155" linewidth={2} />
    </line>
  );
};

const TimelineScene: React.FC = () => {
  const { experiences } = useStore();
  const sortedExperiences = [...experiences].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="w-full h-96">
      <Canvas camera={{ position: [5, 2, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#00D9FF" />
        <pointLight position={[-10, 5, 5]} intensity={0.6} color="#8B5CF6" />
        
        {sortedExperiences.map((experience, index) => {
          const yPosition = (sortedExperiences.length - index - 1) * 2 - 2;
          const position: [number, number, number] = [0, yPosition, 0];
          
          return (
            <React.Fragment key={experience.id}>
              <TimelineNode 
                position={position} 
                experience={experience} 
                index={index}
              />
              {index < sortedExperiences.length - 1 && (
                <TimelineConnector 
                  start={position}
                  end={[0, yPosition - 2, 0]}
                />
              )}
            </React.Fragment>
          );
        })}
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={15}
          minDistance={5}
        />
      </Canvas>
    </div>
  );
};

export default TimelineScene;