import api from '../lib/api';

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginResponse {
  user: UserResponse;
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  password?: string;
}

export const userService = {
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/users/login', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get('/users/current');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
    const response = await api.patch('/users/current', data);
    return response.data;
  },
};