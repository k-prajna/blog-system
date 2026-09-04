import { Response } from 'express';
import { z } from 'zod';
import { Comment } from '../models/Comment';
import { Post } from '../models/Post';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    message: 'Comments retrieved successfully',
    data: comments,
  });
});

export const createComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors.map((e) => e.message).join(', '),
    });
  }

  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  const comment = await Comment.create({
    content: parsed.data.content,
    author: req.user!._id,
    post: req.params.postId,
  });

  const populated = await Comment.findById(comment._id).populate('author', 'name email avatar');

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: populated,
  });
});

export const updateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found',
    });
  }

  if (comment.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this comment',
    });
  }

  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors.map((e) => e.message).join(', '),
    });
  }

  comment.content = parsed.data.content;
  await comment.save();

  const populated = await Comment.findById(comment._id).populate('author', 'name email avatar');

  res.json({
    success: true,
    message: 'Comment updated successfully',
    data: populated,
  });
});

export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found',
    });
  }

  if (comment.author.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this comment',
    });
  }

  await comment.deleteOne();

  res.json({
    success: true,
    message: 'Comment deleted successfully',
  });
});
