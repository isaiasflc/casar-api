import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TextProcessingModule } from '../../shared/providers/text-processing/text-processing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../../entities/post.entity';
import { PostRepository } from './post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), TextProcessingModule],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
  ],
})
export class PostModule { }