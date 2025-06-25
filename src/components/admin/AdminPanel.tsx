import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { uploadImage, deleteImage } from '../../lib/supabase';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Building, 
  GraduationCap, 
  Briefcase,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  ExternalLink,
  Award,
  Settings
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
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
  } = useStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<string | null>(null);
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddCertificate, setShowAddCertificate] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState(profile);
  const [footerForm, setFooterForm] = useState(footer);
  const [newProject, setNewProject] = useState({
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
  const [newCertificate, setNewCertificate] = useState({
    title: '',
    issuer: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    credentialUrl: '',
  });
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    current: false,
    description: [''],
    type: 'work' as 'work' | 'education' | 'internship',
  });

  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    setFooterForm(footer);
  }, [footer]);

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

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      setProfileForm({ ...profileForm, profileImage: imageUrl });
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateFooter(footerForm);
      alert('Footer updated successfully!');
    } catch (error) {
      console.error('Error updating footer:', error);
      alert('Error updating footer. Please try again.');
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProject(newProject);
      setNewProject({
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
      setShowAddProject(false);
      alert('Project added successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Error adding project. Please try again.');
    }
  };

  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCertificate(newCertificate);
      setNewCertificate({
        title: '',
        issuer: '',
        date: new Date().toISOString().split('T')[0],
        image: '',
        credentialUrl: '',
      });
      setShowAddCertificate(false);
      alert('Certificate added successfully!');
    } catch (error) {
      console.error('Error adding certificate:', error);
      alert('Error adding certificate. Please try again.');
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExperience(newExperience);
      setNewExperience({
        title: '',
        company: '',
        location: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        current: false,
        description: [''],
        type: 'work',
      });
      setShowAddExperience(false);
      alert('Experience added successfully!');
    } catch (error) {
      console.error('Error adding experience:', error);
      alert('Error adding experience. Please try again.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'experience', label: 'Experience', icon: GraduationCap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-5rem)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Settings</h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Profile Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profile Image
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={profileForm.profileImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          className="hidden"
                          id="profile-image"
                          disabled={isUploading}
                        />
                        <label
                          htmlFor="profile-image"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-4 h-4" />
                          {isUploading ? 'Uploading...' : 'Upload Image'}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={profileForm.skills.join(', ')}
                      onChange={(e) => setProfileForm({ 
                        ...profileForm, 
                        skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                      })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Years Experience
                      </label>
                      <input
                        type="text"
                        value={profileForm.yearsExperience}
                        onChange={(e) => setProfileForm({ ...profileForm, yearsExperience: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Projects Completed
                      </label>
                      <input
                        type="text"
                        value={profileForm.projectsCompleted}
                        onChange={(e) => setProfileForm({ ...profileForm, projectsCompleted: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Social Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          GitHub
                        </label>
                        <input
                          type="url"
                          value={profileForm.socialLinks.github}
                          onChange={(e) => setProfileForm({ 
                            ...profileForm, 
                            socialLinks: { ...profileForm.socialLinks, github: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={profileForm.socialLinks.linkedin}
                          onChange={(e) => setProfileForm({ 
                            ...profileForm, 
                            socialLinks: { ...profileForm.socialLinks, linkedin: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileForm.socialLinks.email}
                          onChange={(e) => setProfileForm({ 
                            ...profileForm, 
                            socialLinks: { ...profileForm.socialLinks, email: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Profile
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Projects</h3>
                  <button
                    onClick={() => setShowAddProject(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>

                {/* Add Project Form */}
                {showAddProject && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Project</h4>
                    <form onSubmit={handleAddProject} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category
                          </label>
                          <input
                            type="text"
                            value={newProject.category}
                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Short Description
                        </label>
                        <input
                          type="text"
                          value={newProject.shortDescription}
                          onChange={(e) => setNewProject({ ...newProject, shortDescription: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Main Image URL
                        </label>
                        <input
                          type="url"
                          value={newProject.image}
                          onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Technologies (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={newProject.technologies.join(', ')}
                          onChange={(e) => setNewProject({ 
                            ...newProject, 
                            technologies: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                          })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Live URL (optional)
                          </label>
                          <input
                            type="url"
                            value={newProject.liveUrl}
                            onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            GitHub URL (optional)
                          </label>
                          <input
                            type="url"
                            value={newProject.githubUrl}
                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={newProject.date}
                            onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={newProject.featured}
                            onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                            className="rounded"
                          />
                          <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Featured Project
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Project
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddProject(false)}
                          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Projects List */}
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">{project.title}</h4>
                            {project.featured && (
                              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{project.shortDescription}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {project.category} • {new Date(project.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProject(editingProject === project.id ? null : project.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this project?')) {
                                deleteProject(project.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Certificates</h3>
                  <button
                    onClick={() => setShowAddCertificate(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Certificate
                  </button>
                </div>

                {/* Add Certificate Form */}
                {showAddCertificate && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Certificate</h4>
                    <form onSubmit={handleAddCertificate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={newCertificate.title}
                            onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Issuer
                          </label>
                          <input
                            type="text"
                            value={newCertificate.issuer}
                            onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={newCertificate.date}
                            onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Credential URL (optional)
                          </label>
                          <input
                            type="url"
                            value={newCertificate.credentialUrl}
                            onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={newCertificate.image}
                          onChange={(e) => setNewCertificate({ ...newCertificate, image: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Certificate
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddCertificate(false)}
                          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Certificates List */}
                <div className="space-y-4">
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{certificate.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{certificate.issuer}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(certificate.date).toLocaleDateString()}
                          </p>
                          {certificate.credentialUrl && (
                            <a
                              href={certificate.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mt-2"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Credential
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingCertificate(editingCertificate === certificate.id ? null : certificate.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this certificate?')) {
                                deleteCertificate(certificate.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Experience</h3>
                  <button
                    onClick={() => setShowAddExperience(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </button>
                </div>

                {/* Add Experience Form */}
                {showAddExperience && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Experience</h4>
                    <form onSubmit={handleAddExperience} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={newExperience.title}
                            onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company/Institution
                          </label>
                          <input
                            type="text"
                            value={newExperience.company}
                            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={newExperience.location}
                            onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type
                          </label>
                          <select
                            value={newExperience.type}
                            onChange={(e) => setNewExperience({ ...newExperience, type: e.target.value as 'work' | 'education' | 'internship' })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          >
                            <option value="work">Work</option>
                            <option value="education">Education</option>
                            <option value="internship">Internship</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                          <input
                            type="checkbox"
                            id="current"
                            checked={newExperience.current}
                            onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                            className="rounded"
                          />
                          <label htmlFor="current" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Position
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={newExperience.startDate}
                            onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        {!newExperience.current && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={newExperience.endDate}
                              onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description (one point per line)
                        </label>
                        <textarea
                          value={newExperience.description.join('\n')}
                          onChange={(e) => setNewExperience({ 
                            ...newExperience, 
                            description: e.target.value.split('\n').filter(line => line.trim()) 
                          })}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Enter each responsibility or achievement on a new line"
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Experience
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddExperience(false)}
                          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Experience List */}
                <div className="space-y-4">
                  {experiences.map((experience) => (
                    <div key={experience.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">{experience.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              experience.type === 'work' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : experience.type === 'education'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                            }`}>
                              {experience.type}
                            </span>
                            {experience.current && (
                              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{experience.company}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {experience.location} • {new Date(experience.startDate).toLocaleDateString()} - {
                              experience.current ? 'Present' : experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'Present'
                            }
                          </p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                            {experience.description.map((desc, index) => (
                              <li key={index}>{desc}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingExperience(editingExperience === experience.id ? null : experience.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this experience?')) {
                                deleteExperience(experience.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h3>
                
                <form onSubmit={handleFooterSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Footer Text
                    </label>
                    <input
                      type="text"
                      value={footerForm.text}
                      onChange={(e) => setFooterForm({ ...footerForm, text: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Footer Links
                    </label>
                    <div className="space-y-2">
                      {footerForm.links.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Link name"
                            value={link.name}
                            onChange={(e) => {
                              const newLinks = [...footerForm.links];
                              newLinks[index] = { ...link, name: e.target.value };
                              setFooterForm({ ...footerForm, links: newLinks });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <input
                            type="url"
                            placeholder="Link URL"
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...footerForm.links];
                              newLinks[index] = { ...link, url: e.target.value };
                              setFooterForm({ ...footerForm, links: newLinks });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newLinks = footerForm.links.filter((_, i) => i !== index);
                              setFooterForm({ ...footerForm, links: newLinks });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setFooterForm({
                            ...footerForm,
                            links: [...footerForm.links, { name: '', url: '' }]
                          });
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Link
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Settings
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}