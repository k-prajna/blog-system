import api from './api';
import { ApiResponse, Post, PostsResponse } from '../types';

export interface PostQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  author?: string;
}

export const postService = {
  getPosts: async (params: PostQuery = {}) => {
    const res = await api.get<ApiResponse<PostsResponse>>('/posts', { params });
    return res.data;
  },

  getPostById: async (id: string) => {
    const res = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return res.data;
  },

  createPost: async (data: Partial<Post>) => {
    const res = await api.post<ApiResponse<Post>>('/posts', data);
    return res.data;
  },

  updatePost: async (id: string, data: Partial<Post>) => {
    const res = await api.put<ApiResponse<Post>>(`/posts/${id}`, data);
    return res.data;
  },

  deletePost: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/posts/${id}`);
    return res.data;
  },

  getPostsByAuthor: async (authorId: string) => {
    const res = await api.get<ApiResponse<Post[]>>(`/users/${authorId}/posts`);
    return res.data;
  },
};
