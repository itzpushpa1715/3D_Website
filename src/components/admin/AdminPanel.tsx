import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Edit
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
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

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'projects', name: 'Projects', icon: FolderOpen },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'footer', name: 'Footer', icon: Settings },
  ];

  const handleSave = (type: string) => {
    switch (type) {
      case 'profile':
        updateProfile(formData);
        break;
      case 'footer':
        updateFooter(formData);
        break;
      case 'project':
        if (editingItem?.id) {
          updateProject(editingItem.id, formData);
        } else {
          addProject(formData);
        }
        break;
      case 'certificate':
        if (editingItem?.id) {
          updateCertificate(editingItem.id, formData);
        } else {
          addCertificate(formData);
        }
        break;
      case 'experience':
        if (editingItem?.id) {
          updateExperience(editingItem.id, formData);
        } else {
          addExperience(formData);
        }
        break;
    }
    setEditingItem(null);
    setFormData({});
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
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
          <input
            type="text"
            value={formData.title || profile.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
          <textarea
            value={formData.bio || profile.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
          <input
            type="text"
            value={formData.location || profile.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Profile Image URL</label>
          <input
            type="url"
            value={formData.profileImage || profile.profileImage}
            onChange={(e) => setFormData(prev => ({ ...prev, profileImage: e.target.value }))}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
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

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Projects</h3>
        <button
          onClick={() => {
            setEditingItem({});
            setFormData({});
          }}
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
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
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
            />
            <textarea
              placeholder="Short Description"
              value={formData.shortDescription || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white md:col-span-2"
            />
            <textarea
              placeholder="Full Description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white md:col-span-2"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={formData.image || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Technologies (comma separated)"
              value={formData.technologies?.join(', ') || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                technologies: e.target.value.split(',').map(t => t.trim()) 
              }))}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleSave('project')}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg"
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
                  className="p-2 text-primary-400 hover:bg-primary-400/10 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded"
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
      case 'projects':
        return renderProjectsTab();
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
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white"
              />
            </div>
            <button
              onClick={() => handleSave('footer')}
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
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