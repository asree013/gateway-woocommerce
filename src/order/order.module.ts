import { Module } from '@nestjs/common';
import { OrderController } from './order/order.controller';
import { OrderService } from 'src/services/order/order.service';

@Module({
  providers: [
    {
      provide: 'orders',
      useClass: OrderService,
    },
  ],
  controllers: [OrderController],
})
export class OrderModule {}
