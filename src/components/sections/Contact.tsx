import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { useStore } from '../../store/useStore';

const TerminalContact = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([
    '> Welcome to Pushpa\'s contact terminal',
    '> Type "help" for available commands',
    '> Ready to connect...',
  ]);

  const handleCommand = (cmd: string) => {
    const newOutput = [...output, `> ${cmd}`];
    
    switch (cmd.toLowerCase()) {
      case 'help':
        newOutput.push('Available commands:');
        newOutput.push('  email    - Get my email address');
        newOutput.push('  github   - Open my GitHub profile');
        newOutput.push('  linkedin - Open my LinkedIn profile');
        newOutput.push('  location - Get my current location');
        newOutput.push('  clear    - Clear terminal');
        break;
      case 'email':
        newOutput.push('📧 pushpa@example.com');
        break;
      case 'github':
        newOutput.push('🐙 Opening GitHub...');
        window.open('https://github.com/itzpushpa1715', '_blank');
        break;
      case 'linkedin':
        newOutput.push('💼 Opening LinkedIn...');
        window.open('https://www.linkedin.com/in/pushpakoirala/', '_blank');
        break;
      case 'location':
        newOutput.push('📍 Jyvaskyla, Finland');
        break;
      case 'clear':
        setOutput(['> Terminal cleared', '> Ready for new commands...']);
        setCommand('');
        return;
      default:
        newOutput.push(`Command not found: ${cmd}`);
        newOutput.push('Type "help" for available commands');
    }
    
    setOutput(newOutput);
    setCommand('');
  };

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-700 p-6 font-mono text-sm">
      <div className="flex items-center mb-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="ml-4 text-neutral-400">Terminal</div>
      </div>
      
      <div className="h-64 overflow-y-auto mb-4 text-green-400">
        {output.map((line, index) => (
          <div key={index} className="mb-1">
            {line}
          </div>
        ))}
      </div>
      
      <div className="flex items-center">
        <span className="text-green-400 mr-2">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && command.trim()) {
              handleCommand(command.trim());
            }
          }}
          className="flex-1 bg-transparent text-green-400 outline-none placeholder-green-600"
          placeholder="Type a command..."
        />
      </div>
    </div>
  );
};

const Contact: React.FC = () => {
  const { profile } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Message sent successfully! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
    <section id="contact" className="py-20 bg-neutral-900">
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
              Get In Touch
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6"></div>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Let's discuss your next automation project or collaboration opportunity
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information & Terminal */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-6 hover:border-primary-500/50 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary-600/20 rounded-lg mr-4">
                      <Mail className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Email</h3>
                      <p className="text-neutral-400">{profile.socialLinks.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-6 hover:border-primary-500/50 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary-600/20 rounded-lg mr-4">
                      <MapPin className="w-6 h-6 text-secondary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Location</h3>
                      <p className="text-neutral-400">{profile.location}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-neutral-800/50 rounded-xl border border-neutral-700 p-6 hover:border-primary-500/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center">
                      <Github className="w-8 h-8 text-neutral-400 group-hover:text-primary-400 transition-colors duration-300" />
                    </div>
                  </a>
                  
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-neutral-800/50 rounded-xl border border-neutral-700 p-6 hover:border-primary-500/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center">
                      <Linkedin className="w-8 h-8 text-neutral-400 group-hover:text-primary-400 transition-colors duration-300" />
                    </div>
                  </a>
                </div>
              </div>

              {/* Interactive Terminal */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Interactive Terminal</h3>
                <TerminalContact />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-neutral-800/50 rounded-2xl border border-neutral-700 p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary-500 focus:outline-none transition-colors duration-200"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary-500 focus:outline-none transition-colors duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary-500 focus:outline-none transition-colors duration-200"
                      placeholder="Project Collaboration"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary-500 focus:outline-none transition-colors duration-200 resize-none"
                      placeholder="Tell me about your project or idea..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:from-neutral-600 disabled:to-neutral-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center group"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;