import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { BranchCreateForUser, CreateWareHouse } from 'src/DTOS/barnch.dto';
import { Users } from 'src/DTOS/users.dto';
import { Filters } from 'src/models/searchproduct.model';
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
  @Get('branch/for/:branch_id')
  getBracnhByBeanchId(@Param('branch_id') branch_id: number) {
    return this.service.findBranchByBranchId(branch_id);
  }
  @Get()
  getUserAll() {
    return this.service.findUserAll();
  }
  @Get(':emails')
  getIdAndStatus(@Param('emails') emails: string) {
    return this.service.getIdAndStatusUser(emails);
  }
  @Get('username/:id')
  getUserById(@Param('id') id: number) {
    return this.service.findUserById(id);
  }
  @Get('search/:email')
  search(@Param('email') email: string) {
    return this.service.search(email);
  }
  @Delete('warehouse/:id')
  deleteUsersWarehouse(@Param('id') idBranch: number) {
    return this.service.deleteUserBranch(idBranch)
  }
  @Get("warehouse/:branch_id/user/:user_id")
  getWarehouseByBranch_idAndUser_id(@Param('branch_id') branch_id: number, @Param('user_id') user_id: number) {
    return this.service.findBrachByBranch_idAndUserId(user_id, branch_id)
  }
  @Get('user-login/:username')
  findUserLogin(@Param('username') username: string) {
    return this.service.findUserLoginByUsername(username)
  }
  @Get('user-emali/:email')
  findUserEmail(@Param('email') email: string) {
    return this.service.findUserEmailByEmail(email)
  }
  @Put('warehouse/:id/user/:user_id')
  updateRoleWarehouse(@Param('id') id: number, @Param('user_id') user_id: number, @Body() item: BranchCreateForUser) {
    console.log({
      id: id,
      user_id: user_id,
      item: item
    });
    
    return this.service.updateRoleWarehouse(id, user_id, item)
  }
}
