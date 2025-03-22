import { getRequestId } from '../shared/utils/logger/tracer';
import { Params } from 'nestjs-pino';

export const pinoConfig = {
  pinoHttp: {
    autoLogging: false,
    level: process.env.IS_LOG_DISABLED ? 'silent' : 'info',
    formatters: {
      level: (label: string): Record<string, string> => {
        return { level: label };
      },
    },
    mixin: () => {
      const requestTracker = {
        requestId: getRequestId(),
      };
      return { ...requestTracker };
    },
  },
} as Params;
