import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import {
  Customers,
  CustomersFormCreate,
} from '../../DTOS/woocommercDTO';

@Injectable()
export class CustomerService {
  constructor(@Inject('gateway') private readonly gateway: GatewayService) {}
  async findCustomerAll() {
    try {
      const result = await this.gateway.getAll('customers');
      console.log(result);
      if (result.length <= 0) {
        const responese = {
          status: 204,
          message: 'Is Not Data In Datebase',
        };
        return responese;
      }
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
  async createCustome(item: CustomersFormCreate) {
    try {
      const value = {
        email: item.email,
        first_name: item.first_name,
        last_name: item.last_name,
        username: item.username,
        password: item.password,
        billing: {
          first_name: item.first_name,
          last_name: item.first_name,
          address_1: item.address_1_bl,
          address_2: item.address_1_bl,
          city: item.city_bl,
          state: item.state_bl,
          postcode: item.postcode_bl.toString(),
          country: item.country_bl,
          phone: item.phone_bl,
          email: item.email,
        },
        shipping: {
          first_name: item.first_name,
          last_name: item.last_name,
          address_1: item.address_1_sp,
          address_2: item.address_2_sp,
          city: item.city_sp,
          state: item.state_sp,
          postcode: item.postcode_sp.toString(),
          country: item.country_sp,
        },
      } as Customers;
      console.log(value);

      const result = await this.gateway.create('customers', value);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async updateCustomer(id: number, item: Customers) {
    try {
      // const idCustomer = await this.findCustomerById(id);
      // if (idCustomer) {
      const result = await this.gateway.update('customers', id, item);
      return result;
      // }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteCustomerItem(id: number) {
    console.log('customer!!!!!!!!!!!!');

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
