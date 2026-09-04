import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email, password) => {
        const res = await authService.login({ email, password });
        if (res.success && res.data) {
          localStorage.setItem('token', res.data.token);
          set({
            user: res.data.user,
            token: res.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          throw new Error(res.message || 'Login failed');
        }
      },

      register: async (name, email, password, confirmPassword) => {
        const res = await authService.register({ name, email, password, confirmPassword });
        if (res.success && res.data) {
          localStorage.setItem('token', res.data.token);
          set({
            user: res.data.user,
            token: res.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          throw new Error(res.message || 'Registration failed');
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            set({ user: res.data, token, isAuthenticated: true, isLoading: false });
          } else {
            get().logout();
          }
        } catch {
          get().logout();
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
