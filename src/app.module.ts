import { Global, Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { GatewayService } from './services/gateway/gateway.service';
import { OrderModule } from './order/order.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';
import { CouponsModule } from './coupons/coupons.module';
import { MulterModule } from '@nestjs/platform-express';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CachingService } from './services/caching/caching.service';

@Global()
@Module({
  imports: [
    ProductModule,
    OrderModule,
    PaymentGatewayModule,
    CouponsModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
        fileFilter(req, file, callback) {
          file.filename = new Date().toISOString() + '.jpeg' + file.mimetype;
          callback(null, true);
        },
      }),
    }),
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
      },
    }),
  ],
  providers: [
    {
      provide: 'gateway',
      useClass: GatewayService,
    },
    {
      provide: 'caching',
      useClass: CachingService,
    },
  ],
  exports: ['gateway', MulterModule, 'caching'],
})
export class AppModule {}
