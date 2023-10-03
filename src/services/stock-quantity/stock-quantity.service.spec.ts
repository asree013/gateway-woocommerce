import { Test, TestingModule } from '@nestjs/testing';
import { StockQuantityService } from './stock-quantity.service';

describe('StockQuantityService', () => {
  let service: StockQuantityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockQuantityService],
    }).compile();

    service = module.get<StockQuantityService>(StockQuantityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
