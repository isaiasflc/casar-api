import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../post.controller';
import { PostService } from '../post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostEntity } from '../../../entities/post.entity';
import { GetPostsFeedQueryDto } from '../dto/get-post-feed.dto';
import { GetPostsUserQueryDto } from '../dto/get-post-user.dto';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            createPost: jest.fn(),
            getUserPosts: jest.fn(),
            getPostsFeed: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const userId = 1;
      const createPostDto: CreatePostDto = {
        content: 'Test content',
        comment: 'Test comment',
        originalPostId: null,
      };

      jest.spyOn(service, 'createPost').mockResolvedValue(undefined);

      await controller.createPost(userId, createPostDto);

      expect(service.createPost).toHaveBeenCalledWith(userId, createPostDto);
    });
  });

  describe('getUserPost', () => {
    it('should return user posts', async () => {
      const userId = 1;
      const query: GetPostsUserQueryDto = { limit: 5, page: 0 };
      const posts: PostEntity[] = [{ id: 1, content: 'Test post' } as PostEntity];

      jest.spyOn(service, 'getUserPosts').mockResolvedValue(posts);

      const result = await controller.getUserPost(userId, query);

      expect(result).toEqual(posts);
      expect(service.getUserPosts).toHaveBeenCalledWith(userId, query.limit, query.page);
    });
  });

  describe('getPostFeed', () => {
    it('should return posts feed for following users', async () => {
      const userId = 1;
      const query: GetPostsFeedQueryDto = { following: 'true', limit: 10, page: 0 };
      const posts: PostEntity[] = [{ id: 1, content: 'Test post' } as PostEntity];

      jest.spyOn(service, 'getPostsFeed').mockResolvedValue(posts);

      const result = await controller.getPostFeed(userId, query);

      expect(result).toEqual(posts);
      expect(service.getPostsFeed).toHaveBeenCalledWith(userId, true, query.limit, query.page);
    });

    it('should return posts feed for all users', async () => {
      const userId = 1;
      const query: GetPostsFeedQueryDto = { following: 'false', limit: 10, page: 0 };
      const posts: PostEntity[] = [{ id: 1, content: 'Test post' } as PostEntity];

      jest.spyOn(service, 'getPostsFeed').mockResolvedValue(posts);

      const result = await controller.getPostFeed(userId, query);

      expect(result).toEqual(posts);
      expect(service.getPostsFeed).toHaveBeenCalledWith(userId, false, query.limit, query.page);
    });
  });
});