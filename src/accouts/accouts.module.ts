import { Module } from '@nestjs/common';
import { AccoutsController } from './accouts/accouts.controller';
import { AccoutService } from 'src/services/accout/accout.service';

@Module({
  controllers: [AccoutsController],
  providers: [
    {
      provide: 'accout',
      useClass: AccoutService,
    },
  ],
})
export class AccoutsModule {}
