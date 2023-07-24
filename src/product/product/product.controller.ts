import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from 'src/services/product/product.service';
import {
  Categories,
  Products,
} from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';
import { Filters } from 'src/models/searchproduct.model';
import { storage } from 'src/configs/image.config';

@Controller('products')
export class ProductController {
  constructor(@Inject('products') private readonly service: ProductService) {}
  path = 'http://localhost:3000/images/';

  @Get('catagory')
  getCatagory() {
    return this.service.findCatagory();
  }
  @Get()
  getProductAll() {
    return this.service.findAll();
  }
  @Get(':id')
  getProductByid(@Param('id') id: string) {
    return this.service.findById(+id);
  }
  @Post('catagory')
  createCategory(@Body() item: Categories) {
    return this.service.craeteCatagory(item);
  }
  @Post('search')
  searchInCaches(@Body() item: Filters<Products>) {
    try {
      return this.service.search(item);
    } catch (error) {
      console.log(error);
    }
  }
  @Post()
  addProduct(@Body() item: Products) {
    return this.service.create(item);
  }
  @Post('batch')
  addProducts(@Body() item: Products[]) {
    const data = { create: item };
    console.log(data);
    return this.service.createProducts(data);
  }
  @Put(':id')
  editProduct(@Param('id') id: number, @Body() item: Products) {
    return this.service.update(id, item);
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.service.deleteY(id);
  }
  @Delete('in/:id')
  deleteProductIn(@Param('id') id: number) {
    return this.service.deleteN(id);
  }
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }
  @Post('upload/:id') // API path
  @UseInterceptors(
    FileInterceptor(
      'file', // name of the field being passed
      { storage },
    ),
  )
  async upload(@UploadedFile() file, @Param('id') id: string) {
    return this.service.uploadImage(+id, `${this.path}${file.filename}`);
  }
}
