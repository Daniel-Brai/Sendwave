import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@pkg/config';
import * as basicAuth from 'express-basic-auth';
import { SWAGGER_CONFIG } from './swagger.config';

const SWAGGER_ENVS = ['test', 'development', 'production'];

/**
 * Creates an OpenAPI document for an application, via swagger.
 * @param app the nestjs application
 * @returns the OpenAPI document
 */
export function createSwaggerDocument(app: INestApplication) {
  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .addCookieAuth('access_token', {
      type: 'http',
      in: 'Header',
      scheme: 'Bearer',
    })
    .setDescription(SWAGGER_CONFIG.description)
    .setExternalDoc('Postman Collection', '/api/docs-json')
    .setVersion(SWAGGER_CONFIG.version);
  for (const tag of SWAGGER_CONFIG.tags) {
    builder.addTag(tag);
  }
  const options = builder.build();
  const env = app.get(ConfigService).get().environment.type;
  const { username, password }: any = app.get(ConfigService).get()
    .services.swagger;
  if (SWAGGER_ENVS.includes(env)) {
    app.use(
      '/api/docs',
      basicAuth({
        challenge: true,
        users: {
          [username]: password,
        },
      }),
    );
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        requestInterceptor: (req: any) => {
          req.credentials = 'include';
          return req;
        },
      },
    });
  }
}
