import { Test, TestingModule } from '@nestjs/testing';
import { ProviceService } from './provice.service';

describe('ProviceService', () => {
  let service: ProviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviceService],
    }).compile();

    service = module.get<ProviceService>(ProviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
