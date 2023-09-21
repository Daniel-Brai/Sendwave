import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { formatTimestamp } from '@utils/formatters';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 403 || status === 404 || status === 500) {
      response.render('error', {
        title: `${status} | Sendwave`,
        statusCode: status,
        msg: exception.message,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: formatTimestamp(Date.now()),
        path: request.url,
        method: request.method,
        message: exception.message,
      });
    }
  }
}
