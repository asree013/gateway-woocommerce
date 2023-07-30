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
import { AccoutCreate, AccoutUpdate } from 'src/DTOS/accout.dto';
import {
  AccoutSearchAdmin,
  ImagesCreate,
} from 'src/models/images.accout.model';
import { AccoutService } from 'src/services/accout/accout.service';

@Controller('accouts')
export class AccoutsController {
  constructor(@Inject('accout') private readonly service: AccoutService) {}
  @Post('admin')
  getAccoutAllAdmin(@Body() item: AccoutSearchAdmin) {
    return this.service.findAllAccoutAdmin(item);
  }
  @Get('/ondate')
  getAccoutOnDate() {
    return this.service.findAllAccoutOnDate();
  }
  @Get('/ondate/:id')
  getAccoutOnDateAndBranch(@Param('id') id: number) {
    return this.service.findAllAccoutFormIdBranchAndBranch(id);
  }
  @Get('/images')
  getAccoutImage() {
    return this.service.FindImageAll();
  }
  @Get()
  getAccout() {
    return this.service.findAll();
  }
  @Get('all')
  getAccoutAll() {
    return this.service.findAllAccoutFormIdBranch();
  }
  @Get(':id')
  getAccoutById(@Param('id') id: number) {
    return this.service.findById(id);
  }
  @Get('images/:id')
  getAccoutImageById(@Param('id') id: number) {
    return this.service.FindImageByid(id);
  }
  @Get('images/accout/:id')
  getAccoutImageByIdAccout(@Param('id') id: number) {
    return this.service.FindImageByidAccout(id);
  }
  @Post()
  addAccout(@Body() item: AccoutCreate) {
    console.log(item);
    return this.service.create(item);
  }
  @Post('images')
  addImageAccouts(@Body() item: ImagesCreate) {
    return this.service.createImage(item);
  }
  @Put(':id')
  editAccout(@Param('id') id: number, @Body() item: AccoutUpdate) {
    return this.service.update(id, item);
  }
  @Delete(':id')
  deleteAccout(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
