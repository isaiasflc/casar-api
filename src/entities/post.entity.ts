import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  content: string;

  @Column()
  type: 'original' | 'repost' | 'comment';

  @Column()
  sentiment: 'pos' | 'neg' | 'neutral';

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createAt: Date;

  @ManyToOne(() => User, (user: User) => user.posts)
  user: User;
}
