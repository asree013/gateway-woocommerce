import { Module } from '@nestjs/common';
import { StockController } from './stock/stock.controller';
import { StocksService } from 'src/services/stocks/stocks.service';

@Module({
  controllers: [StockController],
  providers: [
    {
      provide: 'stocks',
      useClass: StocksService,
    },
  ],
})
export class StockModule {}
