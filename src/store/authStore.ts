// src/store/authStore.ts
import { create } from 'zustand';
import { userService, UserResponse } from '../service/user.service';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string; password?: string }) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initializeAuth: async () => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        set({ user: parsedUser, isAuthenticated: true });

        const currentUser = await userService.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(currentUser));
        set({ user: currentUser, isAuthenticated: true });
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
      }
    }
    set({ isLoading: false });
  },

  login: async (email, password) => {
    const response = await userService.login({ email, password });
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    set({ user: response.user, isAuthenticated: true });
  },

  register: async (name, email, password) => {
    const response = await userService.register({ name, email, password });
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    set({ user: response.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    const updatedUser = await userService.updateProfile(data);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));

export default useAuthStore;