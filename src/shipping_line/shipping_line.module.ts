import { Module } from '@nestjs/common';
import { ShippingLineController } from './shipping_line/shipping_line.controller';
import { ShippingLineService } from 'src/services/shipping_line/shipping_line.service';

@Module({
  controllers: [ShippingLineController],
  providers: [
    {
      provide: 'shippingLine',
      useClass: ShippingLineService,
    },
  ],
})
export class ShippingLineModule {}
