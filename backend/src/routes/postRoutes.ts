import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor,
} from '../controllers/postController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.get('/author/:id', getPostsByAuthor);

export default router;
