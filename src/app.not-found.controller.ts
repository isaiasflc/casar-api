import { Controller, All, HttpCode, HttpStatus } from '@nestjs/common';
import { ErrorEnum } from './shared/errors/app-error.enum';
import { AppError } from './shared/errors/app-error';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class NotFoundController {
  @All('*')
  @HttpCode(404)
  notFound(): object {
    throw new AppError(ErrorEnum.URL_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
