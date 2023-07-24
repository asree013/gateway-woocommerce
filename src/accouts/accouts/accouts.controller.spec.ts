import { Test, TestingModule } from '@nestjs/testing';
import { AccoutsController } from './accouts.controller';

describe('AccoutsController', () => {
  let controller: AccoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccoutsController],
    }).compile();

    controller = module.get<AccoutsController>(AccoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
