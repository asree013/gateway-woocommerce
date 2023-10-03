import { Module } from '@nestjs/common';
import { StockQuantityController } from './stock-quantity/stock-quantity.controller';
import { StockQuantityService } from 'src/services/stock-quantity/stock-quantity.service';

@Module({
  controllers: [StockQuantityController],
  providers: [
    {
      provide: 'stockQuantity',
      useClass: StockQuantityService,
    },
  ],
})
export class StockQuantityModule {}
