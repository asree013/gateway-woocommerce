import {
  Controller,
  Inject,
  UseInterceptors,
  Post,
  UploadedFiles,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { ImagesService } from 'src/services/images/images.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/configs/image.config';

@Controller('images')
export class ImagesController {
  constructor(@Inject('images') private readonly service: ImagesService) {}

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
    return file;
  }
}
