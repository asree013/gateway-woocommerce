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
import { OrderService } from 'src/services/order/order.service';
import { Orders } from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';

@Controller('orders')
export class OrderController {
  constructor(@Inject('orders') private readonly service: OrderService) {}
  @Get()
  findAll() {
    return this.service.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(+id);
  }
  @Post()
  createOrder(@Body() item: Orders) {
    return this.service.createOrder(item);
  }
  @Put(':id')
  editOrder(@Param() id: number, @Body() item: Orders) {
    return this.service.updateOrder(id, item);
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.deleteY(id);
  }
  @Delete('no/:id')
  deleteIn(@Param('id') id: number) {
    return this.service.deleteN(id);
  }
}
