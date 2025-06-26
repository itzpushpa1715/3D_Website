import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Box, Text } from '@react-three/drei';
import { useStore } from '../../store/useStore';

const SkillOrb = ({ skill, position, color }: { skill: string; position: [number, number, number]; color: string }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        <Text
          fontSize={0.1}
          position={[-skill.length * 0.05, -0.5, 0]}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {skill}
        </Text>
      </group>
    </Float>
  );
};

const About3DWorkspace = () => {
  const { profile } = useStore();
  const skillColors = ['#00D9FF', '#8B5CF6', '#FF6B35', '#10B981', '#F59E0B', '#EF4444'];
  
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas camera={{ position: [5, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00D9FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#8B5CF6" />
        
        {/* Desktop/Workspace */}
        <Box position={[0, -1, 0]} args={[4, 0.1, 2]}>
          <meshStandardMaterial color="#374151" />
        </Box>
        
        {/* Monitor */}
        <Box position={[0, 0, -0.8]} args={[2, 1.2, 0.05]}>
          <meshStandardMaterial color="#1F2937" />
        </Box>
        
        {/* Skills as floating orbs */}
        {profile.skills.slice(0, 6).map((skill, index) => {
          const angle = (index / 6) * Math.PI * 2;
          const radius = 2.5;
          const position: [number, number, number] = [
            Math.cos(angle) * radius,
            Math.sin(angle) * 0.5 + 1,
            Math.sin(angle) * radius
          ];
          
          return (
            <SkillOrb
              key={skill}
              skill={skill}
              position={position}
              color={skillColors[index]}
            />
          );
        })}
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={1}
          maxDistance={10}
          minDistance={3}
        />
      </Canvas>
    </div>
  );
};

const About: React.FC = () => {
  const { profile } = useStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className="py-12 md:py-20 bg-neutral-900 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-white mb-4">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-4 md:mb-6"></div>
            <p className="text-lg md:text-xl text-neutral-400 dark:text-neutral-400 max-w-3xl mx-auto px-4">
              Bridging automation and innovation through cutting-edge technology
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div variants={itemVariants} className="space-y-4 md:space-y-6 order-2 lg:order-1">
              <div className="prose prose-lg prose-neutral-300 max-w-none">
                <p className="text-neutral-300 dark:text-neutral-300 leading-relaxed text-sm md:text-base">
                  {profile.bio}
                </p>
                
                <p className="text-neutral-300 dark:text-neutral-300 leading-relaxed text-sm md:text-base">
                  Currently pursuing my degree in Automation and Robotics Engineering at JAMK University 
                  of Applied Sciences, I'm passionate about creating intelligent systems that solve 
                  real-world problems. My expertise spans from low-level PLC programming to high-level 
                  application development.
                </p>
                
                <p className="text-neutral-300 dark:text-neutral-300 leading-relaxed text-sm md:text-base">
                  When I'm not coding or designing automation solutions, you'll find me exploring 
                  the latest trends in robotics, contributing to open-source projects, or experimenting 
                  with 3D modeling and CAD design.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 md:gap-8 pt-6 md:pt-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary-400 mb-2">{profile.yearsExperience}</div>
                  <div className="text-neutral-400 dark:text-neutral-400 text-sm md:text-base">Years Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-secondary-400 mb-2">{profile.projectsCompleted}</div>
                  <div className="text-neutral-400 dark:text-neutral-400 text-sm md:text-base">Projects Completed</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - 3D Workspace */}
            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <div className="bg-neutral-800/50 dark:bg-neutral-800/50 rounded-xl md:rounded-2xl border border-neutral-700 dark:border-neutral-700 overflow-hidden">
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-white dark:text-white mb-4 text-center">
                    Interactive Skills Workspace
                  </h3>
                  <About3DWorkspace />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Core Skills Grid */}
          <motion.div variants={itemVariants} className="mt-16 md:mt-20">
            <h3 className="text-xl md:text-2xl font-bold text-white dark:text-white text-center mb-8 md:mb-12">Core Competencies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {profile.skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-neutral-800/50 dark:bg-neutral-800/50 rounded-lg md:rounded-xl p-4 md:p-6 text-center border border-neutral-700 dark:border-neutral-700 hover:border-primary-500 transition-all duration-300 group min-h-[80px] md:min-h-[100px] flex items-center justify-center"
                >
                  <div className="text-sm md:text-lg font-semibold text-white dark:text-white group-hover:text-primary-400 transition-colors duration-300">
                    {skill}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;