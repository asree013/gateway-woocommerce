import { Module } from '@nestjs/common';
import { PaymentController } from './payment/payment.controller';
import { PaymentGatewayService } from 'src/services/payment-gateway/payment-gateway.service';

@Module({
  providers: [
    {
      provide: 'paymentGateway',
      useClass: PaymentGatewayService,
    },
  ],
  controllers: [PaymentController],
})
export class PaymentGatewayModule {}
