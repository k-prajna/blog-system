import { Router } from 'express';
import { updateComment, deleteComment } from '../controllers/commentController';
import { protect } from '../middleware/auth';

const router = Router();

router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
