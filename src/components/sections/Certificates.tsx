import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Certificates: React.FC = () => {
  const { certificates } = useStore();

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
    <section id="certificates" className="py-20 bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Certifications
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6"></div>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Professional certifications and achievements in automation and technology
            </p>
          </motion.div>

          {/* Certificates Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {certificates.map((certificate) => (
              <motion.div
                key={certificate.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-neutral-900/50 rounded-2xl border border-neutral-700 overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
              >
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary-600/20 to-secondary-600/20">
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-200">
                        {certificate.title}
                      </h3>
                      <p className="text-primary-400 font-semibold mb-1">
                        {certificate.issuer}
                      </p>
                    </div>
                    <div className="p-2 bg-primary-600/20 rounded-lg">
                      <Award className="w-5 h-5 text-primary-400" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-neutral-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(certificate.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                    {certificate.credentialUrl && (
                      <a
                        href={certificate.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        <span className="text-sm">Verify</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-primary-600/10 to-secondary-600/10 rounded-2xl border border-primary-500/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Continuous Learning
              </h3>
              <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
                I'm constantly updating my skills and knowledge in the rapidly evolving fields 
                of automation, robotics, and software development. Stay tuned for more certifications!
              </p>
              <div className="flex justify-center">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg">
                  <Award className="w-5 h-5 mr-2" />
                  More certifications coming soon
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Certificates;