import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { PackingCase, PackingCaseCreate, PackingCaseDetailCreate } from 'src/DTOS/packingCase';
import { PackingCaseService } from 'src/services/packing_case/packing_case.service';

@Controller('paking-case')
export class PakingCaseController {
  constructor(
    @Inject('packingCase') private readonly service: PackingCaseService,
  ) {}
  @Get()
  getPackingCase() {
    return this.service.findAll();
  }
  @Get(':id')
  getPackingCaseById(@Param('id') id: number){
    return this.service.findById(id)
  }
  @Post()
  addPackingCase(@Body() item: PackingCaseCreate, itemDetail: PackingCaseDetailCreate) {
    return this.service.create(item, itemDetail);
  }
  
}
