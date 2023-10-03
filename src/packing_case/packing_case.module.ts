import { Module } from '@nestjs/common';
import { PakingCaseController } from './paking_case/paking_case.controller';
import { PackingCaseService } from 'src/services/packing_case/packing_case.service';

@Module({
  controllers: [PakingCaseController],
  providers: [
    {
      provide: 'packingCase',
      useClass: PackingCaseService,
    },
  ],
})
export class PackingCaseModule {}
