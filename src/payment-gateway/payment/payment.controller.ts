import { Controller, Get, Inject, Param } from '@nestjs/common';
import { PaymentGatewayService } from 'src/services/payment-gateway/payment-gateway.service';

@Controller('payments')
export class PaymentController {
  constructor(
    @Inject('paymentGateway') private readonly service: PaymentGatewayService,
  ) {}
  @Get()
  getPaymentAll() {
    return this.service.findAll();
  }
  @Get(':id')
  getPaymentByid(@Param() id: number) {
    return this.service.findById(id);
  }
}
