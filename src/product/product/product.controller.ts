import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from 'src/services/product/product.service';
import { Products } from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';
import { Filters } from 'src/models/searchproduct.model';

@Controller('products')
export class ProductController {
  constructor(@Inject('products') private readonly service: ProductService) {}
  @Get()
  getProductAll() {
    return this.service.findAll();
  }
  @Get(':id')
  getProductByid(@Param('id') id: string) {
    return this.service.findById(+id);
  }
  // @Post('search')
  // search(@Body('search') item: string) {
  //   return this.service.search(item);
  // }
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
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImages(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'image/jpeg/png' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log('images', file);
  }
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }
}
