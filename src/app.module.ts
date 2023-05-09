import { Global, Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { GatewayService } from './services/gateway/gateway.service';

@Global()
@Module({
  imports: [ProductModule],
  providers: [
    {
      provide: 'gateway',
      useClass: GatewayService,
    },
  ],
  exports: ['gateway'],
})
export class AppModule {}
