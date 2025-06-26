import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleTheme, user } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('mobile-nav');
      const button = document.getElementById('mobile-menu-button');
      if (isOpen && nav && button && !nav.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-neutral-900/95 dark:bg-neutral-900/95 backdrop-blur-lg border-b border-neutral-800 dark:border-neutral-800'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0 z-50"
            >
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#home');
                }}
                className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"
              >
                PK
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6 lg:space-x-8">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item.href);
                    }}
                    className="text-neutral-300 dark:text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-sm font-medium relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-200 group-hover:w-full"></span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Theme Toggle & Admin */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-neutral-800 dark:bg-neutral-800 hover:bg-neutral-700 dark:hover:bg-neutral-700 transition-colors duration-200"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-400" />
                )}
              </motion.button>
              
              <motion.a
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                href="/admin"
                className="p-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors duration-200 group"
                title="Admin Panel"
              >
                <Shield className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
              </motion.a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2 z-50">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-neutral-800/90 dark:bg-neutral-800/90 hover:bg-neutral-700/90 dark:hover:bg-neutral-700/90 transition-colors duration-200 backdrop-blur-sm"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-400" />
                )}
              </button>
              
              <a
                href="/admin"
                className="p-2 rounded-lg bg-primary-600/90 hover:bg-primary-700/90 transition-colors duration-200 backdrop-blur-sm"
              >
                <Shield className="w-4 h-4 text-white" />
              </a>
              
              <button
                id="mobile-menu-button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-neutral-800/90 dark:bg-neutral-800/90 hover:bg-neutral-700/90 dark:hover:bg-neutral-700/90 transition-colors duration-200 backdrop-blur-sm"
                aria-label="Toggle mobile menu"
              >
                {isOpen ? (
                  <X className="w-5 h-5 text-white dark:text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white dark:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-neutral-900/95 backdrop-blur-lg border-l border-neutral-800 z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                  <h2 className="text-lg font-semibold text-white">Menu</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="px-6 space-y-2">
                    {navItems.map((item, index) => (
                      <motion.a
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollTo(item.href);
                        }}
                        className="flex items-center px-4 py-3 text-neutral-300 hover:text-primary-400 hover:bg-neutral-800/50 rounded-lg transition-all duration-200 text-base font-medium"
                      >
                        {item.name}
                      </motion.a>
                    ))}
                    
                    <motion.a
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.05 }}
                      href="/admin"
                      className="flex items-center px-4 py-3 text-primary-400 hover:text-primary-300 hover:bg-neutral-800/50 rounded-lg transition-all duration-200 text-base font-medium"
                    >
                      <Shield className="w-4 h-4 mr-3" />
                      Admin Panel
                    </motion.a>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-800">
                  <p className="text-xs text-neutral-500 text-center">
                    © 2024 Pushpa Koirala
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;