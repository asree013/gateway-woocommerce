import { Controller, Get, Inject } from '@nestjs/common';
import { ShippingLineService } from 'src/services/shipping_line/shipping_line.service';

@Controller('shipping-line')
export class ShippingLineController {
  constructor(
    @Inject('shippingLine') private readonly service: ShippingLineService,
  ) {}

  @Get()
  getShoppingLine() {
    return this.service.findShoppingLine();
  }
}
