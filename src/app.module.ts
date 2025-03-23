import { Module } from '@nestjs/common';
import { ConditionalModule, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from './config/pino.config';
import envVarsSchema from './config/environment.config';
import { LoggerProvider } from './shared/providers/logger/logger';
import { NotFoundController } from './app.not-found.controller';
import { PostEntity } from './entities/post.entity';
import { UserEntity } from './entities/user.entity';
import { ProfileModule } from './modules/profile/profile.module';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    ConditionalModule.registerWhen(
      GracefulShutdownModule.forRoot(),
      (env: NodeJS.ProcessEnv) => env['NODE_ENV'] != 'test',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envVarsSchema,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      validationOptions: {
        abortEarly: false,
      },
    }),
    LoggerModule.forRoot(pinoConfig),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [UserEntity, PostEntity],
      synchronize: process.env.NODE_ENV !== 'production' ? true : false,
    }),
    PostModule,
    ProfileModule,
  ],
  controllers: [NotFoundController],
  providers: [LoggerProvider],
  exports: [LoggerProvider],
})
export class AppModule { }
