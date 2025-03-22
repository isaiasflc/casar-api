import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from '@fastify/helmet';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { fastifyMiddleware as fastifyMiddlewareTracer } from 'cls-rtracer';
import { GlobalInterceptor, setupHooks } from './interceptors/global.interceptor';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

type SetupDocumentationOptions = {
  apiTitle: string;
  apiDescription: string;
  apiVersion: string;
  path: string;
};

export async function setupApplication(app: NestFastifyApplication) {
  const fastifyApp = app.getHttpAdapter().getInstance();
  setupHooks(fastifyApp);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await app.register(helmet);

  app.use(fastifyMiddlewareTracer());
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new GlobalInterceptor(), new LoggerErrorInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
}

export function setupDocumentation(app: NestFastifyApplication, options: SetupDocumentationOptions) {
  const { apiTitle, apiDescription, apiVersion, path } = options;

  const config = new DocumentBuilder().setTitle(apiTitle).setDescription(apiDescription).setVersion(apiVersion).build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(path, app, document);
}
