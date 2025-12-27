import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FolderOpen, Award, Briefcase, MessageSquare, Settings, Plus, CreditCard as Edit, Trash2, Save, X, Upload, Eye, EyeOff, LogOut, Menu, Home } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { uploadImage, deleteImage } from '../../lib/supabase';

const AdminPanel: React.FC = () => {
  const { 
    projects, 
    certificates, 
    experiences, 
    contactMessages, 
    profile,
    footer,
    addProject, 
    updateProject, 
    deleteProject,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addExperience,
    updateExperience,
    deleteExperience,
    updateProfile,
    updateFooter,
    logout,
    changePassword
  } = useStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: Users },
    { id: 'projects', name: 'Projects', icon: FolderOpen },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'messages', name: 'Messages', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (success) {
        alert('Password changed successfully');
        setShowPasswordForm(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert('Current password is incorrect');
      }
    } catch (error) {
      alert('Failed to change password');
    }
  };

  const renderProfileForm = () => (
    <div className="space-y-6">
      <div className="bg-neutral-800 rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Profile Information</h3>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData.entries());
          
          // Handle skills as array
          const skills = (data.skills as string).split(',').map(s => s.trim()).filter(Boolean);
          
          // Handle social links
          const socialLinks = {
            github: data.github as string,
            linkedin: data.linkedin as string,
            email: data.email as string,
          };

          await updateProfile({
            ...data,
            skills,
            socialLinks,
          } as any);
          
          alert('Profile updated successfully!');
        }} className="space-y-4 md:space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
              <input
                name="name"
                defaultValue={profile.name}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
              <input
                name="title"
                defaultValue={profile.title}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
            <textarea
              name="bio"
              defaultValue={profile.bio}
              rows={4}
              className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none text-sm md:text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
              <input
                name="location"
                defaultValue={profile.location}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Profile Image URL</label>
              <div className="flex gap-2">
                <input
                  name="profileImage"
                  defaultValue={profile.profileImage}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 md:px-4 py-2 md:py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
                >
                  {isUploading ? '...' : <Upload className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Skills (comma-separated)</label>
            <input
              name="skills"
              defaultValue={profile.skills.join(', ')}
              className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Years Experience</label>
              <input
                name="yearsExperience"
                defaultValue={profile.yearsExperience}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Projects Completed</label>
              <input
                name="projectsCompleted"
                defaultValue={profile.projectsCompleted}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold text-white">Social Links</h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">GitHub URL</label>
                <input
                  name="github"
                  defaultValue={profile.socialLinks.github}
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">LinkedIn URL</label>
                <input
                  name="linkedin"
                  defaultValue={profile.socialLinks.linkedin}
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={profile.socialLinks.email}
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm md:text-base"
          >
            Update Profile
          </button>
        </form>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            try {
              const imageUrl = await handleImageUpload(file);
              const profileImageInput = document.querySelector('input[name="profileImage"]') as HTMLInputElement;
              if (profileImageInput) {
                profileImageInput.value = imageUrl;
              }
            } catch (error) {
              alert('Failed to upload image');
            }
          }
        }}
      />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileForm();
      case 'projects':
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg md:text-xl font-semibold text-white">Projects ({projects.length})</h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-3 md:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-neutral-800 rounded-lg p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base md:text-lg font-semibold text-white mb-2">{project.title}</h4>
                      <p className="text-neutral-400 text-sm mb-2 line-clamp-2">{project.shortDescription}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary-600/20 text-primary-300 rounded text-xs">
                          {project.category}
                        </span>
                        {project.featured && (
                          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded text-xs">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingItem(project)}
                        className="p-2 text-neutral-400 hover:text-white transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this project?')) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-semibold text-white">Contact Messages ({contactMessages.length})</h3>
            
            <div className="space-y-4">
              {contactMessages.length > 0 ? (
                contactMessages.map((message) => (
                  <div key={message.id} className="bg-neutral-800 rounded-lg p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                      <div>
                        <h4 className="text-base md:text-lg font-semibold text-white">{message.name}</h4>
                        <p className="text-neutral-400 text-sm">{message.email}</p>
                      </div>
                      <span className="text-xs text-neutral-500">
                        {new Date(message.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h5 className="text-sm md:text-base font-medium text-white mb-2">{message.subject}</h5>
                    <p className="text-neutral-300 text-sm leading-relaxed">{message.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 md:py-12">
                  <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-neutral-500 mx-auto mb-4" />
                  <p className="text-neutral-400 text-sm md:text-base">No messages yet</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-neutral-800 rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Account Settings</h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="inline-flex items-center px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
                >
                  {showPasswordForm ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showPasswordForm ? 'Hide' : 'Change'} Password
                </button>
                
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to logout?')) {
                      logout();
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 ml-4 text-sm md:text-base"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>

              <AnimatePresence>
                {showPasswordForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handlePasswordChange}
                    className="mt-6 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none text-sm md:text-base"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="px-4 md:px-6 py-2 md:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
                    >
                      Update Password
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      default:
        return <div className="text-white">Content for {activeTab}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-neutral-800 border-r border-neutral-700 lg:translate-x-0"
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-neutral-700">
          <h1 className="text-lg md:text-xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 md:p-6">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors duration-200 text-sm md:text-base ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-neutral-700">
            <a
              href="/"
              className="w-full flex items-center px-3 md:px-4 py-2 md:py-3 text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
            >
              <Home className="w-4 h-4 md:w-5 md:h-5 mr-3" />
              Back to Site
            </a>
          </div>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-neutral-800 border-b border-neutral-700 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-neutral-400 hover:text-white mr-4"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-lg md:text-xl font-semibold text-white capitalize">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h2>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;