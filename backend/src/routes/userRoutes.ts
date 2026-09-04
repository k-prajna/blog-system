import { Router } from 'express';
import { getUserById } from '../controllers/userController';
import { getPostsByAuthor } from '../controllers/postController';

const router = Router();

router.get('/:id', getUserById);
router.get('/:id/posts', getPostsByAuthor);

export default router;
