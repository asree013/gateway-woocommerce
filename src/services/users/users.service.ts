import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
  ) {}

  async getIdAndStatusUser(email: string) {
    console.log('serviec', email);

    try {
      const query =
        'SELECT wp_users.ID, wp_users.user_status FROM wp_users WHERE wp_users.user_email = ?';
      const value = [email];
      const find = await this.connect.execute(query, value);
      return find[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findUserAll() {
    try {
      const query = 'SELECT * FROM wp_users';
      const result = await this.connect.querys(query);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findUserById(id: number) {
    try {
      const query = 'SELECT * FROM wp_users WHERE ID = ?';
      const value = [id];
      const result = await this.connect.execute(query, value);
      return result[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
