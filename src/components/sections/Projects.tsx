import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Filter, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

const ProjectModal = ({ project, onClose }: { project: any; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-neutral-900 rounded-xl md:rounded-2xl border border-neutral-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-4 md:p-8">
            <div className="mb-6">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 md:h-64 object-cover rounded-lg md:rounded-xl mb-4 md:mb-6"
              />
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h2>
              <p className="text-neutral-400 text-base md:text-lg mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-2 md:px-3 py-1 bg-primary-600/20 text-primary-300 rounded-full text-xs md:text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                )}
                
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const { projects } = useStore();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [filter, setFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

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
    <section id="projects" className="py-12 md:py-20 bg-neutral-900">
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
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-4 md:mb-6"></div>
            <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto px-4">
              Explore my latest work in automation, robotics, and software development
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8 md:mb-12">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
              >
                <Filter className="w-4 h-4 mr-2" />
                {filter}
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-48 bg-neutral-800 rounded-lg border border-neutral-700 shadow-xl z-10"
                  >
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setFilter(category);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-neutral-700 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200 text-sm md:text-base ${
                          filter === category ? 'text-primary-400' : 'text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Project Grid */}
          <motion.div variants={containerVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-neutral-800/50 rounded-xl md:rounded-2xl border border-neutral-700 overflow-hidden hover:border-neutral-600 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 md:px-3 py-1 bg-primary-600/20 text-primary-300 rounded-full text-xs md:text-sm">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="px-2 md:px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-xs md:text-sm">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-xs md:text-sm mb-4 line-clamp-2">
                    {project.shortDescription}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 md:gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded text-xs">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-xs md:text-sm">{project.date}</span>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-neutral-400 hover:text-white transition-colors duration-200"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-neutral-400 hover:text-white transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;