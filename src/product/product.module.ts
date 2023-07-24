import { Module } from '@nestjs/common';
import { ProductController } from './product/product.controller';
import { ProductService } from 'src/services/product/product.service';
import { ProductsModule } from './products/products.module';

@Module({
  providers: [
    {
      provide: 'products',
      useClass: ProductService,
    },
  ],
  controllers: [ProductController],
  imports: [ProductsModule],
})
export class ProductModule {}
