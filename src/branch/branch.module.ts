import { Module } from '@nestjs/common';
import { BranchController } from './branch/branch.controller';
import { BranchService } from 'src/services/branch/branch.service';

@Module({
  controllers: [BranchController],
  providers: [
    {
      provide: 'branch',
      useClass: BranchService,
    },
  ],
})
export class BranchModule {}
