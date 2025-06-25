import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading Portfolio</h2>
        <p className="text-neutral-400">Please wait while we load the latest content...</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;