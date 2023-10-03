import { Test, TestingModule } from '@nestjs/testing';
import { PakingCaseController } from './paking_case.controller';

describe('PakingCaseController', () => {
  let controller: PakingCaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PakingCaseController],
    }).compile();

    controller = module.get<PakingCaseController>(PakingCaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
