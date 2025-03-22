import { HttpException, HttpStatus } from '@nestjs/common';
import { errorDictResponse } from './app-error.dictionary';
import { ErrorEnum } from './app-error.enum';
import { getRequestId } from '../utils/logger/tracer';

class AppError extends HttpException {
  constructor(errorEnum: ErrorEnum, errorStatus: HttpStatus, errors?: Array<string> | string) {
    const dictResponse = errorDictResponse(errorEnum, errorStatus, errors);

    super(
      {
        ...dictResponse,
        requestId: getRequestId(),
      },
      errorStatus,
    );
  }
}

export { AppError };
