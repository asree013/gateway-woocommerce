import { Test, TestingModule } from '@nestjs/testing';
import { StockQuantityController } from './stock-quantity.controller';

describe('StockQuantityController', () => {
  let controller: StockQuantityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockQuantityController],
    }).compile();

    controller = module.get<StockQuantityController>(StockQuantityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
