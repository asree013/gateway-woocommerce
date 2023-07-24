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
import { BranchCreate } from 'src/DTOS/barnch.dto';
import { BranchService } from 'src/services/branch/branch.service';

@Controller('branch')
export class BranchController {
  constructor(@Inject('branch') private readonly service: BranchService) {}
  @Post()
  addBranch(@Body() item: BranchCreate) {
    return this.service.create(item);
  }
  @Get()
  getBranchAll() {
    return this.service.findAll();
  }
  @Get(':id')
  getBranchById(@Param('id') id: number) {
    return this.service.findOne(id);
  }
  @Put(':id')
  editBranch(@Param('id') id: number, @Body() item: BranchCreate) {
    console.log(id);
    console.log(item.title);
    return this.service.update(item, id);
  }
  @Delete(':id')
  deleteBranch(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
