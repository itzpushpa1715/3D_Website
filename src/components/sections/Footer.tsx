import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Footer: React.FC = () => {
  const { profile, footer } = useStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 dark:bg-neutral-900 border-t border-neutral-800 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Pushpa Koirala
            </h3>
            <p className="text-neutral-400 dark:text-neutral-400 text-sm leading-relaxed">
              Automation & Robotics Engineer passionate about creating innovative solutions 
              that bridge technology and real-world applications.
            </p>
            <div className="flex space-x-4">
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-400 transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-400 transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${profile.socialLinks.email}`}
                className="text-neutral-400 hover:text-primary-400 transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white dark:text-white">Quick Links</h4>
            <div className="space-y-2">
              {['About', 'Projects', 'Experience', 'Certificates', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block text-neutral-400 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white dark:text-white">Get In Touch</h4>
            <div className="space-y-2 text-sm">
              <p className="text-neutral-400 dark:text-neutral-400">
                📍 {profile.location}
              </p>
              <p className="text-neutral-400 dark:text-neutral-400">
                📧 {profile.socialLinks.email}
              </p>
              <p className="text-neutral-400 dark:text-neutral-400">
                💼 Available for collaborations
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 dark:border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-400 dark:text-neutral-400 text-sm mb-4 md:mb-0">
              {footer.text}
            </div>
            
            <div className="flex items-center space-x-6">
              {footer.links.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="text-neutral-400 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center text-neutral-500 dark:text-neutral-500 text-sm"
            >
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;