import { Module } from '@nestjs/common';
import { ConditionalModule, ConfigModule } from '@nestjs/config';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from './config/pino.config';
import envVarsSchema from './config/enviroment.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerProvider } from './shared/providers/logger/logger';
import { NotFoundController } from './app.not-found.controller';

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
  ],
  controllers: [AppController, NotFoundController],
  providers: [AppService, LoggerProvider],
  exports: [LoggerProvider],
})
export class AppModule {}
