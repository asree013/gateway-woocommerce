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

  @Post()
  addProduct(@Body() item: Products) {
    return this.service.create(item);
  }
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadProductImage(@UploadedFile() file) {
    console.log(file.filename);
    return file;
  }
  @Post('search')
  searchInCaches(@Body() item: Filters<Products>) {
    try {
      return this.service.search(item);
    } catch (error) {
      console.log(error);
    }
  }
  @Get('catagory')
  getCatagory() {
    return this.service.findCatagory();
  }
  @Get()
  getProductAll() {
    return this.service.findAll();
  }
  @Post('page/')
  getProductAllPaginate(@Body() page: number) {
    return this.service.findAllPaginate(page);
  }
  @Get(':id')
  getProductByid(@Param('id') id: string) {
    return this.service.findById(+id);
  }
  @Post('catagory')
  createCategory(@Body() item: Categories) {
    return this.service.craeteCatagory(item);
  }
  @Post('batch')
  addProducts(@Body() item: Products[]) {
    const data = { create: item };
    console.log(data);
    return this.service.createProducts(data);
  }
  @Put(':id')
  editProduct(@Param('id') id: number, @Body() item: Products) {
    console.log('put product');
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
  @UseInterceptors(
    FilesInterceptor(
      'files', // name of the field being passed
      10,
      { storage },
    ),
  )
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map((r) => r.filename);
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
