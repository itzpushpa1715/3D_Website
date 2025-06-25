import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Home, 
  User, 
  Briefcase, 
  Award, 
  FolderOpen,
  Settings,
  Upload,
  Image as ImageIcon,
  Frame,
  Eye,
  Calendar,
  MapPin,
  ExternalLink,
  Github
} from 'lucide-react';
import { uploadImage } from '../../lib/supabase';

type TabType = 'profile' | 'projects' | 'certificates' | 'experiences' | 'footer' | 'preview';

interface ImageFrameOption {
  id: string;
  name: string;
  className: string;
}

const imageFrames: ImageFrameOption[] = [
  { id: 'none', name: 'No Frame', className: '' },
  { id: 'rounded', name: 'Rounded', className: 'rounded-lg' },
  { id: 'circle', name: 'Circle', className: 'rounded-full' },
  { id: 'shadow', name: 'Shadow', className: 'rounded-lg shadow-lg' },
  { id: 'border', name: 'Border', className: 'rounded-lg border-4 border-white shadow-lg' },
  { id: 'vintage', name: 'Vintage', className: 'rounded-lg border-8 border-amber-100 shadow-2xl sepia' },
];

export default function AdminPanel() {
  const {
    user,
    logout,
    profile,
    updateProfile,
    projects,
    addProject,
    updateProject,
    deleteProject,
    certificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    footer,
    updateFooter,
  } = useStore();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState('none');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  if (!user?.isAuthenticated) {
    return null;
  }

  const handleImageUpload = async (file: File, field: string, item?: any) => {
    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file);
      
      if (activeTab === 'profile') {
        await updateProfile({ [field]: imageUrl });
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else if (item) {
        const updatedItem = { ...item, [field]: imageUrl };
        setEditingItem(updatedItem);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (saveFunction: () => Promise<void>) => {
    setSaveStatus('saving');
    try {
      await saveFunction();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const ImageUploadButton = ({ 
    onUpload, 
    currentImage, 
    label = "Upload Image",
    showFrame = false 
  }: { 
    onUpload: (file: File) => void;
    currentImage?: string;
    label?: string;
    showFrame?: boolean;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          {label}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
            className="hidden"
          />
        </label>
        {uploadingImage && (
          <div className="text-blue-600">Uploading...</div>
        )}
      </div>
      
      {showFrame && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image Frame Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {imageFrames.map((frame) => (
              <button
                key={frame.id}
                onClick={() => setSelectedFrame(frame.id)}
                className={`p-2 text-xs rounded border transition-colors ${
                  selectedFrame === frame.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {frame.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {currentImage && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Image:</p>
          <img
            src={currentImage}
            alt="Current"
            className={`w-32 h-32 object-cover ${
              showFrame ? imageFrames.find(f => f.id === selectedFrame)?.className || '' : 'rounded-lg'
            }`}
          />
        </div>
      )}
    </div>
  );

  const SaveStatusIndicator = () => {
    if (saveStatus === 'idle') return null;
    
    return (
      <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
        saveStatus === 'saving' ? 'bg-blue-600' :
        saveStatus === 'success' ? 'bg-green-600' :
        'bg-red-600'
      }`}>
        {saveStatus === 'saving' && 'Saving...'}
        {saveStatus === 'success' && 'Saved successfully!'}
        {saveStatus === 'error' && 'Error saving changes'}
      </div>
    );
  };

  const renderPreviewTab = () => (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Portfolio Preview
        </h3>
        
        <div className="space-y-8">
          {/* Profile Preview */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h4>
            <div className="flex items-center gap-4">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h5 className="text-lg font-bold text-gray-900 dark:text-white">{profile.name}</h5>
                <p className="text-blue-600 dark:text-blue-400">{profile.title}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{profile.location}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-4">{profile.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.skills.map((skill) => (
                <span key={skill} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Projects Preview */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Projects ({projects.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((project) => (
                <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h5 className="font-semibold text-gray-900 dark:text-white">{project.title}</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{project.shortDescription}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates Preview */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Certificates ({certificates.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.slice(0, 4).map((cert) => (
                <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 dark:text-white">{cert.title}</h5>
                  <p className="text-blue-600 dark:text-blue-400">{cert.issuer}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experiences Preview */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Experience ({experiences.length})
            </h4>
            <div className="space-y-4">
              {experiences.slice(0, 3).map((exp) => (
                <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h5>
                  <p className="text-blue-600 dark:text-blue-400">{exp.company}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleSave(() => updateProfile({ name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => handleSave(() => updateProfile({ title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleSave(() => updateProfile({ bio: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleSave(() => updateProfile({ location: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Image
            </label>
            <ImageUploadButton
              onUpload={(file) => handleImageUpload(file, 'profileImage')}
              currentImage={profile.profileImage}
              label="Upload Profile Image"
              showFrame={true}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Years Experience
            </label>
            <input
              type="text"
              value={profile.yearsExperience}
              onChange={(e) => handleSave(() => updateProfile({ yearsExperience: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Projects Completed
            </label>
            <input
              type="text"
              value={profile.projectsCompleted}
              onChange={(e) => handleSave(() => updateProfile({ projectsCompleted: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            value={profile.skills.join(', ')}
            onChange={(e) => handleSave(() => updateProfile({ skills: e.target.value.split(', ').filter(s => s.trim()) }))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              value={profile.socialLinks.github}
              onChange={(e) => handleSave(() => updateProfile({ 
                socialLinks: { ...profile.socialLinks, github: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={profile.socialLinks.linkedin}
              onChange={(e) => handleSave(() => updateProfile({ 
                socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.socialLinks.email}
              onChange={(e) => handleSave(() => updateProfile({ 
                socialLinks: { ...profile.socialLinks, email: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Projects
        </h3>
        <button
          onClick={() => {
            setEditingItem({
              title: '',
              description: '',
              shortDescription: '',
              image: '',
              images: [],
              technologies: [],
              liveUrl: '',
              githubUrl: '',
              category: '',
              featured: false,
              date: new Date().toISOString().split('T')[0],
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {project.shortDescription}
              </p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.featured 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {project.featured ? 'Featured' : 'Regular'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(project);
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSave(() => deleteProject(project.id))}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingItem.id ? 'Edit Project' : 'Add Project'}
                </h4>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={editingItem.shortDescription}
                    onChange={(e) => setEditingItem({ ...editingItem, shortDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Main Image
                  </label>
                  <ImageUploadButton
                    onUpload={(file) => handleImageUpload(file, 'image', editingItem)}
                    currentImage={editingItem.image}
                    label="Upload Main Image"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingItem.technologies.join(', ')}
                      onChange={(e) => setEditingItem({ 
                        ...editingItem, 
                        technologies: e.target.value.split(', ').filter(t => t.trim()) 
                      })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editingItem.date}
                      onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Live URL (optional)
                    </label>
                    <input
                      type="url"
                      value={editingItem.liveUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, liveUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GitHub URL (optional)
                    </label>
                    <input
                      type="url"
                      value={editingItem.githubUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingItem.featured}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured Project
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleSave(async () => {
                        if (editingItem.id) {
                          await updateProject(editingItem.id, editingItem);
                        } else {
                          await addProject(editingItem);
                        }
                      });
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCertificatesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5" />
          Certificates
        </h3>
        <button
          onClick={() => {
            setEditingItem({
              title: '',
              issuer: '',
              date: new Date().toISOString().split('T')[0],
              image: '',
              credentialUrl: '',
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <img
              src={certificate.image}
              alt={certificate.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{certificate.title}</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{certificate.issuer}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{certificate.date}</p>
              <div className="flex justify-between items-center">
                {certificate.credentialUrl && (
                  <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Verify
                  </a>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(certificate);
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSave(() => deleteCertificate(certificate.id))}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingItem.id ? 'Edit Certificate' : 'Add Certificate'}
                </h4>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Issuer
                  </label>
                  <input
                    type="text"
                    value={editingItem.issuer}
                    onChange={(e) => setEditingItem({ ...editingItem, issuer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Certificate Image
                  </label>
                  <ImageUploadButton
                    onUpload={(file) => handleImageUpload(file, 'image', editingItem)}
                    currentImage={editingItem.image}
                    label="Upload Certificate Image"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Credential URL (optional)
                  </label>
                  <input
                    type="url"
                    value={editingItem.credentialUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, credentialUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleSave(async () => {
                        if (editingItem.id) {
                          await updateCertificate(editingItem.id, editingItem);
                        } else {
                          await addCertificate(editingItem);
                        }
                      });
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderExperiencesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Experience
        </h3>
        <button
          onClick={() => {
            setEditingItem({
              title: '',
              company: '',
              location: '',
              startDate: new Date().toISOString().split('T')[0],
              endDate: '',
              current: false,
              description: [''],
              type: 'work',
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <div key={experience.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{experience.title}</h4>
                <p className="text-blue-600 dark:text-blue-400 font-medium">{experience.company}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {experience.location}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    experience.type === 'education' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    experience.type === 'work' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }`}>
                    {experience.type}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingItem(experience);
                    setShowForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSave(() => deleteExperience(experience.id))}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {experience.description.map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showForm && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingItem.id ? 'Edit Experience' : 'Add Experience'}
                </h4>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company/Institution
                    </label>
                    <input
                      type="text"
                      value={editingItem.company}
                      onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editingItem.startDate}
                      onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editingItem.endDate || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                      disabled={editingItem.current}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={editingItem.type}
                      onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as 'work' | 'education' | 'internship' })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="work">Work</option>
                      <option value="education">Education</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="current"
                    checked={editingItem.current}
                    onChange={(e) => setEditingItem({ 
                      ...editingItem, 
                      current: e.target.checked,
                      endDate: e.target.checked ? '' : editingItem.endDate
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="current" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currently working/studying here
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (one point per line)
                  </label>
                  <textarea
                    value={editingItem.description.join('\n')}
                    onChange={(e) => setEditingItem({ 
                      ...editingItem, 
                      description: e.target.value.split('\n').filter(line => line.trim()) 
                    })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter each responsibility or achievement on a new line"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleSave(async () => {
                        if (editingItem.id) {
                          await updateExperience(editingItem.id, editingItem);
                        } else {
                          await addExperience(editingItem);
                        }
                      });
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderFooterTab = () => (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Footer Settings
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Footer Text
            </label>
            <input
              type="text"
              value={footer.text}
              onChange={(e) => handleSave(() => updateFooter({ text: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Footer Links
            </label>
            <div className="space-y-3">
              {footer.links.map((link, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => {
                      const newLinks = [...footer.links];
                      newLinks[index] = { ...link, name: e.target.value };
                      handleSave(() => updateFooter({ links: newLinks }));
                    }}
                    placeholder="Link name"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...footer.links];
                        newLinks[index] = { ...link, url: e.target.value };
                        handleSave(() => updateFooter({ links: newLinks }));
                      }}
                      placeholder="Link URL"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        const newLinks = footer.links.filter((_, i) => i !== index);
                        handleSave(() => updateFooter({ links: newLinks }));
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newLinks = [...footer.links, { name: '', url: '' }];
                  handleSave(() => updateFooter({ links: newLinks }));
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'experiences', label: 'Experience', icon: Briefcase },
    { id: 'footer', label: 'Footer', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SaveStatusIndicator />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Welcome, {user.username}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                View Portfolio
              </a>
              <button
                onClick={logout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
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
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'preview' && renderPreviewTab()}
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'projects' && renderProjectsTab()}
            {activeTab === 'certificates' && renderCertificatesTab()}
            {activeTab === 'experiences' && renderExperiencesTab()}
            {activeTab === 'footer' && renderFooterTab()}
          </div>
        </div>
      </div>
    </div>
  );
}