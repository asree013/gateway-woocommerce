import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';
import { Branch, CreateWareHouse } from 'src/DTOS/barnch.dto';
import { CachingService } from '../caching/caching.service';
import { Filters } from 'src/models/searchproduct.model';
// import { randomUUID } from 'crypto';

@Injectable()
export class BranchService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
    @Inject('caching') private readonly cache: CachingService,
  ) {}

  async create(item: CreateWareHouse) {
    try {
      const query = `
        INSERT INTO external_branch (title, address, city, province, postcode, country, email, phone, user_id) 
        VALUES ('${item.title}', '${item.address}', '${item.city}', '${item.province}', 
        ${item.postcode}, '${item.country}', '${item.email}', '${item.phone}', '${item.user_id}')
      `;
      const create = await this.connect.execute(query);
      if (create) {
        const updateCache = await this.connect.execute(
          `SELECT * FROM external_branch`,
        );
        this.cache.setRedis('branch', JSON.stringify(updateCache), 1200);
        const { insertId } = create as any;
        const find = await this.findOne(insertId);
        return find;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findOne(id: number) {
    try {
      const query = 'SELECT * FROM external_branch WHERE id = ?';
      const value = [id];
      const findId = await this.connect.execute(query, value);
      if (findId.length === 0) {
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
      const getCach = JSON.parse(await this.cache.getRedisBranch());
      if (!getCach) {
        const query = 'SELECT * FROM external_branch';
        const findAll = await this.connect.querys(query);
        this.cache.setRedis('branch', JSON.stringify(findAll), 1200);
        return findAll;
      } else {
        if (getCach.length <= 0) {
          const responese = {
            status: 204,
            message: 'is not Branch in Database',
          };
          return responese;
        }
        return getCach;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async update(item: CreateWareHouse, id: number) {
    try {
      const query = 'UPDATE external_branch SET title = ? WHERE id = ?';
      const value = [item.title, id];
      const update = await this.connect.querys(query, value);
      if (update) {
        this.findAll();
        return update;
      }
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
  async search(value: Filters<Branch>) {
    try {
      const result = await this.findAll();
      const data = result.filter((filter) => {
        if (!value.data) {
          return filter;
        }
        const listKey = Object.keys(value.data);
        if (listKey.length > 0) {
          for (const key of listKey) {
            if (typeof value.data[key] === 'string') {
              const ProductsSearch = filter[key].toLowerCase();
              const searchName = value.data[key].toLowerCase();
              return ProductsSearch.indexOf(searchName) !== -1;
            } else if (
              Number.parseFloat(value.data[key]) ||
              Number.parseInt(value.data[key])
            ) {
              return filter[key] === value.data[key];
            } else if (typeof value.data[key] === 'number') {
              return filter[key] === value.data[key];
            } else if (typeof value.data[key] === 'boolean') {
              return filter[key] === value.data[key];
            } else if (Date.parse(value.data[key])) {
              return filter[key] === new Date(value.data[key]);
            }
          }
        } else {
          return filter;
        }
      });
      if (data) {
        return data;
      } else {
        throw new BadRequestException('not Product in Database');
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
