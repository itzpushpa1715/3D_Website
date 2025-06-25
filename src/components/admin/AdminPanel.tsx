import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  Briefcase, 
  FolderOpen, 
  Award, 
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit,
  Mail,
  Info,
  Check,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';

// Success Toast Component
const SuccessToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
  >
    <Check className="w-5 h-5" />
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 hover:bg-green-700 rounded p-1">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');
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
    logout 
  } = useStore();

  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'about', name: 'About Me', icon: Info },
    { id: 'projects', name: 'Projects', icon: FolderOpen },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'contact', name: 'Contact', icon: Mail },
    { id: 'footer', name: 'Footer', icon: Settings },
  ];

  const handleSave = (type: string) => {
    switch (type) {
      case 'profile':
        updateProfile(formData);
        showSuccess('Profile updated successfully!');
        break;
      case 'about':
        updateProfile(formData);
        showSuccess('About section updated successfully!');
        break;
      case 'contact':
        updateProfile({ socialLinks: { ...profile.socialLinks, ...formData } });
        showSuccess('Contact information updated successfully!');
        break;
      case 'footer':
        updateFooter(formData);
        showSuccess('Footer updated successfully!');
        break;
      case 'project':
        if (editingItem?.id) {
          updateProject(editingItem.id, formData);
          showSuccess('Project updated successfully!');
        } else {
          addProject({ ...formData, id: Date.now().toString() });
          showSuccess('Project added successfully!');
        }
        break;
      case 'certificate':
        if (editingItem?.id) {
          updateCertificate(editingItem.id, formData);
          showSuccess('Certificate updated successfully!');
        } else {
          addCertificate({ ...formData, id: Date.now().toString() });
          showSuccess('Certificate added successfully!');
        }
        break;
      case 'experience':
        if (editingItem?.id) {
          updateExperience(editingItem.id, formData);
          showSuccess('Experience updated successfully!');
        } else {
          addExperience({ ...formData, id: Date.now().toString() });
          showSuccess('Experience added successfully!');
        }
        break;
    }
    setEditingItem(null);
    setFormData({});
  };

  const handleDelete = (type: string, id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      switch (type) {
        case 'project':
          deleteProject(id);
          showSuccess('Project deleted successfully!');
          break;
        case 'certificate':
          deleteCertificate(id);
          showSuccess('Certificate deleted successfully!');
          break;
        case 'experience':
          deleteExperience(id);
          showSuccess('Experience deleted successfully!');
          break;
      }
    }
  };

  const startEdit = (item: any, type: string) => {
    setEditingItem(item);
    setFormData(item);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
          <input
            type="text"
            value={formData.name || profile.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
          <input
            type="text"
            value={formData.title || profile.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
          <input
            type="text"
            value={formData.location || profile.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Profile Image URL</label>
          <input
            type="url"
            value={formData.profileImage || profile.profileImage}
            onChange={(e) => setFormData(prev => ({ ...prev, profileImage: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
          <textarea
            value={formData.bio || profile.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
          />
        </div>
      </div>
      <button
        onClick={() => handleSave('profile')}
        className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Profile
      </button>
    </div>
  );

  const renderAboutTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">About Me Section</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Years of Experience</label>
          <input
            type="text"
            value={formData.yearsExperience || profile.yearsExperience || '1+'}
            onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            placeholder="e.g., 1+, 2+, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Projects Completed</label>
          <input
            type="text"
            value={formData.projectsCompleted || profile.projectsCompleted || '5+'}
            onChange={(e) => setFormData(prev => ({ ...prev, projectsCompleted: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            placeholder="e.g., 5+, 10+, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Skills (comma separated)</label>
          <textarea
            value={formData.skills?.join(', ') || profile.skills.join(', ')}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              skills: e.target.value.split(',').map(s => s.trim()) 
            }))}
            rows={3}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            placeholder="Python, C#, TIA Portal, AutoCAD, etc."
          />
        </div>
      </div>
      <button
        onClick={() => handleSave('about')}
        className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
      >
        <Save className="w-4 h-4 mr-2" />
        Save About Section
      </button>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Contact Information</h3>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
          <input
            type="email"
            value={formData.email || profile.socialLinks.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">GitHub URL</label>
          <input
            type="url"
            value={formData.github || profile.socialLinks.github}
            onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">LinkedIn URL</label>
          <input
            type="url"
            value={formData.linkedin || profile.socialLinks.linkedin}
            onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
          />
        </div>
      </div>
      <button
        onClick={() => handleSave('contact')}
        className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Contact Info
      </button>
    </div>
  );

  const renderExperienceTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Experience & Education</h3>
        <button
          onClick={() => {
            setEditingItem({});
            setFormData({});
          }}
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </button>
      </div>

      {(editingItem !== null) && (
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingItem?.id ? 'Edit Experience' : 'Add New Experience'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="text"
              placeholder="Company/Institution"
              value={formData.company || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <select
              value={formData.type || 'education'}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            >
              <option value="education">Education</option>
              <option value="work">Work</option>
              <option value="internship">Internship</option>
            </select>
            <input
              type="date"
              placeholder="Start Date"
              value={formData.startDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="date"
              placeholder="End Date"
              value={formData.endDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
              disabled={formData.current}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                checked={formData.current || false}
                onChange={(e) => setFormData(prev => ({ ...prev, current: e.target.checked }))}
                className="mr-2 w-4 h-4 text-primary-600 bg-neutral-900 border-neutral-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="current" className="text-white">Currently here</label>
            </div>
            <textarea
              placeholder="Description (one point per line)"
              value={formData.description?.join('\n') || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                description: e.target.value.split('\n').filter(line => line.trim()) 
              }))}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white md:col-span-2 focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleSave('experience')}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-white">{experience.title}</h4>
                <p className="text-neutral-400 text-sm">{experience.company} • {experience.location}</p>
                <p className="text-neutral-300 mt-2">{experience.startDate} - {experience.current ? 'Present' : experience.endDate}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(experience, 'experience')}
                  className="p-2 text-primary-400 hover:bg-primary-400/10 rounded transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete('experience', experience.id, experience.title)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors duration-200"
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

  const renderCertificatesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Certificates</h3>
        <button
          onClick={() => {
            setEditingItem({});
            setFormData({});
          }}
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Certificate
        </button>
      </div>

      {(editingItem !== null) && (
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingItem?.id ? 'Edit Certificate' : 'Add New Certificate'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Certificate Title"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="text"
              placeholder="Issuer"
              value={formData.issuer || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="date"
              placeholder="Date"
              value={formData.date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={formData.image || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="url"
              placeholder="Credential URL (optional)"
              value={formData.credentialUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, credentialUrl: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white md:col-span-2 focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleSave('certificate')}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-white">{certificate.title}</h4>
                <p className="text-neutral-400 text-sm">{certificate.issuer}</p>
                <p className="text-neutral-300 mt-2">{new Date(certificate.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(certificate, 'certificate')}
                  className="p-2 text-primary-400 hover:bg-primary-400/10 rounded transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete('certificate', certificate.id, certificate.title)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors duration-200"
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

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Projects</h3>
        <button
          onClick={() => {
            setEditingItem({});
            setFormData({});
          }}
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {(editingItem !== null) && (
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingItem?.id ? 'Edit Project' : 'Add New Project'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <textarea
              placeholder="Short Description"
              value={formData.shortDescription || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white md:col-span-2 focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <textarea
              placeholder="Full Description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white md:col-span-2 focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={formData.image || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="text"
              placeholder="Technologies (comma separated)"
              value={formData.technologies?.join(', ') || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                technologies: e.target.value.split(',').map(t => t.trim()) 
              }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="url"
              placeholder="GitHub URL (optional)"
              value={formData.githubUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="url"
              placeholder="Live URL (optional)"
              value={formData.liveUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <input
              type="date"
              placeholder="Project Date"
              value={formData.date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="mr-2 w-4 h-4 text-primary-600 bg-neutral-900 border-neutral-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="featured" className="text-white">Featured Project</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleSave('project')}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                <p className="text-neutral-400 text-sm">{project.category}</p>
                <p className="text-neutral-300 mt-2">{project.shortDescription}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(project, 'project')}
                  className="p-2 text-primary-400 hover:bg-primary-400/10 rounded transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete('project', project.id, project.title)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors duration-200"
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

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'about':
        return renderAboutTab();
      case 'contact':
        return renderContactTab();
      case 'projects':
        return renderProjectsTab();
      case 'experience':
        return renderExperienceTab();
      case 'certificates':
        return renderCertificatesTab();
      case 'footer':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Footer Settings</h3>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Footer Text</label>
              <input
                type="text"
                value={formData.text || footer.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors duration-200"
              />
            </div>
            <button
              onClick={() => handleSave('footer')}
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Footer
            </button>
          </div>
        );
      default:
        return <div className="text-white">Select a tab to edit content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Success Toast */}
      <AnimatePresence>
        {successMessage && (
          <SuccessToast 
            message={successMessage} 
            onClose={() => setSuccessMessage('')} 
          />
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-neutral-800 border-r border-neutral-700 min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
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
            
            <div className="absolute bottom-6 left-6">
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-neutral-400 hover:text-white transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;