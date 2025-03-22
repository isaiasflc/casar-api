import { Test, TestingModule } from '@nestjs/testing';
import { LoggerProvider } from './logger';

describe('LoggerProvider', () => {
  let provider: LoggerProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerProvider],
    }).compile();

    provider = module.get<LoggerProvider>(LoggerProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
