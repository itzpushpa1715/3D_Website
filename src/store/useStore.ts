import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  lastUpdateTime: number;
  loadData: () => Promise<void>;
  saveToDatabase: (dataType: string, content: any) => Promise<void>;
  setupRealtimeSubscription: () => void;
  cleanupRealtimeSubscription: () => void;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Certificates
  certificates: Certificate[];
  addCertificate: (certificate: Omit<Certificate, 'id'>) => Promise<void>;
  updateCertificate: (id: string, certificate: Partial<Certificate>) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;

  // Experience
  experiences: Experience[];
  addExperience: (experience: Omit<Experience, 'id'>) => Promise<void>;
  updateExperience: (id: string, experience: Partial<Experience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

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
  updateProfile: (profile: Partial<Store['profile']>) => Promise<void>;

  // Footer
  footer: {
    text: string;
    links: { name: string; url: string }[];
  };
  updateFooter: (footer: Partial<Store['footer']>) => Promise<void>;
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

// Global variable to store the subscription
let realtimeSubscription: any = null;
let isUpdatingFromRealtime = false;

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

      // Real-time subscription setup
      setupRealtimeSubscription: () => {
        if (!isSupabaseConfigured() || realtimeSubscription) {
          return; // Skip if not configured or already subscribed
        }

        try {
          realtimeSubscription = supabase
            .channel('portfolio_changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'portfolio_data',
              },
              (payload) => {
                console.log('Real-time update received:', payload);
                
                // Prevent infinite loops by checking if we're already updating
                if (isUpdatingFromRealtime) {
                  return;
                }
                
                // Only update if this is not the current user making the change
                if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
                  const { data_type, content, updated_at } = payload.new;
                  const currentUpdateTime = get().lastUpdateTime;
                  const payloadTime = new Date(updated_at).getTime();
                  
                  // Only update if the payload is newer than our last update
                  if (payloadTime > currentUpdateTime) {
                    isUpdatingFromRealtime = true;
                    
                    // Update the specific data type in the store
                    switch (data_type) {
                      case 'profile':
                        // Add cache busting timestamp to profile image
                        if (content.profileImage && !content.profileImage.includes('t=')) {
                          content.profileImage = content.profileImage.includes('?') 
                            ? `${content.profileImage}&t=${Date.now()}`
                            : `${content.profileImage}?t=${Date.now()}`;
                        }
                        set({ profile: content, lastUpdateTime: payloadTime });
                        break;
                      case 'projects':
                        set({ projects: content, lastUpdateTime: payloadTime });
                        break;
                      case 'certificates':
                        set({ certificates: content, lastUpdateTime: payloadTime });
                        break;
                      case 'experiences':
                        set({ experiences: content, lastUpdateTime: payloadTime });
                        break;
                      case 'footer':
                        set({ footer: content, lastUpdateTime: payloadTime });
                        break;
                    }
                    
                    setTimeout(() => {
                      isUpdatingFromRealtime = false;
                    }, 1000);
                  }
                }
              }
            )
            .subscribe((status) => {
              console.log('Realtime subscription status:', status);
            });
        } catch (error) {
          console.error('Error setting up realtime subscription:', error);
        }
      },

      cleanupRealtimeSubscription: () => {
        if (realtimeSubscription) {
          try {
            supabase.removeChannel(realtimeSubscription);
            realtimeSubscription = null;
          } catch (error) {
            console.error('Error cleaning up subscription:', error);
          }
        }
      },

      // Data loading
      isLoading: false,
      lastUpdateTime: 0,
      loadData: async () => {
        set({ isLoading: true });
        
        // If Supabase is not configured, use default data
        if (!isSupabaseConfigured()) {
          console.log('Supabase not configured, using default data');
          set({
            profile: defaultData.profile,
            projects: defaultData.projects,
            certificates: defaultData.certificates,
            experiences: defaultData.experiences,
            footer: defaultData.footer,
            isLoading: false,
            lastUpdateTime: Date.now(),
          });
          return;
        }

        try {
          const { data, error } = await supabase
            .from('portfolio_data')
            .select('*')
            .order('updated_at', { ascending: false });

          if (error) {
            console.error('Error loading data:', error);
            // Use default data if database fails
            set({
              profile: defaultData.profile,
              projects: defaultData.projects,
              certificates: defaultData.certificates,
              experiences: defaultData.experiences,
              footer: defaultData.footer,
              lastUpdateTime: Date.now(),
            });
            return;
          }

          if (data && data.length > 0) {
            const portfolioData: any = {};
            let latestUpdateTime = 0;
            
            data.forEach((item) => {
              portfolioData[item.data_type] = item.content;
              const itemTime = new Date(item.updated_at).getTime();
              if (itemTime > latestUpdateTime) {
                latestUpdateTime = itemTime;
              }
            });

            // Add timestamp to profile image to force cache refresh
            const profile = portfolioData.profile || defaultData.profile;
            if (profile.profileImage && !profile.profileImage.includes('t=')) {
              profile.profileImage = profile.profileImage.includes('?') 
                ? `${profile.profileImage}&t=${Date.now()}`
                : `${profile.profileImage}?t=${Date.now()}`;
            }

            set({
              profile: profile,
              projects: portfolioData.projects || defaultData.projects,
              certificates: portfolioData.certificates || defaultData.certificates,
              experiences: portfolioData.experiences || defaultData.experiences,
              footer: portfolioData.footer || defaultData.footer,
              lastUpdateTime: latestUpdateTime,
            });
          } else {
            // No data found, use defaults
            set({
              profile: defaultData.profile,
              projects: defaultData.projects,
              certificates: defaultData.certificates,
              experiences: defaultData.experiences,
              footer: defaultData.footer,
              lastUpdateTime: Date.now(),
            });
          }

          // Setup real-time subscription after initial load
          get().setupRealtimeSubscription();
        } catch (error) {
          console.error('Error loading data:', error);
          // Use default data on error
          set({
            profile: defaultData.profile,
            projects: defaultData.projects,
            certificates: defaultData.certificates,
            experiences: defaultData.experiences,
            footer: defaultData.footer,
            lastUpdateTime: Date.now(),
          });
        } finally {
          set({ isLoading: false });
        }
      },

      saveToDatabase: async (dataType: string, content: any) => {
        // If Supabase is not configured, just update local state
        if (!isSupabaseConfigured()) {
          console.log('Supabase not configured, data saved locally only');
          return;
        }

        // Prevent saving during realtime updates
        if (isUpdatingFromRealtime) {
          return;
        }

        try {
          const now = new Date().toISOString();
          const { error } = await supabase
            .from('portfolio_data')
            .upsert({
              data_type: dataType,
              content: content,
              updated_at: now,
            }, {
              onConflict: 'data_type'
            });

          if (error) {
            console.error('Error saving data:', error);
            throw error;
          }

          // Update our local timestamp to prevent unnecessary realtime updates
          set({ lastUpdateTime: new Date(now).getTime() });
          
          console.log(`Successfully saved ${dataType} to database`);
        } catch (error) {
          console.error('Error saving to database:', error);
          // Don't throw error to prevent UI from breaking
          console.log('Data saved locally only');
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
        // Create the updated profile
        const newProfile = { ...get().profile, ...profile };
        
        // Add timestamp to image URL to force cache refresh if it's a new image
        if (newProfile.profileImage && profile.profileImage && !newProfile.profileImage.includes('t=')) {
          newProfile.profileImage = newProfile.profileImage.includes('?') 
            ? `${newProfile.profileImage}&t=${Date.now()}`
            : `${newProfile.profileImage}?t=${Date.now()}`;
        }
        
        // Update local state first
        set({ profile: newProfile });
        
        // Save to database
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