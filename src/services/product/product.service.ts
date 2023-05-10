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
    try {
      const result = await this.gateway.getById('products', id);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async create(data: Products) {
    try {
      const result = await this.gateway.create('products', data);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteY(id: number) {
    try {
      const result = await this.gateway.deleteForce('products', id);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async update(id: number, data: Products) {
    try {
      const products = await this.findById(id);
      if (!products) {
        throw new BadRequestException('is not Product in Database');
      }
      const update = await this.gateway.update('products', id, data);
      return update.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
