import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from 'src/services/images/images.service';

@Module({
  controllers: [ImagesController],
  providers: [
    {
      provide: 'images',
      useClass: ImagesService,
    },
  ],
})
export class ImagesModule {}
