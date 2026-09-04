export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  postCount?: number;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  author: User;
  tags: string[];
  views: number;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: Pagination;
}
