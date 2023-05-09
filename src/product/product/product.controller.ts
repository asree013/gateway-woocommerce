import { Controller, Get, Inject } from '@nestjs/common';
import { ProductService } from 'src/services/product/product.service';

@Controller('products')
export class ProductController {
  constructor(@Inject('products') private readonly service: ProductService) {}
  @Get()
  getProductAll() {
    return this.service.findAll();
  }
}
