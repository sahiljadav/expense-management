import api from '../lib/api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  registerAdmin: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  signup: async (data: any) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
};
