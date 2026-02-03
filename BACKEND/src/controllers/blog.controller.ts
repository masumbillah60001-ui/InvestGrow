import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blog.service';

export class BlogController {
    async getPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await blogService.getPosts(req.query);
            res.status(200).json({ success: true, data: result });
        } catch (error) { next(error); }
    }

    async getPost(req: Request, res: Response, next: NextFunction) {
        try {
            const post = await blogService.getPostBySlug(req.params.slug as string);
            res.status(200).json({ success: true, data: post });
        } catch (error) { next(error); }
    }
}

export const blogController = new BlogController();
