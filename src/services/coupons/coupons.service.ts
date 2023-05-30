import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import { Coupons } from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';

@Injectable()
export class CouponsService {
  constructor(@Inject('gateway') private readonly gateway: GatewayService) {}
  async findAll() {
    try {
      const result = await this.gateway.getAll('coupons');
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findByid(id: number) {
    try {
      const result = await this.gateway.getById('coupons', id);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async createCoupons(item: Coupons) {
    try {
      const result = await this.gateway.create('coupons', item);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
