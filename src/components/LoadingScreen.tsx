import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-neutral-900 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-12 h-12 md:w-16 md:h-16 border-3 md:border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
        <h2 className="text-lg md:text-xl font-semibold text-white mb-2">Loading Portfolio</h2>
        <p className="text-sm md:text-base text-neutral-400 px-4">Please wait while we load the latest content...</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;