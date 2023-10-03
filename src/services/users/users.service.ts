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
      const query = `
      SELECT wwc.first_name, wwc.last_name
      FROM wp_wc_customer_lookup AS wwc
      WHERE wwc.user_id = ?`;
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
      const query = `INSERT INTO external_users_branch (user_id, branch_id, role) VALUES (?, ?, ?)`;
      const value = [item.user_id, item.branch_id, item.role];
      const create = await this.connect.execute(query, value);
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
      const query = `
        SELECT userBranch.* , branch.title
        FROM external_users_branch AS userBranch
        LEFT JOIN external_branch AS branch ON branch.id = userBranch.branch_id
        WHERE userBranch.user_id = ${id}
      `;
      const find = await this.connect.querys(query);
      return find;
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

  async findBranchByBranchId(branch_id: number) {
    try {
      const query = `
        SELECT eub.*, users.first_name, users.last_name, users.email
        FROM external_users_branch AS eub
        LEFT JOIN wp_wc_customer_lookup AS users ON eub.user_id = users.user_id
        WHERE eub.branch_id = ?
      `;
      const value = [branch_id];
      const result = await this.connect.querys(query, value);
      if (result.length === 0) {
        const response = {
          status: 204,
          message: 'is Not User in Warehouse',
        };
        return response;
      } else {
        return result;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
