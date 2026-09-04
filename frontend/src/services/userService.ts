import api from './api';
import { ApiResponse, User } from '../types';

export const userService = {
  getUserById: async (id: string) => {
    const res = await api.get<ApiResponse<User>>(`/users/${id}`);
    return res.data;
  },
};
