import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { setupApplication, setupDocumentation } from './server';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  await setupApplication(app);

  setupGracefulShutdown({ app });

  const configService = app.get(ConfigService);

  setupDocumentation(app, {
    apiTitle: 'Api Casar',
    apiDescription: 'API com o objetivo de fornecer gestão de posts(pensamentos) da rede social.',
    apiVersion: '1.0.0',
    path: 'swagger',
  });

  await app.listen(configService.get<number | string>('PORT', 3000), '0.0.0.0');
}

bootstrap().catch(err => {
  console.error('Error during bootstrap', err);
});
