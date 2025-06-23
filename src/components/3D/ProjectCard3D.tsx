import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Project3DProps {
  project: any;
  position: [number, number, number];
  onClick: () => void;
}

const Project3D: React.FC<Project3DProps> = ({ project, position, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1.0);
    }
  });

  const color = project.category === 'Automation' ? '#00D9FF' : 
               project.category === 'Web Development' ? '#8B5CF6' : '#FF6B35';

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position}>
        <RoundedBox
          ref={meshRef}
          args={[2, 1.2, 0.1]}
          radius={0.05}
          smoothness={4}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={onClick}
        >
          <meshStandardMaterial 
            color={color} 
            metalness={0.6} 
            roughness={0.3}
            transparent
            opacity={0.8}
          />
        </RoundedBox>
        
        <Text
          position={[0, 0.3, 0.06]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {project.title}
        </Text>
        
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.08}
          color="#E2E8F0"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {project.shortDescription}
        </Text>
        
        <Text
          position={[0, -0.3, 0.06]}
          fontSize={0.06}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {project.technologies.slice(0, 3).join(' • ')}
        </Text>
      </group>
    </Float>
  );
};

interface ProjectCard3DProps {
  projects: any[];
  onProjectClick: (project: any) => void;
}

const ProjectCard3D: React.FC<ProjectCard3DProps> = ({ projects, onProjectClick }) => {
  return (
    <div className="w-full h-96">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00D9FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#8B5CF6" />
        
        {projects.map((project, index) => {
          const angle = (index / projects.length) * Math.PI * 2;
          const radius = 3;
          const position: [number, number, number] = [
            Math.cos(angle) * radius,
            Math.sin(index * 0.5) * 0.5,
            Math.sin(angle) * radius
          ];
          
          return (
            <Project3D
              key={project.id}
              project={project}
              position={position}
              onClick={() => onProjectClick(project)}
            />
          );
        })}
      </Canvas>
    </div>
  );
};

export default ProjectCard3D;