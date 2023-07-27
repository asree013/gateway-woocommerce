import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';
import { BranchCreate } from 'src/DTOS/barnch.dto';
// import { randomUUID } from 'crypto';

@Injectable()
export class BranchService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
  ) {}

  async create(item: BranchCreate) {
    try {
      const query = 'INSERT INTO external_branch (title) VALUES (?)';
      const value = [item.title];
      const create = await this.connect.execute(query, value);
      return create;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findOne(id: number) {
    try {
      const query = 'SELECT * FROM external_branch WHERE id = ?';
      const value = [id];
      const findId = await this.connect.execute(query, value);
      if (findId.length <= 0) {
        const response = {
          status: 202,
          message: 'is Not a Branch in Database',
        };
        return response;
      } else {
        return findId[0];
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAll() {
    try {
      const query = 'SELECT * FROM external_branch';
      const findAll = await this.connect.querys(query);
      return findAll;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async update(item: BranchCreate, id: number) {
    try {
      const query = 'UPDATE external_branch SET title = ? WHERE id = ?';
      const value = [item.title, id];
      const update = await this.connect.querys(query, value);
      return update;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async delete(id: number) {
    try {
      const query = 'DELETE FROM external_branch WHERE id = ?';
      const value = [id];
      const find = await this.findOne(id);
      if (find.status === 202) {
        return find;
      } else {
        const deleted = await this.connect.querys(query, value);
        if (deleted) {
          const response = {
            status: 201,
            message: 'deleted Branch',
          };
          return response;
        }
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
