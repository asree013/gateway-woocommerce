import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrderService } from 'src/services/order/order.service';
import { Orders } from 'src/DTOS/woocommercDTO';
import * as crypto from 'crypto';

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
  editOrder(@Param('id') id: number, @Body() item: Orders) {
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
  @Post('webhook')
  handlerWebhook(@Body() item: any, @Headers('x-wc-webhook-signature') signature: string,) {
    const secret = '%X5zy<pNG3,1{@h?Zfu+/~!IBoP:uUNf nbL[Y>< o`Wq;Lx8f'; // เป็นความลับที่คุณตั้งค่าใน WooCommerce
    const hmac = crypto.createHmac('sha256', secret);
    const computedSignature = hmac.update(JSON.stringify(item)).digest('base64');

    if (computedSignature !== signature) {
      // ถ้าลายเซ็นเจอร์ไม่ตรงกัน ให้ตอบกลับด้วยข้อผิดพลาด
      throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    }

    // ถ้าลายเซ็นเจอร์ถูกต้อง คุณสามารถทำการประมวลผลข้อมูลตามที่คุณต้องการ
    // และตอบกลับด้วยสถานะสำเร็จ
    return 'Webhook processed successfully'+ item;
  }
}
