import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class PaymentGatewayService {
  constructor(@Inject('gateway') private readonly gateway: GatewayService) {}
  async findAll() {
    try {
      const result = await this.gateway.getAll('payment_gateways');
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: number) {
    try {
      const result = await this.gateway.getById('payment_gateways', id);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
