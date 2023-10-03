import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class ShippingLineService {
  constructor(@Inject('gateway') private service: GatewayService) {}

  async findShoppingLine() {
    try {
      const result = await this.service.getAll('shipping_methods');
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
