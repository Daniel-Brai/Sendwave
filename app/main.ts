import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@pkg/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './app.exceptions';
import { join } from 'node:path';
import * as express from 'express';
import * as compression from 'compression';
import * as hbs from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = app.get(Logger);
  const configService = app.get(ConfigService);
  const appUrl = app.getUrl();
  const appPort = configService.get().environment.port;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter())

  app.engine(
    'hbs',
    hbs.engine({
      extname: 'hbs',
      partialsDir: join(__dirname, 'views/partials'),
    }),
  );
  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, 'assets'));
  app.setBaseViewsDir(join(__dirname, 'views'));

  app.use(express.urlencoded({ extended: true }));
  app.use(compression({ level: 9 }));
  
  await app.listen(appPort, () => {
    logger.log(`[Server]: Server is up and running at -> ${appUrl}:${appPort}...`);
  });

  app.enableShutdownHooks();
}
bootstrap();
