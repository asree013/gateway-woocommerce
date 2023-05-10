import { Global, Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { GatewayService } from './services/gateway/gateway.service';
import { OrderModule } from './order/order.module';

@Global()
@Module({
  imports: [ProductModule, OrderModule],
  providers: [
    {
      provide: 'gateway',
      useClass: GatewayService,
    },
  ],
  exports: ['gateway'],
})
export class AppModule {}
