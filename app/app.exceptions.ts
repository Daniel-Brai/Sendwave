import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { formatTimestamp } from '@utils/formatters';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const context = {
      statusCode: status,
      error: errorResponse['error'],
      message: errorResponse['message'],
      timestamp: formatTimestamp(Date.now()),
    };
    return response.status(context.statusCode).json(context);
  }
}

