import api from './api';
import { ApiResponse, Comment } from '../types';

export const commentService = {
  getComments: async (postId: string) => {
    const res = await api.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`);
    return res.data;
  },

  createComment: async (postId: string, content: string) => {
    const res = await api.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, { content });
    return res.data;
  },

  updateComment: async (id: string, content: string) => {
    const res = await api.put<ApiResponse<Comment>>(`/comments/${id}`, { content });
    return res.data;
  },

  deleteComment: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/comments/${id}`);
    return res.data;
  },
};
