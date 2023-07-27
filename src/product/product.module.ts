import { Module } from '@nestjs/common';
import { ProductController } from './product/product.controller';
import { ProductService } from 'src/services/product/product.service';

@Module({
  providers: [
    {
      provide: 'products',
      useClass: ProductService,
    },
  ],
  controllers: [ProductController],
})
export class ProductModule {}
