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
import { ProductService } from 'src/services/product/product.service';
import { Products } from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';

@Controller('products')
export class ProductController {
  constructor(@Inject('products') private readonly service: ProductService) {}
  @Get()
  getProductAll() {
    return this.service.findAll();
  }
  @Get(':id')
  getProductByid(@Param('id') id: number) {
    return this.service.findById(id);
  }
  @Post()
  addProduct(@Body() item: Products) {
    return this.service.create(item);
  }
  @Put(':id')
  editProduct(@Param('id') id: number, @Body() item: Products) {
    return this.service.update(id, item);
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.service.deleteY(id);
  }
}
