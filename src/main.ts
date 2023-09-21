import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@pkg/config';
import { createSwaggerDocument } from '@pkg/swagger';
import { IsAuthenticated } from '@utils/helpers';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './app.filters';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import * as PgStore from 'connect-pg-simple';
import * as express from 'express';
import helmet from 'helmet';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);
  const port = configService.get().environment.port;

  app.useLogger(logger);
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
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableVersioning();

  app.setViewEngine('ejs');
  app.useStaticAssets(join(cwd(), 'app/client/assets'));
  app.setBaseViewsDir(join(cwd(), 'app/client/views'));

  app.use(
    session({
      store: new (PgStore(session))({
        conString: `${configService.get().services.database.url}`,
        createTableIfMissing: true,
        tableName: 'user_sessions',
      }),
      secret: `${configService.get().authentication.cookie_token_secret}`,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'img-src': ["'self'", 'https: data:'],
      },
    }),
  );
  app.use(compression({ level: 5, compression: 512 }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      res.locals.isAuthenticated = IsAuthenticated.bind(null, req);
      next();
    },
  );

  createSwaggerDocument(app);

  await app.listen(port, async () => {
    logger.log(`Server is up and running at -> ${await app.getUrl()}...`);
  });

  app.enableShutdownHooks();
}
bootstrap();
