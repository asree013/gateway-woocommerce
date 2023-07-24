import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import { Customers } from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';

@Injectable()
export class CustomerService {
  constructor(@Inject('gateway') private readonly gateway: GatewayService) {}
  async findCustomerAll() {
    try {
      const result = await this.gateway.getAll('customers');
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findCustomerById(id: number) {
    try {
      const result = await this.gateway.getById('customers', id);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async createCustome(item: Customers) {
    try {
      const result = await this.gateway.create('customers', item);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updateCustomer(id: number, item: Customers) {
    try {
      const idCustomer = await this.findCustomerById(id);
      if (idCustomer) {
        const result = await this.gateway.update('customers', idCustomer, item);
        return result;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteCustomerItem(id: number) {
    try {
      const result = await this.gateway.deleteForce('customers', id);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async unDeleteCustomer(id: number) {
    try {
      const result = await this.gateway.unDeleteForce('customers', id);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
