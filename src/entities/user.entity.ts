import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { PostEntity } from './post.entity';
import { Matches } from 'class-validator';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 14, unique: true })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'The username must contain only alphanumeric characters.',
  })
  username: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @ManyToMany(() => UserEntity, (user) => user.followers)
  @JoinTable()
  following: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.following)
  followers: UserEntity[];

  @OneToMany(() => PostEntity, (post: PostEntity) => post.user)
  posts: PostEntity[];
}
