import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../src/entities/user.entity';
import { Post } from '../src/entities/post.entity';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Post],
    synchronize: process.env.NODE_ENV !== 'production' ? true : false,
});

async function seedUsers() {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);

    const users = [
        {
            username: 'isaisasTeste03',
        },
        {
            username: 'isaisasTeste04',
        },
        {
            username: 'isaisasTeste05',
        },
    ];

    for (const user of users) {
        const newUser = userRepository.create(user);
        await userRepository.save(newUser);
        console.log(`Usuário criado: ${newUser.username}`);
    }

    await AppDataSource.destroy();
    console.log('Seed concluído!');
}

seedUsers().catch((error) => console.error(error));
