import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getObjectClassName, isObject } from '../../utils/validators/validate-object';

interface IAdditionalLogData {
  details?: {
    exception?: string;
    message: string;
    stack?: string;
  };
  info?: object;
  error?: object;
}
interface ILogObject {
  label: string;
  message: object | string | undefined;
  environment: string | undefined;
  date: Date;
}

@Injectable()
export class LoggerProvider {
  private static logger: Logger = new Logger();
  private static configService: ConfigService = new ConfigService();

  private static mountLogObject(label: string, message?: object | string): ILogObject {
    return {
      label,
      message: message || undefined,
      environment: this.configService.get('NODE_ENV'),
      date: new Date(),
    };
  }
  private static logErrorData(error?: Error): IAdditionalLogData {
    const errorData: IAdditionalLogData = {
      error,
    };
    if (isObject(error) && error instanceof Error) {
      const errorName = getObjectClassName(error, 'Error');
      errorData.details = { exception: errorName, message: error.message };
      if (!(error instanceof HttpException)) {
        errorData.details.stack = error.stack;
      }
    }
    return errorData;
  }

  public static loggerInfo(label: string, info?: object | string): void {
    const logObject = this.mountLogObject(label, info);
    this.logger.log(logObject);
  }

  public static loggerError(label: string, error?: Error): void {
    const details = this.logErrorData(error);
    const logObject = this.mountLogObject(label, {
      ...details?.error,
      ...details?.details,
    });
    this.logger.error(logObject);
  }
}
