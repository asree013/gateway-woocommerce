import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import { Orders } from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';

@Injectable()
export class OrderService {
  constructor(@Inject('gateway') private readonly gateway: GatewayService) {}
  async getOrderAll() {
    const result = await this.gateway.getAll('orders');
    return result.data;
  }
  async getOrderById(id: number) {
    try {
      const result = await this.gateway.getById('orders', id);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async createOrder(item: Orders) {
    try {
      const result = await this.gateway.create('orders', item);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async updateOrder(id: number, item: Orders) {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new BadRequestException('is not Order in Database');
      }
      const result = await this.gateway.update('orders', id, item);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteY(id: number) {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new BadRequestException('is not Order in Database');
      }
      const result = await this.gateway.deleteForce('orders', id);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteN(id: number) {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new BadRequestException('is not Order in Database');
      }
      const result = await this.gateway.unDeleteForce('orders', id);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
