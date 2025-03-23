import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from '../src/entities/user.entity';
import { PostEntity } from '../src/entities/post.entity';
import { SentimentEnum } from '../src/modules/post/enums/sentiment.enum';
import { PostTypeEnum } from '../src/modules/post/enums/post-type.enum';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [UserEntity, PostEntity],
    synchronize: process.env.NODE_ENV !== 'production' ? true : false,
});

async function seedPost() {
    await AppDataSource.initialize();
    const postRepository = AppDataSource.getRepository(PostEntity);

    const posts = [
        {
            user: { id: 1 } as UserEntity,
            content: 'textpost01',
            type: PostTypeEnum.POST,
            sentiment: SentimentEnum.POSITIVE,
            createdAt: new Date(),
        },
        {
            user: { id: 2 } as UserEntity,
            content: 'textpost02',
            type: PostTypeEnum.POST,
            sentiment: SentimentEnum.NEGATIVE,
            createdAt: new Date(),
        },
        {
            user: { id: 1 } as UserEntity,
            content: 'textpost02',
            comment: 'comment01',
            type: PostTypeEnum.RE_POST_COMMENT,
            originalPostId: 2,
            sentiment: SentimentEnum.NEUTRAL,
            createdAt: new Date(),
        },
    ];

    for (const post of posts) {
        const newPost = postRepository.create(post);
        await postRepository.save(newPost);
        console.log(`Post criado: ${newPost.content}`);
    }

    await AppDataSource.destroy();
    console.log('Seed concluído!');
}

seedPost().catch((error) => console.error(error));
