import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import { Orders } from 'src/DTOS/woocommercDTO';
import { CachingService } from '../caching/caching.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject('gateway') private readonly gateway: GatewayService,
    @Inject('caching') private readonly caches: CachingService,
  ) {}
  async findAll() {
    try {
      const result: Orders[] | undefined = JSON.parse(
        await this.caches.getRedisOrders(),
      );
      if (!result) {
        const result: Orders[] = await this.gateway.getAll('orders');
        return result;
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: number) {
    try {
      const result = await this.gateway.getById('orders', id);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async createOrder(item: Orders) {
    try {
      const result = await this.gateway.create('orders', item);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async updateOrder(id: number, item: Orders) {
    try {
      // const find = await this.findById(id)
      // return find
      const result = await this.gateway.update('orders', id, item);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteY(id: number) {
    console.log('ser', id);
    try {
      const result = await this.gateway.deleteForce('orders', Number(id));
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteN(id: number) {
    try {
      const result = await this.gateway.unDeleteForce('orders', id);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
