import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostService } from '../post.service';
import { PostRepository } from '../post.repository';
import { TextProcessing } from '../../../shared/providers/text-processing/text-processing.provider';
import { CreatePostDto } from '../dto/create-post.dto';
import { SentimentEnum } from '../enums/sentiment.enum';
import { TextProcessingSentimentEnum } from '../../../shared/providers/text-processing/dto/text-processing-response.dto';
import { PostTypeEnum } from '../enums/post-type.enum';
import { AppError } from '../../../shared/errors/app-error';
import { ErrorEnum } from '../../../shared/errors/app-error.enum';

describe('PostService', () => {
  let service: PostService;
  let postRepository: PostRepository;
  let textProcessing: TextProcessing;
  let configService: ConfigService;

  const mockDate = new Date(2025, 2, 23);

  beforeAll(() => {
    jest.useFakeTimers({ now: mockDate });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostRepository,
          useValue: {
            countPostsByUserToday: jest.fn(),
            createPost: jest.fn(),
            findPostsByUser: jest.fn(),
            findPostsByFollowing: jest.fn(),
            findAllPosts: jest.fn(),
          },
        },
        {
          provide: TextProcessing,
          useValue: {
            getSentiment: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<PostRepository>(PostRepository);
    textProcessing = module.get<TextProcessing>(TextProcessing);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    it.each([
      {
        createPostDto: { content: 'Test content' },
        type: PostTypeEnum.POST,
      },
      {
        createPostDto: { content: 'Test content', comment: 'Test comment', originalPostId: 2 },
        type: PostTypeEnum.RE_POST_COMMENT,
      },
      {
        createPostDto: { content: 'Test content', originalPostId: 2 },
        type: PostTypeEnum.RE_POST,
      },
    ])('should create a post', async ({ createPostDto, type }) => {
      const userId = 1;
      const sentiment = TextProcessingSentimentEnum.POS;
      const newPost = {
        user: { id: userId },
        content: createPostDto.content,
        comment: createPostDto.comment,
        originalPostId: createPostDto.originalPostId,
        sentiment: SentimentEnum.POSITIVE,
        createdAt: mockDate,
        type,
      };

      jest.spyOn(postRepository, 'countPostsByUserToday').mockResolvedValue(0);
      jest.spyOn(configService, 'get').mockReturnValue(5);
      jest.spyOn(textProcessing, 'getSentiment').mockResolvedValue(sentiment);
      jest.spyOn(postRepository, 'createPost').mockResolvedValue(newPost as any);

      const result = await service.createPost(userId, createPostDto);

      expect(result).toEqual(newPost);
      expect(postRepository.countPostsByUserToday).toHaveBeenCalledWith(userId);
      expect(textProcessing.getSentiment).toHaveBeenCalledWith(createPostDto.content);
      expect(postRepository.createPost).toHaveBeenCalledWith(newPost);
    });

    it('should throw an error if daily post limit is reached', async () => {
      const userId = 1;
      const createPostDto: CreatePostDto = {
        content: 'Test content',
        comment: 'Test comment',
        originalPostId: null,
      };

      jest.spyOn(postRepository, 'countPostsByUserToday').mockResolvedValue(5);
      jest.spyOn(configService, 'get').mockReturnValue(5);

      await expect(service.createPost(userId, createPostDto)).rejects.toThrow(
        new AppError(ErrorEnum.DAILY_LIMIT_REACHED, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('getPostsFeed', () => {
    it('should return posts by following', async () => {
      const userId = 1;
      const limit = 10;
      const offset = 0;
      const posts = [{ id: 1, content: 'Test post' }];

      jest.spyOn(postRepository, 'findPostsByFollowing').mockResolvedValue(posts as any);

      const result = await service.getPostsFeed(userId, true, limit, offset);

      expect(result).toEqual(posts);
      expect(postRepository.findPostsByFollowing).toHaveBeenCalledWith(userId, limit, offset);
    });

    it('should return all posts', async () => {
      const limit = 10;
      const offset = 0;
      const posts = [{ id: 1, content: 'Test post' }];

      jest.spyOn(postRepository, 'findAllPosts').mockResolvedValue(posts as any);

      const result = await service.getPostsFeed(1, false, limit, offset);

      expect(result).toEqual(posts);
      expect(postRepository.findAllPosts).toHaveBeenCalledWith(limit, offset);
    });
  });

  describe('getUserPosts', () => {
    it('should return posts by user', async () => {
      const userId = 1;
      const limit = 5;
      const offset = 0;
      const posts = [{ id: 1, content: 'Test post' }];

      jest.spyOn(postRepository, 'findPostsByUser').mockResolvedValue(posts as any);

      const result = await service.getUserPosts(userId, limit, offset);

      expect(result).toEqual(posts);
      expect(postRepository.findPostsByUser).toHaveBeenCalledWith(userId, limit, offset);
    });
  });
});