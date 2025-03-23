import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from '../../entities/post.entity';
import { GetPostsFeedQueryDto } from './dto/get-post-feed.dto';
import { GetPostsUserQueryDto } from './dto/get-post-user.dto';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post(':userId')
    async createPost(
        @Param('userId') userId: number,
        @Body() createPostDto: CreatePostDto,
    ): Promise<void> {
        await this.postService.createPost(userId, createPostDto);
    }

    @Get(':userId')
    async getUserPost(
        @Param('userId') userId: number,
        @Query() query: GetPostsUserQueryDto,
    ): Promise<PostEntity[]> {
        return this.postService.getUserPosts(userId, query.limit, query.page);
    }

    @Get(':userId/feed')
    async getPostFeed(
        @Param('userId') userId: number,
        @Query() query: GetPostsFeedQueryDto,
    ): Promise<PostEntity[]> {
        const followingBool = query.following === 'true';
        return this.postService.getPostsFeed(userId, followingBool, query.limit, query.page);
    }


}