import { Router } from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController';
import { protect } from '../middleware/auth';

const router = Router({ mergeParams: true });

// For /api/posts/:postId/comments
router.get('/', getComments);
router.post('/', protect, createComment);

export default router;
