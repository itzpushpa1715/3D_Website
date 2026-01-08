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
    changePassword,
    deleteContactMessage
  } = useStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [addFormType, setAddFormType] = useState<'project' | 'certificate' | 'experience'>('project');
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
      case 'certificates':
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg md:text-xl font-semibold text-white">Certificates ({certificates.length})</h3>
              <button
                onClick={() => {
                  setAddFormType('certificate');
                  setShowAddForm(true);
                }}
                className="inline-flex items-center px-3 md:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certificate
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-neutral-800 rounded-lg p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-base md:text-lg font-semibold text-white mb-2">{cert.title}</h4>
                      <p className="text-neutral-400 text-sm mb-2">Issued by {cert.issuer}</p>
                      <p className="text-neutral-500 text-xs">{new Date(cert.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingItem({ ...cert, type: 'certificate' })}
                        className="p-2 text-neutral-400 hover:text-white transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this certificate?')) {
                            deleteCertificate(cert.id);
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
      case 'experience':
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg md:text-xl font-semibold text-white">Experience ({experiences.length})</h3>
              <button
                onClick={() => {
                  setAddFormType('experience');
                  setShowAddForm(true);
                }}
                className="inline-flex items-center px-3 md:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-neutral-800 rounded-lg p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-base md:text-lg font-semibold text-white mb-1">{exp.title}</h4>
                      <p className="text-neutral-400 text-sm mb-1">{exp.company}</p>
                      <p className="text-neutral-500 text-xs mb-2">{exp.location}</p>
                      <p className="text-neutral-500 text-xs">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.endDate || '').toLocaleDateString()}
                      </p>
                      {exp.current && <span className="inline-block mt-2 px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded">Current</span>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingItem({ ...exp, type: 'experience' })}
                        className="p-2 text-neutral-400 hover:text-white transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this experience?')) {
                            deleteExperience(exp.id);
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
                      <div className="flex-1">
                        <h4 className="text-base md:text-lg font-semibold text-white">{message.name}</h4>
                        <p className="text-neutral-400 text-sm">{message.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-neutral-500">
                          {new Date(message.date).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm('Delete this message?')) {
                              deleteContactMessage(message.id);
                            }
                          }}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

  const renderAddForm = () => {
    if (addFormType === 'project') {
      return (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData.entries());

          const projectData = {
            title: data.title as string,
            description: data.description as string,
            shortDescription: data.shortDescription as string,
            image: data.image as string,
            images: (data.images as string).split(',').map(s => s.trim()).filter(Boolean),
            technologies: (data.technologies as string).split(',').map(s => s.trim()).filter(Boolean),
            liveUrl: data.liveUrl as string,
            githubUrl: data.githubUrl as string,
            category: data.category as string,
            featured: (data.featured as unknown) === 'on',
            date: data.date as string,
          };

          if (editingItem) {
            await updateProject(editingItem.id, projectData);
            alert('Project updated!');
          } else {
            await addProject(projectData);
            alert('Project added!');
          }

          setShowAddForm(false);
          setEditingItem(null);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
            <input
              name="title"
              defaultValue={editingItem?.title || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Short Description</label>
            <input
              name="shortDescription"
              defaultValue={editingItem?.shortDescription || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
            <textarea
              name="description"
              defaultValue={editingItem?.description || ''}
              rows={3}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Image URL</label>
            <input
              name="image"
              defaultValue={editingItem?.image || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Additional Images (comma-separated)</label>
            <input
              name="images"
              defaultValue={editingItem?.images?.join(', ') || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Technologies (comma-separated)</label>
            <input
              name="technologies"
              defaultValue={editingItem?.technologies?.join(', ') || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Live URL</label>
              <input
                name="liveUrl"
                defaultValue={editingItem?.liveUrl || ''}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">GitHub URL</label>
              <input
                name="githubUrl"
                defaultValue={editingItem?.githubUrl || ''}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
              <input
                name="category"
                defaultValue={editingItem?.category || ''}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Date</label>
              <input
                name="date"
                type="date"
                defaultValue={editingItem?.date || ''}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-neutral-300">
              <input
                name="featured"
                type="checkbox"
                defaultChecked={editingItem?.featured || false}
                className="w-4 h-4"
              />
              Featured
            </label>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              {editingItem ? 'Update' : 'Add'} Project
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    } else if (addFormType === 'certificate') {
      return (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData.entries());

          const certData = {
            title: data.title as string,
            issuer: data.issuer as string,
            date: data.date as string,
            image: data.image as string,
            credentialUrl: data.credentialUrl as string,
          };

          if (editingItem) {
            await updateCertificate(editingItem.id, certData);
            alert('Certificate updated!');
          } else {
            await addCertificate(certData);
            alert('Certificate added!');
          }

          setShowAddForm(false);
          setEditingItem(null);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
            <input
              name="title"
              defaultValue={editingItem?.title || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Issuer</label>
            <input
              name="issuer"
              defaultValue={editingItem?.issuer || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Date</label>
            <input
              name="date"
              type="date"
              defaultValue={editingItem?.date || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Image URL</label>
            <input
              name="image"
              defaultValue={editingItem?.image || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Credential URL</label>
            <input
              name="credentialUrl"
              defaultValue={editingItem?.credentialUrl || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              {editingItem ? 'Update' : 'Add'} Certificate
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    } else if (addFormType === 'experience') {
      return (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData.entries());

          const expData = {
            title: data.title as string,
            company: data.company as string,
            location: data.location as string,
            startDate: data.startDate as string,
            endDate: data.endDate as string,
            current: (data.current as unknown) === 'on',
            description: (data.description as string).split('\n').filter(Boolean),
            type: data.type as 'work' | 'education' | 'internship',
          };

          if (editingItem) {
            await updateExperience(editingItem.id, expData);
            alert('Experience updated!');
          } else {
            await addExperience(expData);
            alert('Experience added!');
          }

          setShowAddForm(false);
          setEditingItem(null);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
            <input
              name="title"
              defaultValue={editingItem?.title || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Company</label>
            <input
              name="company"
              defaultValue={editingItem?.company || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
            <input
              name="location"
              defaultValue={editingItem?.location || ''}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Start Date</label>
              <input
                name="startDate"
                type="date"
                defaultValue={editingItem?.startDate || ''}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">End Date</label>
              <input
                name="endDate"
                type="date"
                defaultValue={editingItem?.endDate || ''}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Type</label>
              <select
                name="type"
                defaultValue={editingItem?.type || 'work'}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              >
                <option value="work">Work</option>
                <option value="education">Education</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-neutral-300">
                <input
                  name="current"
                  type="checkbox"
                  defaultChecked={editingItem?.current || false}
                  className="w-4 h-4"
                />
                Currently Working
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Description (one per line)</label>
            <textarea
              name="description"
              defaultValue={editingItem?.description?.join('\n') || ''}
              rows={4}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              {editingItem ? 'Update' : 'Add'} Experience
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    }

    return null;
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddForm || editingItem) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddForm(false);
              setEditingItem(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-800 rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {editingItem
                    ? `Edit ${editingItem.type || addFormType}`
                    : `Add New ${addFormType}`}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderAddForm()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;