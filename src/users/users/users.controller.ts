import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { BranchCreateForUser } from 'src/DTOS/barnch.dto';
import { UsersService } from 'src/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(@Inject('users') private readonly service: UsersService) {}
  @Post('create/branch')
  addBranchForUser(@Body() item: BranchCreateForUser) {
    return this.service.createBranchForUser(item);
  }
  @Get('branch/:id')
  getBranchUserId(@Param('id') id: number) {
    return this.service.findBranchFormUserIdById(id);
  }
  @Get()
  getUserAll() {
    return this.service.findUserAll();
  }
  @Get(':emails')
  getIdAndStatus(@Param('emails') emails: string) {
    console.log('emials', emails);
    return this.service.getIdAndStatusUser(emails);
  }
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.service.findUserById(id);
  }
}
