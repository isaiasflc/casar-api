import { Module } from '@nestjs/common';
import { ConditionalModule, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from './config/pino.config';
import envVarsSchema from './config/enviroment.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerProvider } from './shared/providers/logger/logger';
import { NotFoundController } from './app.not-found.controller';
import { Post } from './entities/post.entity';
import { User } from './entities/user.entity';

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
      entities: [User, Post],
      synchronize: process.env.NODE_ENV !== 'production' ? true : false,
    }),
  ],
  controllers: [AppController, NotFoundController],
  providers: [AppService, LoggerProvider],
  exports: [LoggerProvider],
})
export class AppModule {}
