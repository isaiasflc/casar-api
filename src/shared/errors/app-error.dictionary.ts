import { HttpStatus } from '@nestjs/common';
import { ErrorEnum } from './app-error.enum';

export type ErrorDictResponse = {
  responseCode: string;
  message: string;
  statusCode: number;
  errors?: Array<string> | string;
};

export const errorDictResponse = (
  errorEnum: ErrorEnum,
  errorStatus: HttpStatus,
  errors?: Array<string> | string,
): ErrorDictResponse => {
  const baseResponseData = {
    statusCode: errorStatus,
  };

  const mappedErrors = {
    [ErrorEnum.BAD_REQUEST]: {
      responseCode: 'MS-CASAR-001',
      message: 'Invalid request!',
      details: errors,
    },
    [ErrorEnum.DATABASE_ERROR]: {
      responseCode: 'MS-CASAR-003',
      message: 'Database Error',
      details: errors,
    },
    [ErrorEnum.RESOURCE_NOT_FOUND]: {
      responseCode: 'MS-CASAR-004',
      message: 'Resource not found error',
    },
    [ErrorEnum.ALREADY_EXISTS]: {
      responseCode: 'MS-CASAR-005',
      message: 'Resource already exists',
    },
    [ErrorEnum.URL_NOT_FOUND]: {
      responseCode: 'MS-CASAR-006',
      message: 'url not found error',
    },
    [ErrorEnum.DAILY_LIMIT_REACHED]: {
      responseCode: 'MS-CASAR-007',
      message: 'Daily limit of 5 posts reached.',
    },
    [ErrorEnum.CANNOT_FOLLOW_SELF]: {
      responseCode: 'MS-CASAR-008',
      message: 'You can not follow the same.',
    },
    [ErrorEnum.CANNOT_UNFOLLOW_SELF]: {
      responseCode: 'MS-CASAR-009',
      message: 'You can not unfollow the same.',
    },
    [ErrorEnum.INTERNAL_SERVER_ERROR]: {
      responseCode: 'MS-CASAR-999',
      message: 'Internal server error',
    },
  };

  const additionalResponseData = mappedErrors[errorEnum] as ErrorDictResponse;
  return {
    ...baseResponseData,
    ...additionalResponseData,
  };
};
