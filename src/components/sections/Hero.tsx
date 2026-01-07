import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import Scene3D from '../3D/Scene3D';
import { useStore } from '../../store/useStore';

const Hero: React.FC = () => {
  const { profile } = useStore();
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageKey, setImageKey] = useState(Date.now());
  
  const titles = [
    'Automation Engineer',
    'Robotics Specialist', 
    'Innovation Creator',
    'Problem Solver'
  ];

  // Update image key when profile image changes
  useEffect(() => {
    setImageKey(Date.now());
  }, [profile.profileImage]);

  useEffect(() => {
    const currentTitle = titles[currentIndex];
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index <= currentTitle.length) {
        setDisplayText(currentTitle.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          const eraseInterval = setInterval(() => {
            setDisplayText(currentTitle.slice(0, index));
            index--;
            if (index < 0) {
              clearInterval(eraseInterval);
              setCurrentIndex((prev) => (prev + 1) % titles.length);
            }
          }, 50);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Create a unique image URL to force cache refresh
  const profileImageUrl = profile.profileImage.includes('?') 
    ? profile.profileImage 
    : `${profile.profileImage}?v=${imageKey}`;

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* 3D Background - Hidden on mobile for performance */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        <Scene3D />
      </div>

      {/* Mobile Background Gradient */}
      <div className="absolute inset-0 z-0 lg:hidden bg-gradient-to-br from-primary-900/20 via-neutral-900 to-secondary-900/20"></div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 md:mb-8 flex justify-center relative z-0"
            >
              <div className="relative z-0">
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-primary-500 shadow-2xl shadow-primary-500/30 animate-glow">
                  <img
                    key={`hero-${imageKey}`}
                    src={profileImageUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center"
                    onLoad={() => console.log('Hero image loaded:', profileImageUrl)}
                    onError={(e) => {
                      console.error('Hero image failed to load:', profileImageUrl);
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg';
                    }}
                  />
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary-400/20 animate-pulse" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-3 md:mb-4 px-4"
            >
              {profile.name}
            </motion.h1>

            {/* Dynamic Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-primary-400 mb-4 md:mb-6 h-8 sm:h-10 md:h-12 flex items-center justify-center px-4"
            >
              <span className="font-mono">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-300 max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed px-4"
            >
              {profile.bio}
            </motion.p>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-xs sm:text-sm text-neutral-400 mb-6 md:mb-8 px-4"
            >
              📍 {profile.location}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex justify-center space-x-4 sm:space-x-6 mb-8 md:mb-12 px-4"
            >
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 rounded-full bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 hover:border-primary-500 transition-all duration-300 group"
              >
                <Github className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 group-hover:text-primary-400 transition-colors duration-300" />
              </a>
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 rounded-full bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 hover:border-primary-500 transition-all duration-300 group"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 group-hover:text-primary-400 transition-colors duration-300" />
              </a>
              <a
                href={`mailto:${profile.socialLinks.email}`}
                className="p-2 sm:p-3 rounded-full bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 hover:border-primary-500 transition-all duration-300 group"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 group-hover:text-primary-400 transition-colors duration-300" />
              </a>
            </motion.div>

            {/* Explore Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              onClick={scrollToNext}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 group text-sm sm:text-base"
            >
              Explore My Work
              <ChevronDown className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block"
      >
        <div className="flex flex-col items-center text-neutral-400">
          <span className="text-sm mb-2">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-neutral-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;