import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AppError } from '../shared/errors/app-error';
import { errorDictResponse } from '../shared/errors/app-error.dictionary';
import { ErrorEnum } from '../shared/errors/app-error.enum';
import { LoggerProvider } from '../shared/providers/logger/logger';
import { getRequestId } from '../shared/utils/logger/tracer';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    LoggerProvider.loggerError('[CASAR][MS][ERROR][HANDLER]', exception as Error);

    if (exception instanceof AppError) {
      LoggerProvider.loggerError('[CASAR][MS][ERROR][APP_ERROR]', exception as Error);
      return response.code(httpStatus).send(exception.getResponse());
    }

    if (exception instanceof BadRequestException) {
      LoggerProvider.loggerError('[CASAR][MS][ERROR][BAD_REQUEST]', exception as Error);
      const responseBody = exception.getResponse();
      const errorResponse = errorDictResponse(
        ErrorEnum.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
        responseBody['message'] as string | string[],
      );

      return response.code(HttpStatus.BAD_REQUEST).send({ ...errorResponse, requestId: getRequestId() });
    }

    LoggerProvider.loggerError('[CASAR][MS][ERROR][NOTICE_ERROR]', exception as Error);

    const errorResponse = errorDictResponse(ErrorEnum.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);

    return response.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ ...errorResponse, requestId: getRequestId() });
  }
}
