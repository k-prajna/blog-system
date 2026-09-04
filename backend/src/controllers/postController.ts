import { Response } from 'express';
import { z } from 'zod';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';

const postSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  excerpt: z.string().min(10).max(300),
  coverImage: z.string().url().optional().or(z.literal('')),
  category: z.enum(['Technology', 'Lifestyle', 'Travel', 'Food', 'Business', 'Health', 'Education', 'Other']),
  tags: z.array(z.string()).optional().default([]),
});

export const getPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || '';
  const category = req.query.category as string;
  const sort = (req.query.sort as string) || 'newest';
  const author = req.query.author as string;

  const query: any = {};

  if (search) {
    query.$text = { $search: search };
  }
  if (category && category !== 'All') {
    query.category = category;
  }
  if (author) {
    query.author = author;
  }

  let sortOption: any = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'most-viewed') sortOption = { views: -1 };

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('author', 'name email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ]);

  // Attach comment counts
  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return { ...post, commentCount };
    })
  );

  res.json({
    success: true,
    message: 'Posts retrieved successfully',
    data: {
      posts: postsWithCounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

export const getPostById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email avatar');

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  // Increment views
  post.views += 1;
  await post.save();

  const commentCount = await Comment.countDocuments({ post: post._id });

  res.json({
    success: true,
    message: 'Post retrieved successfully',
    data: { ...post.toObject(), commentCount },
  });
});

export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors.map((e) => e.message).join(', '),
    });
  }

  const post = await Post.create({
    ...parsed.data,
    author: req.user!._id,
  });

  const populated = await Post.findById(post._id).populate('author', 'name email avatar');

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: populated,
  });
});

export const updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  if (post.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this post',
    });
  }

  const parsed = postSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors.map((e) => e.message).join(', '),
    });
  }

  Object.assign(post, parsed.data);
  await post.save();

  const populated = await Post.findById(post._id).populate('author', 'name email avatar');

  res.json({
    success: true,
    message: 'Post updated successfully',
    data: populated,
  });
});

export const deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  if (post.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this post',
    });
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();

  res.json({
    success: true,
    message: 'Post deleted successfully',
  });
});

export const getPostsByAuthor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const posts = await Post.find({ author: req.params.id })
    .populate('author', 'name email avatar')
    .sort({ createdAt: -1 })
    .lean();

  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return { ...post, commentCount };
    })
  );

  res.json({
    success: true,
    message: 'Author posts retrieved successfully',
    data: postsWithCounts,
  });
});
