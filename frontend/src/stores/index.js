import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  toggleTheme: () =>
    set((state) => {
      const newDark = !state.isDark;
      localStorage.setItem('theme', newDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newDark);
      return { isDark: newDark };
    }),
  initTheme: () => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    set({ isDark });
  },
}));

export const usePortfolioStore = create((set) => ({
  profile: null,
  projects: [],
  skills: [],
  certifications: [],
  experiences: [],
  stats: null,
  isLoading: true,

  setProfile: (profile) => set({ profile }),
  setProjects: (projects) => set({ projects }),
  setSkills: (skills) => set({ skills }),
  setCertifications: (certifications) => set({ certifications }),
  setExperiences: (experiences) => set({ experiences }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export const useAdminStore = create((set) => ({
  token: localStorage.getItem('admin_token') || null,
  isAuthenticated: !!localStorage.getItem('admin_token'),

  login: (token) => {
    localStorage.setItem('admin_token', token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    set({ token: null, isAuthenticated: false });
  },
}));
