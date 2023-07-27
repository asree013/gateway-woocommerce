import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from 'src/services/users/users.service';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'users',
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
