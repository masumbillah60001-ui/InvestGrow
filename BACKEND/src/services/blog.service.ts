import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PostStatus } from '@prisma/client';

export class BlogService {
    async getPosts(query: any) {
        const { page = 1, limit = 10, category, search } = query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = { status: PostStatus.PUBLISHED };
        if (category) where.category = category;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [total, posts] = await Promise.all([
            prisma.blogPost.count({ where }),
            prisma.blogPost.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { publishedAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    featuredImageUrl: true,
                    category: true,
                    tags: true,
                    readTimeMinutes: true,
                    publishedAt: true,
                    viewsCount: true
                }
            })
        ]);

        return { total, posts }; // Pagination meta handled in controller or here
    }

    async getPostBySlug(slug: string) {
        const post = await prisma.blogPost.findUnique({ where: { slug } });

        if (!post || post.status !== PostStatus.PUBLISHED) {
            throw new AppError('Post not found', 404);
        }

        // Async increment view count
        // prisma.blogPost.update({ where: { id: post.id }, data: { viewsCount: { increment: 1 } } }).catch(console.error);

        return post;
    }
}

export const blogService = new BlogService();
