import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostEntity } from '../../entities/post.entity';
import { UserEntity } from '../../entities/user.entity';
import { AppError } from '../../shared/errors/app-error';
import { ErrorEnum } from '../../shared/errors/app-error.enum';
import { TextProcessing } from '../../shared/providers/text-processing/text-processing.provider';
import { ConfigService } from '@nestjs/config';
import { PostRepository } from './post.repository';
import { SentimentEnum } from './enums/sentiment.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { TextProcessingSentimentEnum } from '../../shared/providers/text-processing/dto/text-processing-response.dto';
import { PostTypeEnum } from './enums/post-type.enum';

@Injectable()
export class PostService {
  private readonly configService: ConfigService;
  private readonly sentimentMap: Map<TextProcessingSentimentEnum, SentimentEnum>;

  constructor(
    private readonly postRepository: PostRepository,
    @Inject(TextProcessing)
    private readonly textProcessing: TextProcessing,
  ) {
    this.configService = new ConfigService();
    this.sentimentMap = new Map([
      [TextProcessingSentimentEnum.NEG, SentimentEnum.NEGATIVE],
      [TextProcessingSentimentEnum.NEUTRAL, SentimentEnum.NEUTRAL],
      [TextProcessingSentimentEnum.POS, SentimentEnum.POSITIVE],
    ]);
  }

  async createPost(userId: number, createPostDto: CreatePostDto): Promise<PostEntity> {

    const postsToday = await this.postRepository.countPostsByUserToday(userId);

    const dailyPostLimit = this.configService.get<number>('DAILY_POST_LIMIT') || 5;

    if (postsToday >= dailyPostLimit) {
      throw new AppError(ErrorEnum.DAILY_LIMIT_REACHED, HttpStatus.BAD_REQUEST);
    }

    const sentiment = await this.textProcessing.getSentiment(createPostDto.content);


    const newPost = {
      user: { id: userId } as UserEntity,
      content: createPostDto.content,
      comment: createPostDto.comment,
      type: this.setTypePost(createPostDto),
      originalPostId: createPostDto.originalPostId,
      sentiment: this.sentimentMap.get(sentiment),
      createdAt: new Date(),
    };

    return this.postRepository.createPost(newPost);
  }

  private setTypePost(post: CreatePostDto): PostTypeEnum {
    if (post.originalPostId) {
      return post.comment ? PostTypeEnum.RE_POST_COMMENT : PostTypeEnum.RE_POST;
    }
    return PostTypeEnum.POST;
  }

  async getPostsFeed(userId: number, following: boolean, limit: number, offset: number): Promise<PostEntity[]> {
    if (following) {
      return this.postRepository.findPostsByFollowing(userId, limit, offset);
    } else {
      return this.postRepository.findAllPosts(limit, offset);
    }
  }

  async getUserPosts(userId: number, limit: number, offset: number): Promise<PostEntity[]> {
    return this.postRepository.findPostsByUser(userId, limit, offset);
  }
}
