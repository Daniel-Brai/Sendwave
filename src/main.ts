import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@pkg/config';
import { IsAuthenticated } from '@utils/helpers';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './app.exceptions';
import { join } from 'node:path';
import { cwd } from 'node:process';
import * as express from 'express';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const serverLogger = new Logger('Server');
  const requestLogger = new Logger('Request');
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
  

  app.useStaticAssets(join(cwd(), 'app/client/assets'));
  app.setBaseViewsDir(join(cwd(), 'app/client/views'));
  app.setViewEngine('ejs');

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser())
  app.use(compression({ level: 9 }));

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.locals.isAuthenticated = IsAuthenticated.bind(null, req);
    next();
  });

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    requestLogger.verbose(
      `The url invoked is: '${req.originalUrl}' from ip address -> ${req.ip}, status code: ${res.statusCode}`,
    );
    next();
  });

  await app.listen(appPort, async () => {
    serverLogger.log(`Server is up and running at -> ${await app.getUrl()}...`);
  });

  app.enableShutdownHooks();
}
bootstrap();
