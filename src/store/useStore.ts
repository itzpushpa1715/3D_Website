import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

      // Projects
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
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { ...project, id: Date.now().toString() }],
        })),
      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      // Certificates
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
      addCertificate: (certificate) =>
        set((state) => ({
          certificates: [...state.certificates, { ...certificate, id: Date.now().toString() }],
        })),
      updateCertificate: (id, certificate) =>
        set((state) => ({
          certificates: state.certificates.map((c) => (c.id === id ? { ...c, ...certificate } : c)),
        })),
      deleteCertificate: (id) =>
        set((state) => ({
          certificates: state.certificates.filter((c) => c.id !== id),
        })),

      // Experience
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
      addExperience: (experience) =>
        set((state) => ({
          experiences: [...state.experiences, { ...experience, id: Date.now().toString() }],
        })),
      updateExperience: (id, experience) =>
        set((state) => ({
          experiences: state.experiences.map((e) => (e.id === id ? { ...e, ...experience } : e)),
        })),
      deleteExperience: (id) =>
        set((state) => ({
          experiences: state.experiences.filter((e) => e.id !== id),
        })),

      // Profile
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
          email: 'pushpa@example.com',
        },
      },
      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),

      // Footer
      footer: {
        text: '© 2024 Pushpa Koirala. Crafted with passion in Jyvaskyla, Finland.',
        links: [
          { name: 'Privacy Policy', url: '/privacy' },
          { name: 'Terms of Service', url: '/terms' },
        ],
      },
      updateFooter: (footer) =>
        set((state) => ({
          footer: { ...state.footer, ...footer },
        })),
    }),
    {
      name: 'portfolio-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        profile: state.profile,
        projects: state.projects,
        certificates: state.certificates,
        experiences: state.experiences,
        footer: state.footer,
      }),
    }
  )
);