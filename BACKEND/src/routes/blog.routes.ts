import { Router } from 'express';
import { blogController } from '../controllers/blog.controller';

const router = Router();

router.get('/posts', blogController.getPosts);
router.get('/posts/:slug', blogController.getPost);

export default router;
