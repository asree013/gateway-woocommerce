import { Test, TestingModule } from '@nestjs/testing';
import { ConnectDbService } from './connect_db.service';

describe('ConnectDbService', () => {
  let service: ConnectDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectDbService],
    }).compile();

    service = module.get<ConnectDbService>(ConnectDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
