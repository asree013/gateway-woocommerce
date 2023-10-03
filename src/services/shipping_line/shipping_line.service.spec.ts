import { Test, TestingModule } from '@nestjs/testing';
import { ShippingLineService } from './shipping_line.service';

describe('ShippingLineService', () => {
  let service: ShippingLineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingLineService],
    }).compile();

    service = module.get<ShippingLineService>(ShippingLineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
