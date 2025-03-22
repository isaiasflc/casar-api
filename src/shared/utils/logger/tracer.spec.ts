import { getTraceId } from './tracer';
import { id } from 'cls-rtracer';

jest.mock('cls-rtracer', () => ({
  id: jest.fn(),
}));

describe('Tracer Utils', () => {
  beforeEach(() => {
    (id as jest.Mock).mockReturnValue('mocked-id');
  });

  it('getTraceId should return the same traceId received in the parameters', () => {
    expect(getTraceId('45370a7d-bf28-4015-b9c3-9459a1489485')).toBe('45370a7d-bf28-4015-b9c3-9459a1489485');
  });

  it('getTraceId should generate an id if the value provided in the parameters is invalid', () => {
    expect(getTraceId('')).toBe('mocked-id');
  });

  it('getTraceId should generate an id if no value is given', () => {
    expect(getTraceId()).toBe('mocked-id');
  });
});
