import { Test, TestingModule } from '@nestjs/testing';
import { PackingCaseService } from './packing_case.service';

describe('PackingCaseService', () => {
  let service: PackingCaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackingCaseService],
    }).compile();

    service = module.get<PackingCaseService>(PackingCaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
