import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ProviceService } from 'src/services/provice/provice.service';

@Controller('province')
export class ProvinceController {
  constructor(@Inject('provinces') private readonly service: ProviceService) {}

  @Get('ampher_id/:id')
  getAmpherById(@Param('id') id: number) {
    return this.service.getTambolByTMId(id);
  }
  @Get('sector')
  getSectotAll() {
    return this.service.getSector();
  }
  @Get('provine/:sector_id')
  getProviceById(@Param('sector_id') sector_id: number) {
    return this.service.getProvinceByID(sector_id);
  }
  @Get('ampher/:province_id')
  getAmprerById(@Param('province_id') province_id: number) {
    return this.service.getAumpersById(province_id);
  }
  @Get('district/:ampher_id')
  getDistrictById(@Param('ampher_id') ampher_id: number) {
    return this.service.getTambolById(ampher_id);
  }
  @Get('province_id/:id')
  getProvinceById(@Param('id') id: number) {
    return this.service.getProvinceByidPV(id);
  }
}
