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
import { StockCreate, Stocks } from 'src/DTOS/stock.dto';
import { Filters } from 'src/models/searchproduct.model';
import { StocksService } from 'src/services/stocks/stocks.service';

@Controller('stock')
export class StockController {
  constructor(@Inject('stocks') private readonly service: StocksService) {}
  @Get()
  getStockAll() {
    return this.service.findAll();
  }
  @Post('page')
  getStockPagination(@Body() item: { page: number; pageSize: number }) {
    return this.service.findAllByPagination(item);
  }
  @Post()
  addStock(@Body() item: StockCreate) {
    console.log('stock create');
    return this.service.create(item);
  }
  @Get(':id')
  getStockById(@Param('id') id: number) {
    return this.service.findById(id);
  }
  @Get('sku/:sku')
  getStockBySKU(@Param('sku') sku: string) {
    return this.service.findSKU(sku);
  }
  @Get('product/:id')
  getStockByIdProduct(@Param('id') id: number) {
    return this.service.findByIdProduct(id);
  }
  @Get('product/detail/:id')
  getStockByIdProductDetail(@Param('id') id: number) {
    return this.service.findProductAndStockById(id);
  }
  @Put(':id')
  editStock(@Param('id') id: number, @Body() item: StockCreate) {
    return this.service.update(id, item);
  }
  @Delete(':id')
  deleteStock(@Param('id') id: number) {
    return this.service.delete(id);
  }
  @Post('search')
  searchStockByKey(@Body() item: Filters<Stocks>) {
    return this.service.search(item);
  }
}
