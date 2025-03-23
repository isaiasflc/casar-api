import { TestingModule, Test } from '@nestjs/testing';
import { NotFoundController } from './app.not-found.controller';

describe('NotFoundController', () => {
  let notFoundController: NotFoundController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotFoundController],
    }).compile();

    notFoundController = app.get<NotFoundController>(NotFoundController);
  });

  describe('notFound method', () => {
    it('NotFoundController should return status 404 on response.', () => {
      expect(() => notFoundController.notFound()).toThrow('url not found error');
    });
  });
});
