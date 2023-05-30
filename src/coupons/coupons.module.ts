import { Module } from '@nestjs/common';
import { CouponsController } from './coupons/coupons.controller';
import { CouponsService } from 'src/services/coupons/coupons.service';

@Module({
  providers: [
    {
      provide: 'coupons',
      useClass: CouponsService,
    },
  ],
  controllers: [CouponsController],
})
export class CouponsModule {}
