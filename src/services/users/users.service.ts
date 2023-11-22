import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';
import { BranchCreateForUser } from 'src/DTOS/barnch.dto';
import { Filters } from 'src/models/searchproduct.model';
import { Users } from 'src/DTOS/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
  ) {}


  async findUserLoginByUsername(username: string) {
    
    try {
      const query = `
        SELECT users.user_login
        FROM wp_users as users 
        WHERE users.user_login = ?
      `
      const value = [username]
      const result = await this.connect.execute(query, value)
      console.log(result);
      
      return result[0]
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  async findUserEmailByEmail(email: string) {
    
    try {
      const query = `
        SELECT users.user_email
        FROM wp_users as users 
        WHERE users.user_email = ?
      `
      const value = [email]
      const result = await this.connect.execute(query, value)
      console.log(result);
      
      return result[0]
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  async getIdAndStatusUser(email: string) {
    try {
      const query =
        'SELECT * FROM wp_users WHERE wp_users.user_email = ?';
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
      select users.user_nicename
      from wp_users as users
      where users.ID = ?`
      const value = [id];
      const result = await this.connect.execute(query, value);
      console.log(result[0]);
      
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
      SELECT eub.*, users.user_email, users.user_nicename, users.ID as user_id
      FROM external_users_branch AS eub 
      LEFT JOIN wp_users AS users ON eub.user_id = users.ID 
      WHERE eub.branch_id = 2;
      `;
      const value = [branch_id];
      const result = await this.connect.querys(query, value);
      console.log(result);
      
      return result
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async search(value: string) {
    console.log({
      search: value
    });
    
    try {
      const result: Users[] = await this.findUserAll()
      const data = result.filter(r => {
        return r.user_email.includes(value)
      })
      if(data.length !== 0){
        console.log(data);
        return data
      }
      else{
        throw new BadRequestException()
      }
      
    } catch (error) {
      throw new BadRequestException()
    }
  }
  async deleteUserBranch(id: number) {
    try {
      const qurey = `
      DELETE FROM external_users_branch as users WHERE users.id = ?
      `
      const value = [id]
      const deletes = await this.connect.execute(qurey, value)
      if(deletes) {
        const findById = await this.findBranchFormUserIdByIdBranch(id)
        return findById;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findBranchFormUserIdByIdBranch(branch_id: number) {
    try {
      const query = `
        SELECT * 
        FROM external_users_branch as users 
        WHERE users.id = ?
      `;
      const value = [branch_id]
      const find = await this.connect.querys(query, value);
      return find[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findBrachByBranch_idAndUserId(user_id: number, branch_id: number) {
    try{
      console.log('find');
      const query = `
      SELECT * FROM external_users_branch as users
      WHERE users.user_id = ? AND users.branch_id = ?
      `
      const value = [user_id, branch_id]
      const find = await this.connect.execute(query, value)
      return find[0]
    }
    catch(err) {
      throw new BadRequestException(err)
    }
  }
  async updateRoleWarehouse(bracnh_id: number, user_id: number, item: BranchCreateForUser) {
    console.log('ser update');
    try {
      const query = `
      UPDATE external_users_branch as branch set branch.role = ?
       WHERE branch.user_id = ? AND branch.branch_id = ?; 
      `
      const value = [item.role, user_id, bracnh_id]
      await this.connect.execute(query, value)
      const result = await this.findBrachByBranch_idAndUserId(user_id, bracnh_id)
      return result
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
