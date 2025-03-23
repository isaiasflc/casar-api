import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { SentimentEnum } from '../modules/post/enums/sentiment.enum';
import { PostTypeEnum } from '../modules/post/enums/post-type.enum';

@Entity({ name: 'post' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  content: string;

  @Column({ nullable: true })
  originalPostId: number;

  @Column({ length: 200, nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: PostTypeEnum,
  })
  type: PostTypeEnum;

  @Column({
    type: 'enum',
    enum: SentimentEnum,
  })
  sentiment: SentimentEnum;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  user: UserEntity;
}
