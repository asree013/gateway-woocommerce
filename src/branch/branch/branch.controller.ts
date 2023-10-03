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
import { Branch, CreateWareHouse } from 'src/DTOS/barnch.dto';
import { Filters } from 'src/models/searchproduct.model';
import { BranchService } from 'src/services/branch/branch.service';

@Controller('branch')
export class BranchController {
  constructor(@Inject('branch') private readonly service: BranchService) {}
  @Post()
  addBranch(@Body() item: CreateWareHouse) {
    return this.service.create(item);
  }
  @Get()
  getBranchAll() {
    return this.service.findAll();
  }
  @Post('search')
  searchBrach(@Body() value: Filters<Branch>) {
    return this.service.search(value);
  }
  @Get(':id')
  getBranchById(@Param('id') id: number) {
    return this.service.findOne(id);
  }
  @Put(':id')
  editBranch(@Param('id') id: number, @Body() item: CreateWareHouse) {
    console.log(id);
    console.log(item.title);
    return this.service.update(item, id);
  }
  @Delete(':id')
  deleteBranch(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
