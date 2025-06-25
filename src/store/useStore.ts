import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  username: string;
  isAuthenticated: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  featured: boolean;
  date: string;
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl?: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  type: 'work' | 'education' | 'internship';
}

interface Store {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Auth
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Data loading
  isLoading: boolean;
  loadData: () => Promise<void>;
  saveToDatabase: (dataType: string, content: any) => Promise<void>;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Certificates
  certificates: Certificate[];
  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  updateCertificate: (id: string, certificate: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;

  // Experience
  experiences: Experience[];
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;

  // Profile
  profile: {
    name: string;
    title: string;
    bio: string;
    location: string;
    profileImage: string;
    skills: string[];
    yearsExperience: string;
    projectsCompleted: string;
    socialLinks: {
      github: string;
      linkedin: string;
      email: string;
    };
  };
  updateProfile: (profile: Partial<Store['profile']>) => void;

  // Footer
  footer: {
    text: string;
    links: { name: string; url: string }[];
  };
  updateFooter: (footer: Partial<Store['footer']>) => void;
}

const defaultData = {
  profile: {
    name: 'Pushpa Koirala',
    title: 'Automation & Robotics Engineer',
    bio: 'Passionate automation engineering student bridging technology and innovation through cutting-edge robotics solutions. Currently studying at JAMK University and specializing in PLC programming, industrial automation, and intelligent control systems.',
    location: 'Jyvaskyla, Finland',
    profileImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
    skills: ['Python', 'C#', 'TIA Portal', 'AutoCAD', 'Blender', 'UI/UX', 'PLC Programming', 'Industrial Automation'],
    yearsExperience: '1+',
    projectsCompleted: '5+',
    socialLinks: {
      github: 'https://github.com/itzpushpa1715',
      linkedin: 'https://www.linkedin.com/in/pushpakoirala/',
      email: 'thepushpaco@outlook.com',
    },
  },
  projects: [
    {
      id: '1',
      title: 'PLC-Controlled Dual Cylinders',
      description: 'Advanced pneumatic system control using Siemens TIA Portal for industrial automation. Features sequential operation, safety interlocks, and HMI interface for monitoring and control.',
      shortDescription: 'Industrial automation system with PLC programming',
      image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg',
      images: [
        'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg',
        'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg',
      ],
      technologies: ['TIA Portal', 'Ladder Logic', 'HMI', 'Pneumatics'],
      category: 'Automation',
      featured: true,
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'JS Flappy Bird Game',
      description: 'Classic Flappy Bird game recreated using vanilla JavaScript with modern ES6+ features, canvas rendering, and smooth animations.',
      shortDescription: 'Browser-based game with smooth animations',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
      images: [
        'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
      ],
      technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3'],
      githubUrl: 'https://github.com/itzpushpa1715',
      category: 'Web Development',
      featured: true,
      date: '2023-11-20',
    },
    {
      id: '3',
      title: 'Python Car Management System',
      description: 'Comprehensive vehicle management system built with Python, featuring inventory tracking, maintenance scheduling, and reporting capabilities.',
      shortDescription: 'Database-driven management system',
      image: 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg',
      images: [
        'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg',
      ],
      technologies: ['Python', 'SQLite', 'Tkinter', 'Pandas'],
      githubUrl: 'https://github.com/itzpushpa1715',
      category: 'Software Development',
      featured: false,
      date: '2023-09-10',
    },
  ],
  certificates: [
    {
      id: '1',
      title: 'Industrial Automation Certification',
      issuer: 'Turku University of Applied Sciences',
      date: '2023-12-15',
      image: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg',
    },
    {
      id: '2',
      title: 'Advanced PLC Programming',
      issuer: 'LUT University',
      date: '2023-10-22',
      image: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg',
    },
  ],
  experiences: [
    {
      id: '1',
      title: 'Automation and Robotics Engineering',
      company: 'JAMK University of Applied Sciences',
      location: 'Jyvaskyla, Finland',
      startDate: '2022-08-01',
      current: true,
      description: [
        'Specialized in industrial automation and robotics systems',
        'Advanced PLC programming and control systems',
        'CAD design and 3D modeling with AutoCAD and Blender',
        'Python and C# application development',
      ],
      type: 'education',
    },
    {
      id: '2',
      title: 'Automation Engineering Intern',
      company: 'Local Manufacturing Company',
      location: 'Jyvaskyla, Finland',
      startDate: '2023-05-01',
      endDate: '2023-08-31',
      current: false,
      description: [
        'Developed PLC programs for production line automation',
        'Collaborated on HMI design and implementation',
        'Performed system testing and troubleshooting',
        'Documented technical specifications and procedures',
      ],
      type: 'internship',
    },
  ],
  footer: {
    text: '© 2024 Pushpa Koirala. Crafted with passion in Jyvaskyla, Finland.',
    links: [
      { name: 'Privacy Policy', url: '/privacy' },
      { name: 'Terms of Service', url: '/terms' },
    ],
  },
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: true,
      toggleTheme: () => {
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          // Update document classes immediately
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
          }
          return { isDarkMode: newDarkMode };
        });
      },

      // Auth
      user: null,
      login: (username: string, password: string) => {
        // Simple authentication - in production, use proper auth
        if (username === 'admin' && password === 'pushpa2024') {
          const user = { id: '1', username, isAuthenticated: true };
          set({ user });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),

      // Data loading
      isLoading: false,
      loadData: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('portfolio_data')
            .select('*');

          if (error) {
            console.error('Error loading data:', error);
            return;
          }

          if (data && data.length > 0) {
            const portfolioData: any = {};
            data.forEach((item) => {
              portfolioData[item.data_type] = item.content;
            });

            set({
              profile: portfolioData.profile || defaultData.profile,
              projects: portfolioData.projects || defaultData.projects,
              certificates: portfolioData.certificates || defaultData.certificates,
              experiences: portfolioData.experiences || defaultData.experiences,
              footer: portfolioData.footer || defaultData.footer,
            });
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      saveToDatabase: async (dataType: string, content: any) => {
        try {
          const { error } = await supabase
            .from('portfolio_data')
            .upsert({
              data_type: dataType,
              content: content,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'data_type'
            });

          if (error) {
            console.error('Error saving data:', error);
            throw error;
          }
        } catch (error) {
          console.error('Error saving to database:', error);
          throw error;
        }
      },

      // Projects
      projects: defaultData.projects,
      addProject: async (project) => {
        const newProject = { ...project, id: Date.now().toString() };
        const newProjects = [...get().projects, newProject];
        set({ projects: newProjects });
        await get().saveToDatabase('projects', newProjects);
      },
      updateProject: async (id, project) => {
        const newProjects = get().projects.map((p) => (p.id === id ? { ...p, ...project } : p));
        set({ projects: newProjects });
        await get().saveToDatabase('projects', newProjects);
      },
      deleteProject: async (id) => {
        const newProjects = get().projects.filter((p) => p.id !== id);
        set({ projects: newProjects });
        await get().saveToDatabase('projects', newProjects);
      },

      // Certificates
      certificates: defaultData.certificates,
      addCertificate: async (certificate) => {
        const newCertificate = { ...certificate, id: Date.now().toString() };
        const newCertificates = [...get().certificates, newCertificate];
        set({ certificates: newCertificates });
        await get().saveToDatabase('certificates', newCertificates);
      },
      updateCertificate: async (id, certificate) => {
        const newCertificates = get().certificates.map((c) => (c.id === id ? { ...c, ...certificate } : c));
        set({ certificates: newCertificates });
        await get().saveToDatabase('certificates', newCertificates);
      },
      deleteCertificate: async (id) => {
        const newCertificates = get().certificates.filter((c) => c.id !== id);
        set({ certificates: newCertificates });
        await get().saveToDatabase('certificates', newCertificates);
      },

      // Experience
      experiences: defaultData.experiences,
      addExperience: async (experience) => {
        const newExperience = { ...experience, id: Date.now().toString() };
        const newExperiences = [...get().experiences, newExperience];
        set({ experiences: newExperiences });
        await get().saveToDatabase('experiences', newExperiences);
      },
      updateExperience: async (id, experience) => {
        const newExperiences = get().experiences.map((e) => (e.id === id ? { ...e, ...experience } : e));
        set({ experiences: newExperiences });
        await get().saveToDatabase('experiences', newExperiences);
      },
      deleteExperience: async (id) => {
        const newExperiences = get().experiences.filter((e) => e.id !== id);
        set({ experiences: newExperiences });
        await get().saveToDatabase('experiences', newExperiences);
      },

      // Profile
      profile: defaultData.profile,
      updateProfile: async (profile) => {
        const newProfile = { ...get().profile, ...profile };
        set({ profile: newProfile });
        await get().saveToDatabase('profile', newProfile);
      },

      // Footer
      footer: defaultData.footer,
      updateFooter: async (footer) => {
        const newFooter = { ...get().footer, ...footer };
        set({ footer: newFooter });
        await get().saveToDatabase('footer', newFooter);
      },
    }),
    {
      name: 'portfolio-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        user: state.user,
      }),
    }
  )
);