import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Certificates from './components/sections/Certificates';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';
import Login from './components/admin/Login';
import AdminPanel from './components/admin/AdminPanel';
import LoadingScreen from './components/LoadingScreen';
import AIChat from './components/AIChat';
import { useStore } from './store/useStore';

const HomePage: React.FC = () => {
  const { isDarkMode, isLoading } = useStore();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-neutral-900 text-white' 
        : 'bg-white text-neutral-900'
    }`}>
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Certificates />
      <Contact />
      <Footer />
      <AIChat />
    </div>
  );
};

const AdminRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useStore();

  useEffect(() => {
    setIsAuthenticated(!!user?.isAuthenticated);
  }, [user]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminPanel />;
};

const App: React.FC = () => {
  const { isDarkMode, loadData, cleanupRealtimeSubscription } = useStore();

  useEffect(() => {
    // Initialize theme on app load
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Load data from database and setup real-time subscription
    loadData();

    // Cleanup subscription on unmount
    return () => {
      cleanupRealtimeSubscription();
    };
  }, [isDarkMode, loadData, cleanupRealtimeSubscription]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;