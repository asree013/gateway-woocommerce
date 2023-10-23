import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Customers } from 'src/DTOS/woocommercDTO';
import { CustomerService } from 'src/services/customer/customer.service';
import { CustomersFormCreate } from '../../DTOS/woocommercDTO';

@Controller('customers')
export class CustomerController {
  constructor(@Inject('customer') private readonly service: CustomerService) {}
  @Get()
  getCustomerAll() {
    return this.service.findCustomerAll();
  }
  @Post()
  addCustomer(@Body() item: CustomersFormCreate) {
    return this.service.createCustome(item);
  }
  @Get(':id')
  getCustomerById(@Param('id') id: number) {
    return this.service.findCustomerById(id);
  }
  @Put(':id')
  editCustomer(@Param('id') id: number, @Body() item: Customers) {
    return this.service.updateCustomer(id, item);
  }
  // @Delete(':id')
  // deleteCustomer(@Param('id') id: number) {
  //   return this.service.deleteCustomerItem(id);
  // }
  // @Delete('un/:id')
  // unDeleteCustomer(@Param() id: string) {
  //   return this.service.unDeleteCustomer(+id);
  // }
}
