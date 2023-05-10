import {
  BadGatewayException,
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
  async findAll() {
    const result = await this.service.getOrderAll();
    return result.data;
  }
  @Get(':id')
  async findById(id: number) {
    const result = await this.service.getOrderById(id);
    return result.data;
  }
  @Post()
  async createOrder(@Body() item: Orders) {
    try {
      const result = await this.service.createOrder(item);
      return result.data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
  @Put(':id')
  async editOrder(@Param() id: number, @Body() item: Orders) {
    try {
      const result = await this.service.updateOrder(id, item);
      return result.data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
  @Delete(':id')
  async delete(@Param() id: number) {
    try {
      const order = await this.findById(id);
      if (!order) {
        throw new BadGatewayException('is not Order in Database');
      }
      const result = await this.service.deleteY(id);
      return result.data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
