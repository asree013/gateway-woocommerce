import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import { Products } from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';

@Injectable()
export class ProductService {
  constructor(@Inject('gateway') private readonly gateway: GatewayService) {}
  async findAll() {
    try {
      const result = await this.gateway.getAll('products');
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: number) {
    const result = await this.gateway.getById('products', id);
    return result.data;
  }
  async create(data: Products) {
    try {
      const result = await this.gateway.create('products', data);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async delete(id: number) {
    try {
      const result = await this.gateway.delete('products', id);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async update(id: number, data: Products) {
    try {
      const update = this.gateway.update('products', id, data);
      return update;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
