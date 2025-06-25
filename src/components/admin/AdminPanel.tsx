import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  FolderOpen, 
  Award, 
  Briefcase, 
  LogOut, 
  Save, 
  Upload,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { uploadImage, deleteImage, isSupabaseConfigured } from '../../lib/supabase';

const AdminPanel: React.FC = () => {
  const { 
    profile, 
    projects, 
    certificates, 
    experiences, 
    footer,
    updateProfile, 
    addProject, 
    updateProject, 
    deleteProject,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addExperience,
    updateExperience,
    deleteExperience,
    updateFooter,
    logout,
    loadData
  } = useStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState(profile);

  // Update profile form when profile changes from store
  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    image: '',
    images: [''],
    technologies: [''],
    liveUrl: '',
    githubUrl: '',
    category: '',
    featured: false,
    date: new Date().toISOString().split('T')[0],
  });

  // Certificate form state
  const [certificateForm, setCertificateForm] = useState({
    title: '',
    issuer: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    credentialUrl: '',
  });

  // Experience form state
  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    current: false,
    description: [''],
    type: 'work' as 'work' | 'education' | 'internship',
  });

  // Footer form state
  const [footerForm, setFooterForm] = useState(footer);

  // Edit states
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<string | null>(null);
  const [editingExperience, setEditingExperience] = useState<string | null>(null);

  // Update footer form when footer changes from store
  useEffect(() => {
    setFooterForm(footer);
  }, [footer]);

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await uploadImage(file);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      showMessage('Supabase is not configured. Image uploads are not available. Please connect to Supabase to enable image uploads.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      showMessage('Uploading image...', 'success');
      
      const imageUrl = await handleImageUpload(file);
      
      // Only update if we got a valid persistent URL (not a blob URL)
      if (imageUrl && !imageUrl.startsWith('blob:')) {
        const updatedProfile = { ...profileForm, profileImage: imageUrl };
        
        // Update form state immediately
        setProfileForm(updatedProfile);
        
        // Save to database and update store
        await updateProfile(updatedProfile);
        
        showMessage('Profile image updated successfully!', 'success');
      } else {
        showMessage('Failed to upload image. Please try again.', 'error');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('Error uploading image. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile(profileForm);
      showMessage('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Profile update error:', error);
      showMessage('Error updating profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      await loadData();
      showMessage('Data refreshed successfully!', 'success');
    } catch (error) {
      showMessage('Error refreshing data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editingProject) {
        await updateProject(editingProject, projectForm);
        setEditingProject(null);
        showMessage('Project updated successfully!');
      } else {
        await addProject(projectForm);
        showMessage('Project added successfully!');
      }
      
      // Reset form
      setProjectForm({
        title: '',
        description: '',
        shortDescription: '',
        image: '',
        images: [''],
        technologies: [''],
        liveUrl: '',
        githubUrl: '',
        category: '',
        featured: false,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      showMessage('Error saving project', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editingCertificate) {
        await updateCertificate(editingCertificate, certificateForm);
        setEditingCertificate(null);
        showMessage('Certificate updated successfully!');
      } else {
        await addCertificate(certificateForm);
        showMessage('Certificate added successfully!');
      }
      
      // Reset form
      setCertificateForm({
        title: '',
        issuer: '',
        date: new Date().toISOString().split('T')[0],
        image: '',
        credentialUrl: '',
      });
    } catch (error) {
      showMessage('Error saving certificate', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editingExperience) {
        await updateExperience(editingExperience, experienceForm);
        setEditingExperience(null);
        showMessage('Experience updated successfully!');
      } else {
        await addExperience(experienceForm);
        showMessage('Experience added successfully!');
      }
      
      // Reset form
      setExperienceForm({
        title: '',
        company: '',
        location: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        current: false,
        description: [''],
        type: 'work',
      });
    } catch (error) {
      showMessage('Error saving experience', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateFooter(footerForm);
      showMessage('Footer updated successfully!');
    } catch (error) {
      showMessage('Error updating footer', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'projects', name: 'Projects', icon: FolderOpen },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <div className="bg-neutral-800 border-b border-neutral-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-6 py-3 text-center text-white ${
            messageType === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {message}
        </motion.div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-neutral-800 min-h-screen p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-white mb-8">Profile Management</h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Profile Image */}
                <div className="bg-neutral-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Profile Image</h3>
                  
                  {/* Supabase Configuration Warning */}
                  {!isSupabaseConfigured() && (
                    <div className="mb-4 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-200 text-sm font-medium">Supabase Not Configured</p>
                        <p className="text-yellow-300 text-sm mt-1">
                          Image uploads are disabled. Please connect to Supabase to enable image upload functionality.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-500">
                      <img
                        src={profileForm.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        key={`admin-${profileForm.profileImage}-${Date.now()}`}
                        onLoad={() => console.log('Admin profile image loaded:', profileForm.profileImage)}
                        onError={(e) => {
                          console.error('Admin profile image failed to load:', profileForm.profileImage);
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg';
                        }}
                      />
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || !isSupabaseConfigured()}
                        className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isLoading ? 'Uploading...' : 'Upload New Image'}
                      </button>
                      <p className="text-sm text-neutral-400 mt-2">
                        {isSupabaseConfigured() 
                          ? 'Changes will be visible immediately after upload'
                          : 'Image upload requires Supabase configuration'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="bg-neutral-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={profileForm.title}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileForm.socialLinks.email}
                        onChange={(e) => setProfileForm(prev => ({ 
                          ...prev, 
                          socialLinks: { ...prev.socialLinks, email: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-neutral-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Skills</h3>
                  <div className="space-y-3">
                    {profileForm.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const newSkills = [...profileForm.skills];
                            newSkills[index] = e.target.value;
                            setProfileForm(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills = profileForm.skills.filter((_, i) => i !== index);
                            setProfileForm(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setProfileForm(prev => ({ ...prev, skills: [...prev.skills, ''] }));
                      }}
                      className="flex items-center px-4 py-2 text-primary-400 hover:text-primary-300 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-neutral-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Social Links</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">GitHub</label>
                      <input
                        type="url"
                        value={profileForm.socialLinks.github}
                        onChange={(e) => setProfileForm(prev => ({ 
                          ...prev, 
                          socialLinks: { ...prev.socialLinks, github: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={profileForm.socialLinks.linkedin}
                        onChange={(e) => setProfileForm(prev => ({ 
                          ...prev, 
                          socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="max-w-6xl">
              <h2 className="text-3xl font-bold text-white mb-8">Projects Management</h2>
              
              {/* Existing Projects */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Existing Projects</h3>
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-neutral-800 rounded-xl p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                          <p className="text-neutral-400">{project.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setProjectForm(project);
                            setEditingProject(project.id);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Project Form */}
              <div className="bg-neutral-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                
                <form onSubmit={handleProjectSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
                      <input
                        type="text"
                        value={projectForm.category}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Short Description</label>
                    <input
                      type="text"
                      value={projectForm.shortDescription}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Full Description</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Main Image URL</label>
                      <input
                        type="url"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Date</label>
                      <input
                        type="date"
                        value={projectForm.date}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Live URL (Optional)</label>
                      <input
                        type="url"
                        value={projectForm.liveUrl}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, liveUrl: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">GitHub URL (Optional)</label>
                      <input
                        type="url"
                        value={projectForm.githubUrl}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Technologies</label>
                    <div className="space-y-3">
                      {projectForm.technologies.map((tech, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => {
                              const newTech = [...projectForm.technologies];
                              newTech[index] = e.target.value;
                              setProjectForm(prev => ({ ...prev, technologies: newTech }));
                            }}
                            className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newTech = projectForm.technologies.filter((_, i) => i !== index);
                              setProjectForm(prev => ({ ...prev, technologies: newTech }));
                            }}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setProjectForm(prev => ({ ...prev, technologies: [...prev.technologies, ''] }));
                        }}
                        className="flex items-center px-4 py-2 text-primary-400 hover:text-primary-300 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Technology
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 bg-neutral-900 border-neutral-600 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-neutral-300">
                      Featured Project
                    </label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
                    </button>
                    
                    {editingProject && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(null);
                          setProjectForm({
                            title: '',
                            description: '',
                            shortDescription: '',
                            image: '',
                            images: [''],
                            technologies: [''],
                            liveUrl: '',
                            githubUrl: '',
                            category: '',
                            featured: false,
                            date: new Date().toISOString().split('T')[0],
                          });
                        }}
                        className="px-6 py-3 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="max-w-6xl">
              <h2 className="text-3xl font-bold text-white mb-8">Certificates Management</h2>
              
              {/* Existing Certificates */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Existing Certificates</h3>
                <div className="grid gap-4">
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="bg-neutral-800 rounded-xl p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={certificate.image}
                          alt={certificate.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-white">{certificate.title}</h4>
                          <p className="text-neutral-400">{certificate.issuer}</p>
                          <p className="text-neutral-500 text-sm">{certificate.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setCertificateForm(certificate);
                            setEditingCertificate(certificate.id);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCertificate(certificate.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Certificate Form */}
              <div className="bg-neutral-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
                </h3>
                
                <form onSubmit={handleCertificateSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={certificateForm.title}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Issuer</label>
                      <input
                        type="text"
                        value={certificateForm.issuer}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, issuer: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Date</label>
                      <input
                        type="date"
                        value={certificateForm.date}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={certificateForm.image}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Credential URL (Optional)</label>
                    <input
                      type="url"
                      value={certificateForm.credentialUrl}
                      onChange={(e) => setCertificateForm(prev => ({ ...prev, credentialUrl: e.target.value }))}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : editingCertificate ? 'Update Certificate' : 'Add Certificate'}
                    </button>
                    
                    {editingCertificate && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCertificate(null);
                          setCertificateForm({
                            title: '',
                            issuer: '',
                            date: new Date().toISOString().split('T')[0],
                            image: '',
                            credentialUrl: '',
                          });
                        }}
                        className="px-6 py-3 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="max-w-6xl">
              <h2 className="text-3xl font-bold text-white mb-8">Experience Management</h2>
              
              {/* Existing Experiences */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Existing Experience</h3>
                <div className="grid gap-4">
                  {experiences.map((experience) => (
                    <div key={experience.id} className="bg-neutral-800 rounded-xl p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          experience.type === 'education' ? 'bg-primary-600/20' :
                          experience.type === 'work' ? 'bg-secondary-600/20' : 'bg-accent-600/20'
                        }`}>
                          {experience.type === 'education' ? '🎓' : 
                           experience.type === 'work' ? '💼' : '🏢'}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{experience.title}</h4>
                          <p className="text-neutral-400">{experience.company}</p>
                          <p className="text-neutral-500 text-sm">
                            {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setExperienceForm(experience);
                            setEditingExperience(experience.id);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteExperience(experience.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Experience Form */}
              <div className="bg-neutral-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                </h3>
                
                <form onSubmit={handleExperienceSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={experienceForm.title}
                        onChange={(e) => setExperienceForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Company/Institution</label>
                      <input
                        type="text"
                        value={experienceForm.company}
                        onChange={(e) => setExperienceForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={experienceForm.location}
                        onChange={(e) => setExperienceForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Type</label>
                      <select
                        value={experienceForm.type}
                        onChange={(e) => setExperienceForm(prev => ({ ...prev, type: e.target.value as 'work' | 'education' | 'internship' }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      >
                        <option value="work">Work</option>
                        <option value="education">Education</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={experienceForm.startDate}
                        onChange={(e) => setExperienceForm(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">End Date</label>
                      <input
                        type="date"
                        value={experienceForm.endDate}
                        onChange={(e) => setExperienceForm(prev => ({ ...prev, endDate: e.target.value }))}
                        disabled={experienceForm.current}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="current"
                      checked={experienceForm.current}
                      onChange={(e) => setExperienceForm(prev => ({ 
                        ...prev, 
                        current: e.target.checked,
                        endDate: e.target.checked ? '' : prev.endDate
                      }))}
                      className="w-4 h-4 text-primary-600 bg-neutral-900 border-neutral-600 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="current" className="ml-2 text-sm text-neutral-300">
                      Currently working/studying here
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                    <div className="space-y-3">
                      {experienceForm.description.map((desc, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={desc}
                            onChange={(e) => {
                              const newDesc = [...experienceForm.description];
                              newDesc[index] = e.target.value;
                              setExperienceForm(prev => ({ ...prev, description: newDesc }));
                            }}
                            className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                            placeholder="Describe your responsibilities or achievements"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newDesc = experienceForm.description.filter((_, i) => i !== index);
                              setExperienceForm(prev => ({ ...prev, description: newDesc }));
                            }}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setExperienceForm(prev => ({ ...prev, description: [...prev.description, ''] }));
                        }}
                        className="flex items-center px-4 py-2 text-primary-400 hover:text-primary-300 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Description Point
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : editingExperience ? 'Update Experience' : 'Add Experience'}
                    </button>
                    
                    {editingExperience && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExperience(null);
                          setExperienceForm({
                            title: '',
                            company: '',
                            location: '',
                            startDate: new Date().toISOString().split('T')[0],
                            endDate: '',
                            current: false,
                            description: [''],
                            type: 'work',
                          });
                        }}
                        className="px-6 py-3 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>
              
              <form onSubmit={handleFooterSubmit} className="space-y-6">
                {/* Footer Settings */}
                <div className="bg-neutral-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Footer Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Footer Text</label>
                      <input
                        type="text"
                        value={footerForm.text}
                        onChange={(e) => setFooterForm(prev => ({ ...prev, text: e.target.value }))}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                        placeholder="© 2024 Your Name. All rights reserved."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Footer Links</label>
                      <div className="space-y-3">
                        {footerForm.links.map((link, index) => (
                          <div key={index} className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={link.name}
                              onChange={(e) => {
                                const newLinks = [...footerForm.links];
                                newLinks[index] = { ...newLinks[index], name: e.target.value };
                                setFooterForm(prev => ({ ...prev, links: newLinks }));
                              }}
                              className="px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                              placeholder="Link name"
                            />
                            <div className="flex items-center space-x-2">
                              <input
                                type="url"
                                value={link.url}
                                onChange={(e) => {
                                  const newLinks = [...footerForm.links];
                                  newLinks[index] = { ...newLinks[index], url: e.target.value };
                                  setFooterForm(prev => ({ ...prev, links: newLinks }));
                                }}
                                className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                                placeholder="Link URL"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newLinks = footerForm.links.filter((_, i) => i !== index);
                                  setFooterForm(prev => ({ ...prev, links: newLinks }));
                                }}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setFooterForm(prev => ({ 
                              ...prev, 
                              links: [...prev.links, { name: '', url: '' }] 
                            }));
                          }}
                          className="flex items-center px-4 py-2 text-primary-400 hover:text-primary-300 transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Footer Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;