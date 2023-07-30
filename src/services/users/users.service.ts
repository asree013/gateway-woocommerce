import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';
import { BranchCreateForUser } from 'src/DTOS/barnch.dto';

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

  async createBranchForUser(item: BranchCreateForUser) {
    console.log(item);

    try {
      const query = `INSERT INTO external_users_branch (user_id, branch_id) VALUES (${item.user_id}, ${item.branch_id})`;
      const create = await this.connect.execute(query);
      const { insertId } = create as any;
      const result = await this.findBranchFormUserByIdBranchUser(insertId);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findBranchFormUser() {
    try {
      const query = 'SELECT * FROM external_users_branch';
      const find = await this.connect.querys(query);
      return find;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findBranchFormUserIdById(id: number) {
    try {
      const query = `SELECT * FROM external_users_branch WHERE user_id = ${id}`;
      const find = await this.connect.execute(query);
      return find[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findBranchFormUserByIdBranchUser(id: number) {
    try {
      const query = `SELECT * FROM external_users_branch WHERE id = ${id}`;
      const find = await this.connect.execute(query);
      return find[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
