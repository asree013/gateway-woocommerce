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
import { StockQuantity } from 'src/DTOS/stock.dto';
import { Filters } from 'src/models/searchproduct.model';
import { StockQuantityService } from 'src/services/stock-quantity/stock-quantity.service';

@Controller('stock-quantity')
export class StockQuantityController {
  constructor(
    @Inject('stockQuantity') private readonly service: StockQuantityService,
  ) {}
  @Post('search')
  searchStockByKey(@Body() item: Filters<StockQuantity>) {
    return this.service.search(item);
  }
  @Get()
  getStockQuanttiy() {
    return this.service.findAll();
  }
  @Get('all')
  getStockQuanttiyRelate() {
    return this.service.findStockAndQuantityAll();
  }
  @Get(':id')
  findStockQuantityById(@Param('id') id: number) {
    return this.service.findById(id);
  }
  @Get('sku/:id')
  findStockQuantityBySku(@Param('id') id: string) {
    return this.service.findBySku(id);
  }
  @Post()
  addStockQuantity(@Body() item: StockQuantity) {
    return this.service.create(item);
  }
  @Put(':id')
  editStock(@Param('id') id: string, @Body() item: StockQuantity) {
    return this.service.update(+id, item);
  }
  @Put('quantity/:id')
  editStockQuantity(@Param('id') id: number, @Body() item: StockQuantity) {
    return this.service.updateQuantity(id, item);
  }
  @Delete(':id')
  deleteStockQuantity(@Param('id') id: number) {
    return this.service.delete(id);
  }
  @Post('inventory/:sku')
  inventoryUpdate(@Param('sku') sku: string, @Body() item: StockQuantity) {
    return this.service.inventoryUpdate(sku, item);
  }
}
