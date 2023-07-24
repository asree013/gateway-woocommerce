import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CustomerService } from 'src/services/customer/customer.service';
import { Customers } from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';

@Controller('customers')
export class CustomerController {
  constructor(@Inject('customer') private readonly service: CustomerService) {}
  @Get()
  getCustomerAll() {
    return this.service.findCustomerAll();
  }
  @Get(':id')
  getCustomerById(@Param() id: string) {
    return this.service.findCustomerById(+id);
  }
  @Post()
  //Email is uniceKey//
  addCustomer(@Body() item: Customers) {
    return this.service.createCustome(item);
  }
  @Delete(':id')
  deleteCustomer(@Param() id: string) {
    return this.service.deleteCustomerItem(+id);
  }
  @Delete('un/:id')
  unDeleteCustomer(@Param() id: string) {
    return this.service.unDeleteCustomer(+id);
  }
}
