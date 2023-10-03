import { Module } from '@nestjs/common';
import { ProvinceController } from './province/province.controller';
import { ProviceService } from 'src/services/provice/provice.service';

@Module({
  providers: [
    {
      provide: 'provinces',
      useClass: ProviceService,
    },
  ],
  controllers: [ProvinceController],
})
export class ProviceModule {}
