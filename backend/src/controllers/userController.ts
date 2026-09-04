import { Response } from 'express';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';

export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const postCount = await Post.countDocuments({ author: user._id });

  res.json({
    success: true,
    message: 'User retrieved successfully',
    data: {
      ...user.toObject(),
      postCount,
    },
  });
});
