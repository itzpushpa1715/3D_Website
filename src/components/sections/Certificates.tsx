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
    <section id="certificates" className="py-12 md:py-20 bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Certifications
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-4 md:mb-6"></div>
            <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto px-4">
              Professional certifications and achievements in automation and technology
            </p>
          </motion.div>

          {/* Certificates Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {certificates.map((certificate) => (
              <motion.div
                key={certificate.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-neutral-900/50 rounded-xl md:rounded-2xl border border-neutral-700 overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
              >
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary-600/20 to-secondary-600/20">
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                        {certificate.title}
                      </h3>
                      <p className="text-primary-400 font-semibold mb-1 text-sm md:text-base">
                        {certificate.issuer}
                      </p>
                    </div>
                    <div className="p-2 bg-primary-600/20 rounded-lg flex-shrink-0 ml-2">
                      <Award className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs md:text-sm text-neutral-400">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(certificate.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    {certificate.credentialUrl && (
                      <a
                        href={certificate.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors duration-200 flex-shrink-0 ml-2"
                      >
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        <span className="text-xs md:text-sm">Verify</span>
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
            className="text-center mt-12 md:mt-16"
          >
            <div className="bg-gradient-to-r from-primary-600/10 to-secondary-600/10 rounded-xl md:rounded-2xl border border-primary-500/20 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Continuous Learning
              </h3>
              <p className="text-neutral-300 mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
                I'm constantly updating my skills and knowledge in the rapidly evolving fields 
                of automation, robotics, and software development. Stay tuned for more certifications!
              </p>
              <div className="flex justify-center">
                <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg text-sm md:text-base">
                  <Award className="w-4 h-4 md:w-5 md:h-5 mr-2" />
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