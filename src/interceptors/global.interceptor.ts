import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyRequest, FastifyReply, FastifyInstance, DoneFuncWithErrOrRes } from 'fastify';
import { Observable, tap } from 'rxjs';
import { getRequestId } from '../shared/utils/logger/tracer';
import { parseJSON } from '../shared/utils/json';
import { LoggerProvider } from '../shared/providers/logger/logger';
import { responseCodes } from '../shared/constants/response-code';

export interface Response {
  data: object;
  responseId: string;
}

@Injectable()
export class GlobalInterceptor implements NestInterceptor<Response> {
  intercept(context: ExecutionContext, next: CallHandler<Response>): Observable<Response> {
    return next.handle().pipe(
      tap({
        next: response => {
          response['requestId'] = getRequestId();
          response['responseCode'] = responseCodes.success;
        },
        error: (errorResponse: Response) => {
          errorResponse['requestId'] = getRequestId();
        },
      }),
    );
  }
}

export const setupHooks = (server: FastifyInstance): void => {
  server.addHook(
    'onSend',
    (request: FastifyRequest, _reply: FastifyReply, payloadResponse: string, done: DoneFuncWithErrOrRes) => {
      const requestParams = {
        url: request.url,
        method: request.method,
        query: request.query,
        params: request.params,
        body: request.body,
      };

      LoggerProvider.loggerInfo('[CASAR][MS][REQUEST][RESPONSE][INFO]', {
        request: requestParams,
        response: parseJSON(payloadResponse),
      });

      done();
    },
  );
  server.addHook('onRequest', (request: FastifyRequest, _reply: FastifyReply, done: DoneFuncWithErrOrRes) => {
    const transactionName = `${request.method} - ${request.url}`;
    LoggerProvider.loggerInfo('[CASAR][MS][REQUEST][BEGIN]', transactionName);
    done();
  });
};
