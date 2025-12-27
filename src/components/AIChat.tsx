import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Pushpa's AI assistant. I can help you learn more about his experience, projects, and skills. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Get current data from store for dynamic responses
    const { profile, projects, experiences, certificates } = useStore.getState();
    
    if (message.includes('experience') || message.includes('work') || message.includes('job')) {
      const currentExperience = experiences.find(exp => exp.current);
      const workExperiences = experiences.filter(exp => exp.type === 'work' || exp.type === 'internship');
      
      let response = `${profile.name} is currently ${currentExperience ? currentExperience.title + ' at ' + currentExperience.company : 'studying Automation and Robotics Engineering'}.`;
      
      if (workExperiences.length > 0) {
        response += ` He has ${workExperiences.length} professional experience${workExperiences.length > 1 ? 's' : ''} including ${workExperiences.map(exp => exp.title).join(', ')}.`;
      }
      
      return response + " His expertise includes PLC programming, industrial automation, and control systems.";
    }
    
    if (message.includes('skill') || message.includes('technology') || message.includes('programming')) {
      const skills = profile.skills.slice(0, 6).join(', ');
      return `${profile.name}'s core skills include ${skills}. He specializes in industrial automation, robotics, and intelligent control systems with ${profile.yearsExperience} years of experience and ${profile.projectsCompleted} projects completed.`;
    }
    
    if (message.includes('project') || message.includes('portfolio')) {
      const featuredProjects = projects.filter(p => p.featured);
      const projectCategories = [...new Set(projects.map(p => p.category))];
      
      let response = `${profile.name} has worked on ${projects.length} project${projects.length > 1 ? 's' : ''} across ${projectCategories.join(', ')}.`;
      
      if (featuredProjects.length > 0) {
        response += ` Featured projects include ${featuredProjects.map(p => p.title).slice(0, 3).join(', ')}.`;
      }
      
      return response + " His projects showcase expertise in both automation hardware and software development.";
    }
    
    if (message.includes('education') || message.includes('study') || message.includes('university')) {
      const education = experiences.find(exp => exp.type === 'education');
      
      if (education) {
        return `${profile.name} is ${education.current ? 'currently pursuing' : 'completed'} ${education.title} at ${education.company} in ${education.location}. ${education.current ? 'He is focused on advanced automation systems and robotics.' : ''}`;
      }
      
      return `${profile.name} is studying Automation and Robotics Engineering, focused on advanced automation systems and robotics.`;
    }
    
    if (message.includes('location') || message.includes('where') || message.includes('finland')) {
      return `${profile.name} is currently based in ${profile.location}. Finland is known for its excellent engineering education and innovative technology sector.`;
    }
    
    if (message.includes('contact') || message.includes('email') || message.includes('reach')) {
      return `You can contact ${profile.name} through the contact form on this website, or reach him directly at ${profile.socialLinks.email}. He's also active on LinkedIn and GitHub - you can find the links in the contact section.`;
    }
    
    if (message.includes('automation') || message.includes('plc') || message.includes('robotics')) {
      const automationSkills = profile.skills.filter(skill => 
        skill.toLowerCase().includes('plc') || 
        skill.toLowerCase().includes('automation') || 
        skill.toLowerCase().includes('tia')
      );
      
      let response = `${profile.name} specializes in industrial automation and robotics.`;
      
      if (automationSkills.length > 0) {
        response += ` He has experience with ${automationSkills.join(', ')}.`;
      }
      
      return response + " His focus is on creating intelligent automation solutions for real-world applications.";
    }
    
    if (message.includes('certificate') || message.includes('certification')) {
      if (certificates.length > 0) {
        const certList = certificates.map(cert => `${cert.title} from ${cert.issuer}`).slice(0, 3).join(', ');
        return `${profile.name} has earned ${certificates.length} certification${certificates.length > 1 ? 's' : ''} including ${certList}. These certifications validate his expertise in automation technologies.`;
      }
      
      return `${profile.name} is continuously working on earning certifications to validate his expertise in automation and technology.`;
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello! I'm here to help you learn more about ${profile.name}. Feel free to ask about his experience, projects, skills, or anything else you'd like to know!`;
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return `You're welcome! Is there anything else you'd like to know about ${profile.name}'s background, projects, or expertise?`;
    }
    
    // Default responses for unmatched queries
    const defaultResponses = [
      `That's an interesting question! You can find more detailed information about ${profile.name} in the different sections of this portfolio. Is there something specific you'd like to know about his experience or projects?`,
      `I'd be happy to help you learn more about ${profile.name}! Try asking about his skills, projects, education, or experience in automation and robotics.`,
      `Great question! ${profile.name} has a diverse background in automation engineering. Feel free to ask about his technical skills, projects, or educational background.`,
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-40 w-[calc(100vw-2rem)] max-w-80 sm:w-96 h-80 md:h-96 bg-neutral-900 border border-neutral-700 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-xs opacity-90">Ask me about {useStore.getState().profile.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 h-48 md:h-64">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isBot 
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white' 
                        : 'bg-neutral-700 text-neutral-300'
                    }`}>
                      {message.isBot ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    </div>
                    <div className={`px-2 md:px-3 py-1 md:py-2 rounded-xl md:rounded-2xl text-xs md:text-sm ${
                      message.isBot
                        ? 'bg-neutral-800 text-neutral-200'
                        : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-neutral-800 px-2 md:px-3 py-1 md:py-2 rounded-xl md:rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 md:p-4 border-t border-neutral-700">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask me about ${useStore.getState().profile.name}...`}
                  className="flex-1 px-2 md:px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary-500 focus:outline-none text-xs md:text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="px-2 md:px-3 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:from-neutral-600 disabled:to-neutral-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;