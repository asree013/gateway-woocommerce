import { Global, Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { GatewayService } from './services/gateway/gateway.service';
import { OrderModule } from './order/order.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';
import { CouponsModule } from './coupons/coupons.module';
import { MulterModule } from '@nestjs/platform-express';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CachingService } from './services/caching/caching.service';
import { CustomerModule } from './customer/customer.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConnectDbService } from './services/connect_db/connect_db.service';
import { BranchModule } from './branch/branch.module';
import { AccoutsModule } from './accouts/accouts.module';
import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';
import { StockModule } from './stock/stock.module';

@Global()
@Module({
  imports: [
    ProductModule,
    OrderModule,
    PaymentGatewayModule,
    CouponsModule,
    MulterModule,
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
      },
    }),
    CustomerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/uploads'),
      serveRoot: '/images',
    }),
    BranchModule,
    AccoutsModule,
    UsersModule,
    ImagesModule,
    StockModule,
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
    {
      provide: 'connectDB',
      useClass: ConnectDbService,
    },
  ],
  exports: ['gateway', MulterModule, 'caching', 'connectDB'],
})
export class AppModule {}
