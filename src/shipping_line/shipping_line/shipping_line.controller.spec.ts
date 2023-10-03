import { Test, TestingModule } from '@nestjs/testing';
import { ShippingLineController } from './shipping_line.controller';

describe('ShippingLineController', () => {
  let controller: ShippingLineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingLineController],
    }).compile();

    controller = module.get<ShippingLineController>(ShippingLineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
