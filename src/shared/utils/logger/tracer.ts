import { id } from 'cls-rtracer';

export const getRequestId = (): string => {
  return id() as string;
};

export const getTraceId = (traceId?: string): string => {
  return traceId || (id() as string);
};
