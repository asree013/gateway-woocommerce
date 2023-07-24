import { Test, TestingModule } from '@nestjs/testing';
import { AccoutService } from './accout.service';

describe('AccoutService', () => {
  let service: AccoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccoutService],
    }).compile();

    service = module.get<AccoutService>(AccoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
