import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Award, 
  FolderOpen, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  ExternalLink,
  Github,
  Calendar,
  MapPin,
  Building,
  GraduationCap,
  Mail,
  Phone,
  Globe,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader,
  Key,
  Inbox,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { uploadImage, deleteImage, isSupabaseConfigured, testSupabaseConnection } from '../../lib/supabase';

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ id, label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary-600 text-white shadow-lg'
        : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
    }`}
  >
    {icon}
    <span className="ml-2 font-medium">{label}</span>
  </button>
);

const ImageUpload: React.FC<{
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  label: string;
  className?: string;
}> = ({ currentImage, onImageChange, label, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      onImageChange(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className={`border-2 border-dashed border-neutral-600 rounded-lg p-6 text-center ${className}`}>
        <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <p className="text-neutral-400 text-sm mb-2">Supabase Not Configured</p>
        <p className="text-neutral-500 text-xs">
          Image uploads are disabled. Please connect to Supabase to enable image upload functionality.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragOver
            ? 'border-primary-500 bg-primary-500/10'
            : 'border-neutral-600 hover:border-neutral-500'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {currentImage && (
          <div className="mb-4">
            <img
              src={currentImage}
              alt="Current"
              className="w-24 h-24 object-cover rounded-lg mx-auto"
            />
          </div>
        )}
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader className="w-8 h-8 text-primary-500 animate-spin mb-2" />
            <p className="text-neutral-400">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-neutral-400 mb-2" />
            <p className="text-neutral-400 mb-2">Drop image here or click to upload</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id={`file-upload-${label}`}
            />
            <label
              htmlFor={`file-upload-${label}`}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg cursor-pointer transition-colors duration-200"
            >
              Choose File
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSupabaseReady, setIsSupabaseReady] = useState<boolean | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const {
    profile,
    projects,
    certificates,
    experiences,
    footer,
    contactMessages,
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
    changePassword,
    logout
  } = useStore();

  // Test Supabase connection on mount
  useEffect(() => {
    const checkSupabase = async () => {
      const configured = isSupabaseConfigured();
      if (configured) {
        const connected = await testSupabaseConnection();
        setIsSupabaseReady(connected);
      } else {
        setIsSupabaseReady(false);
      }
    };
    checkSupabase();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen className="w-5 h-5" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'certificates', label: 'Certificates', icon: <Award className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <Inbox className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const ProfileTab = () => {
    const [formData, setFormData] = useState(profile);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
      setIsSaving(true);
      try {
        await updateProfile(formData);
        showNotification('success', 'Profile updated successfully!');
      } catch (error) {
        showNotification('error', 'Failed to update profile');
      } finally {
        setIsSaving(false);
      }
    };

    const handleSkillAdd = (skill: string) => {
      if (skill.trim() && !formData.skills.includes(skill.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, skill.trim()]
        }));
      }
    };

    const handleSkillRemove = (index: number) => {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
    };

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Profile Management</h2>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
          >
            {isSaving ? (
              <Loader className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Professional Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Profile Image</h3>
            
            <ImageUpload
              currentImage={formData.profileImage}
              onImageChange={(imageUrl) => setFormData(prev => ({ ...prev, profileImage: imageUrl }))}
              label="Profile Picture"
            />

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Years of Experience</label>
                <input
                  type="text"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Projects Completed</label>
                <input
                  type="text"
                  value={formData.projectsCompleted}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectsCompleted: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Social Links</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  <Github className="w-4 h-4 inline mr-2" />
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.github}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, github: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.socialLinks.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, email: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Skills</h3>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-primary-600/20 text-primary-300 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => handleSkillRemove(index)}
                      className="ml-2 text-primary-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill..."
                  className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSkillAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    handleSkillAdd(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProjectsTab = () => {
    const [editingProject, setEditingProject] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);

    const ProjectForm = ({ project, onSave, onCancel }: any) => {
      const [formData, setFormData] = useState(project || {
        title: '',
        description: '',
        shortDescription: '',
        image: '',
        images: [],
        technologies: [],
        liveUrl: '',
        githubUrl: '',
        category: 'Web Development',
        featured: false,
        date: new Date().toISOString().split('T')[0]
      });

      const handleSave = async () => {
        try {
          if (project) {
            await updateProject(project.id, formData);
            showNotification('success', 'Project updated successfully!');
          } else {
            await addProject(formData);
            showNotification('success', 'Project added successfully!');
          }
          onSave();
        } catch (error) {
          showNotification('error', 'Failed to save project');
        }
      };

      const handleTechAdd = (tech: string) => {
        if (tech.trim() && !formData.technologies.includes(tech.trim())) {
          setFormData(prev => ({
            ...prev,
            technologies: [...prev.technologies, tech.trim()]
          }));
        }
      };

      const handleTechRemove = (index: number) => {
        setFormData(prev => ({
          ...prev,
          technologies: prev.technologies.filter((_, i) => i !== index)
        }));
      };

      return (
        <div className="bg-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">
              {project ? 'Edit Project' : 'Add New Project'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Save
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Full Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Automation">Automation</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Robotics">Robotics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Live URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="featured" className="text-sm text-neutral-300">Featured Project</label>
              </div>
            </div>

            <div className="space-y-4">
              <ImageUpload
                currentImage={formData.image}
                onImageChange={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                label="Project Image"
              />

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Technologies</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.technologies.map((tech: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary-600/20 text-primary-300 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        onClick={() => handleTechRemove(index)}
                        className="ml-2 text-primary-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add technology..."
                    className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleTechAdd(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleTechAdd(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Projects Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Project
          </button>
        </div>

        {(showForm || editingProject) && (
          <ProjectForm
            project={editingProject}
            onSave={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-neutral-800 rounded-xl overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-primary-600/20 text-primary-300 rounded text-xs">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded text-xs">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{project.shortDescription}</p>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 text-xs">{project.date}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="p-2 text-neutral-400 hover:text-primary-400 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this project?')) {
                          deleteProject(project.id);
                          showNotification('success', 'Project deleted successfully!');
                        }
                      }}
                      className="p-2 text-neutral-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ExperienceTab = () => {
    const [editingExperience, setEditingExperience] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);

    const ExperienceForm = ({ experience, onSave, onCancel }: any) => {
      const [formData, setFormData] = useState(experience || {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: [''],
        type: 'work'
      });

      const handleSave = async () => {
        try {
          const dataToSave = {
            ...formData,
            description: formData.description.filter((desc: string) => desc.trim() !== '')
          };
          
          if (experience) {
            await updateExperience(experience.id, dataToSave);
            showNotification('success', 'Experience updated successfully!');
          } else {
            await addExperience(dataToSave);
            showNotification('success', 'Experience added successfully!');
          }
          onSave();
        } catch (error) {
          showNotification('error', 'Failed to save experience');
        }
      };

      const handleDescriptionChange = (index: number, value: string) => {
        setFormData(prev => ({
          ...prev,
          description: prev.description.map((desc: string, i: number) => i === index ? value : desc)
        }));
      };

      const addDescriptionItem = () => {
        setFormData(prev => ({
          ...prev,
          description: [...prev.description, '']
        }));
      };

      const removeDescriptionItem = (index: number) => {
        setFormData(prev => ({
          ...prev,
          description: prev.description.filter((_: string, i: number) => i !== index)
        }));
      };

      return (
        <div className="bg-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">
              {experience ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Save
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Company/Institution</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="work">Work</option>
                  <option value="education">Education</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    disabled={formData.current}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : prev.endDate
                  }))}
                  className="mr-2"
                />
                <label htmlFor="current" className="text-sm text-neutral-300">Currently working/studying here</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                <div className="space-y-2">
                  {formData.description.map((desc: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={desc}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        placeholder="Add description point..."
                        className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                      />
                      <button
                        onClick={() => removeDescriptionItem(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addDescriptionItem}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2 inline" />
                    Add Point
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Experience Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Experience
          </button>
        </div>

        {(showForm || editingExperience) && (
          <ExperienceForm
            experience={editingExperience}
            onSave={() => {
              setShowForm(false);
              setEditingExperience(null);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingExperience(null);
            }}
          />
        )}

        <div className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience.id} className="bg-neutral-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`p-2 rounded-lg mr-3 ${
                      experience.type === 'education' ? 'bg-primary-600/20 text-primary-400' :
                      experience.type === 'work' ? 'bg-secondary-600/20 text-secondary-400' :
                      'bg-accent-600/20 text-accent-400'
                    }`}>
                      {experience.type === 'education' ? <GraduationCap className="w-5 h-5" /> :
                       experience.type === 'work' ? <Briefcase className="w-5 h-5" /> :
                       <Building className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{experience.title}</h3>
                      <p className="text-primary-400 font-medium">{experience.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-neutral-400 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {experience.location}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {experience.description.map((desc, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-neutral-300 text-sm">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {experience.current && (
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                      Current
                    </span>
                  )}
                  <button
                    onClick={() => setEditingExperience(experience)}
                    className="p-2 text-neutral-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this experience?')) {
                        deleteExperience(experience.id);
                        showNotification('success', 'Experience deleted successfully!');
                      }
                    }}
                    className="p-2 text-neutral-400 hover:text-red-400 transition-colors duration-200"
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
  };

  const CertificatesTab = () => {
    const [editingCertificate, setEditingCertificate] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);

    const CertificateForm = ({ certificate, onSave, onCancel }: any) => {
      const [formData, setFormData] = useState(certificate || {
        title: '',
        issuer: '',
        date: '',
        image: '',
        credentialUrl: ''
      });

      const handleSave = async () => {
        try {
          if (certificate) {
            await updateCertificate(certificate.id, formData);
            showNotification('success', 'Certificate updated successfully!');
          } else {
            await addCertificate(formData);
            showNotification('success', 'Certificate added successfully!');
          }
          onSave();
        } catch (error) {
          showNotification('error', 'Failed to save certificate');
        }
      };

      return (
        <div className="bg-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">
              {certificate ? 'Edit Certificate' : 'Add New Certificate'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Save
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Certificate Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Issuer</label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Date Issued</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Credential URL (Optional)</label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, credentialUrl: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <ImageUpload
                currentImage={formData.image}
                onImageChange={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                label="Certificate Image"
              />
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Certificates Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Certificate
          </button>
        </div>

        {(showForm || editingCertificate) && (
          <CertificateForm
            certificate={editingCertificate}
            onSave={() => {
              setShowForm(false);
              setEditingCertificate(null);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingCertificate(null);
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="bg-neutral-800 rounded-xl overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{certificate.title}</h3>
                <p className="text-primary-400 font-medium mb-2">{certificate.issuer}</p>
                <p className="text-neutral-400 text-sm mb-4">
                  {new Date(certificate.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="flex justify-between items-center">
                  {certificate.credentialUrl && (
                    <a
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Verify
                    </a>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCertificate(certificate)}
                      className="p-2 text-neutral-400 hover:text-primary-400 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this certificate?')) {
                          deleteCertificate(certificate.id);
                          showNotification('success', 'Certificate deleted successfully!');
                        }
                      }}
                      className="p-2 text-neutral-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MessagesTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          <div className="text-sm text-neutral-400">
            {contactMessages.length} message{contactMessages.length !== 1 ? 's' : ''}
          </div>
        </div>

        {contactMessages.length === 0 ? (
          <div className="bg-neutral-800 rounded-xl p-8 text-center">
            <Inbox className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Messages Yet</h3>
            <p className="text-neutral-400">
              Contact form messages will appear here when visitors submit the form.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contactMessages.map((message) => (
              <div key={message.id} className="bg-neutral-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{message.subject}</h3>
                    <p className="text-primary-400">{message.name} • {message.email}</p>
                  </div>
                  <div className="text-sm text-neutral-400">
                    {new Date(message.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="bg-neutral-900 rounded-lg p-4">
                  <p className="text-neutral-300 whitespace-pre-wrap">{message.message}</p>
                </div>
                <div className="flex justify-end mt-4">
                  <a
                    href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SettingsTab = () => {
    const [passwordForm, setPasswordForm] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
      current: false,
      new: false,
      confirm: false
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        showNotification('error', 'New passwords do not match');
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        showNotification('error', 'Password must be at least 6 characters long');
        return;
      }

      setIsChangingPassword(true);
      try {
        const success = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
        if (success) {
          showNotification('success', 'Password changed successfully!');
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
          showNotification('error', 'Current password is incorrect');
        }
      } catch (error) {
        showNotification('error', 'Failed to change password');
      } finally {
        setIsChangingPassword(false);
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        
        {/* Database Status */}
        <div className="bg-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Database Status</h3>
          <div className="flex items-center space-x-3">
            {isSupabaseReady === null ? (
              <>
                <Loader className="w-5 h-5 text-yellow-500 animate-spin" />
                <span className="text-neutral-300">Checking connection...</span>
              </>
            ) : isSupabaseReady ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-400">Supabase Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-400">Supabase Not Connected</span>
                <div className="ml-4 text-sm text-neutral-400">
                  Running in offline mode. Some features may be limited.
                </div>
              </>
            )}
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors duration-200"
            >
              {isChangingPassword ? (
                <Loader className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Key className="w-5 h-5 mr-2" />
              )}
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Account Actions */}
        <div className="bg-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to logout?')) {
                logout();
              }
            }}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'projects':
        return <ProjectsTab />;
      case 'experience':
        return <ExperienceTab />;
      case 'certificates':
        return <CertificatesTab />;
      case 'messages':
        return <MessagesTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <div className="text-white">Tab content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <div className="bg-neutral-800 border-b border-neutral-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-neutral-400">Manage your portfolio content</p>
          </div>
          <div className="flex items-center space-x-4">
            {isSupabaseReady === null ? (
              <div className="flex items-center text-yellow-500">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-sm">Checking...</span>
              </div>
            ) : isSupabaseReady ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Offline Mode</span>
              </div>
            )}
            <a
              href="/"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              View Site
            </a>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-neutral-800 border-r border-neutral-700 min-h-screen p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg ${
              notification.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;