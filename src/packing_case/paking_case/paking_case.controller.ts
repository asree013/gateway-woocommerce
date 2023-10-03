import { Controller, Get, Inject } from '@nestjs/common';
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
}
