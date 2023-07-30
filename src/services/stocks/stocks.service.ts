import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';
import { StockCreate } from 'src/DTOS/stock.dto';

@Injectable()
export class StocksService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
  ) {}
  async create(item: StockCreate) {
    try {
      const query = `
            INSERT INTO external_stock (stock_internal, stock_external, price, p1, p2, p3, p4, product_id, branch_id)
            VALUES (${item.stock_internal}, ${item.stock_external}, ${item.price}, ${item.p1}, ${item.p2}, ${item.p3},
            ${item.p4}, ${item.product_id}, ${item.branch_id})
        `;
      const create = await this.connect.execute(query);
      const { insertId } = create as any;
      const result = await this.findById(insertId);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAll() {
    try {
      const query = `SELECT * FROM external_stock`;
      const find = await this.connect.querys(query);
      return find;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: number) {
    try {
      const query = `SELECT * FROM external_stock WHERE id = ${id}`;
      const find = await this.connect.querys(query);
      if (find.length <= 0) {
        const response = {
          status: 202,
          message: 'Is Not A Stock in Databese',
        };
        return response;
      }
      return find[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findByIdProduct(id: number) {
    try {
      const query = `SELECT * FROM external_stock WHERE product_id = ${id} ORDER BY id DESC`;
      const find = await this.connect.querys(query);
      if (find.length <= 0) {
        const response = {
          status: 202,
          message: 'Is Not A Stock in Databese',
        };
        return response;
      }
      return find;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async update(id: number, item: StockCreate) {
    try {
      const query = `UPDATE external_stock SET stock_internal = ${item.stock_internal}, stock_external = ${item.stock_external},
        price = ${item.price}, p1 = ${item.p1}, p2 = ${item.p2}, p3 = ${item.p3}, p4 = ${item.p4}, product_id = ${item.product_id}
        branch_id = ${item.branch_id} WHERE id = ${id}
      `;
      const findId = await this.findById(id);
      if (findId.status === 202) {
        return findId;
      }
      const update = await this.connect.execute(query);
      return update;
    } catch (error) {}
  }
  async delete(id: number) {
    try {
      const query = `DELETE FROM external_stock WHERE id = ${id}`;
      const findId = await this.findById(id);
      if (findId.status === 202) {
        return findId;
      }
      const result = await this.connect.execute(query);
      return result;
    } catch (error) {}
  }
}
