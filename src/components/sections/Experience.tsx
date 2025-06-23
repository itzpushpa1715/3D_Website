import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Building, GraduationCap, Briefcase } from 'lucide-react';
import TimelineScene from '../3D/TimelineScene';
import { useStore } from '../../store/useStore';

const Experience: React.FC = () => {
  const { experiences } = useStore();
  
  const sortedExperiences = [...experiences].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="w-5 h-5" />;
      case 'work':
        return <Briefcase className="w-5 h-5" />;
      case 'internship':
        return <Building className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'education':
        return 'from-primary-500 to-primary-600';
      case 'work':
        return 'from-secondary-500 to-secondary-600';
      case 'internship':
        return 'from-accent-500 to-accent-600';
      default:
        return 'from-neutral-500 to-neutral-600';
    }
  };

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
    <section id="experience" className="py-20 bg-neutral-800">
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
              Experience & Education
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6"></div>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              My journey through education and professional experience
            </p>
          </motion.div>

          {/* 3D Timeline */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="bg-neutral-900/50 rounded-2xl border border-neutral-700 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                  Interactive Timeline
                </h3>
                <TimelineScene />
              </div>
            </div>
          </motion.div>

          {/* Experience Cards */}
          <div className="space-y-8">
            {sortedExperiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                variants={itemVariants}
                className="bg-neutral-900/50 rounded-2xl border border-neutral-700 overflow-hidden hover:border-neutral-600 transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getColor(experience.type)} text-white mr-3`}>
                          {getIcon(experience.type)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{experience.title}</h3>
                          <p className="text-primary-400 font-semibold">{experience.company}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {experience.location}
                        </div>
                      </div>
                    </div>
                    
                    {experience.current && (
                      <div className="lg:ml-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Current
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {experience.description.map((item, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-neutral-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;