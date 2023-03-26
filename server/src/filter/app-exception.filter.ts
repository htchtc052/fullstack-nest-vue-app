import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    let httpMessage = exception!.stack.toString();
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      httpMessage = exception.message;
    }

    console.error(
      `Http error status=${httpStatus} errorMessage=${httpMessage}`,
    );

    const { httpAdapter } = this.httpAdapterHost;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: httpMessage,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
