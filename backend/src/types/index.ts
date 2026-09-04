import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  author: Types.ObjectId | IUser;
  tags: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId | IUser;
  post: Types.ObjectId | IPost;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
