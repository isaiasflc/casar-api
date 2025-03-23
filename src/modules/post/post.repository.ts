import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../entities/post.entity';

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>,
    ) { }

    async countPostsByUserToday(userId: number): Promise<number> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.postRepository.count({
            where: {
                user: { id: userId },
                createdAt: today,
            },
        });
    }

    async createPost(post: Partial<PostEntity>): Promise<PostEntity> {
        return this.postRepository.save(post);
    }

    async findAllPosts(limit: number, page: number): Promise<PostEntity[]> {
        return this.postRepository.find({
            take: limit,
            skip: this.calculateOffset(limit, page),
            order: { createdAt: 'DESC' },
        });
    }

    async findPostsByFollowing(userId: number, limit: number, page: number): Promise<PostEntity[]> {
        const offset = this.calculateOffset(limit, page)

        return this.postRepository.createQueryBuilder('post')
            .innerJoin('post.user', 'user')
            .innerJoin('user.followers', 'follower', 'follower.id = :userId', { userId })
            .take(limit)
            .skip(offset)
            .orderBy('post.createdAt', 'DESC')
            .getMany();
    }

    async findPostsByUser(userId: number, limit: number, page: number): Promise<PostEntity[]> {
        return this.postRepository.find({
            where: { user: { id: userId } },
            take: limit,
            skip: this.calculateOffset(limit, page),
            order: { createdAt: 'DESC' },
        });
    }

    private calculateOffset(limit: number, page: number): number {
        return (page - 1) * limit;
    }
}
