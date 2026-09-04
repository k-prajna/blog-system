import mongoose, { Schema } from 'mongoose';
import { IPost } from '../types';

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Business', 'Health', 'Education', 'Other'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const Post = mongoose.model<IPost>('Post', postSchema);
