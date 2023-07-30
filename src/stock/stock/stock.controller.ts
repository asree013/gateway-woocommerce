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
import { StockCreate } from 'src/DTOS/stock.dto';
import { StocksService } from 'src/services/stocks/stocks.service';

@Controller('stock')
export class StockController {
  constructor(@Inject('stocks') private readonly service: StocksService) {}
  @Get()
  getStockAll() {
    return this.service.findAll();
  }
  @Post()
  addStock(@Body() item: StockCreate) {
    return this.service.create(item);
  }
  @Get(':id')
  getStockById(@Param('id') id: number) {
    return this.service.findById(id);
  }
  @Get('product/:id')
  getStockByIdProduct(@Param('id') id: number) {
    return this.service.findByIdProduct(id);
  }
  @Put(':id')
  editStock(@Param('id') id: number, @Body() item: StockCreate) {
    return this.service.update(id, item);
  }
  @Delete(':id')
  deleteStock(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
