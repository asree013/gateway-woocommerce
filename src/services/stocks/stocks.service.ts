import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';
import { StockCreate, Stocks } from 'src/DTOS/stock.dto';
import { Filters } from 'src/models/searchproduct.model';
import { CachingService } from '../caching/caching.service';
import { NotFound } from 'src/DTOS/Notfound';

@Injectable()
export class StocksService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
    @Inject('caching') private readonly cache: CachingService,
  ) {}
  async create(item: StockCreate) {
    try {
      const query = `
          INSERT INTO external_stock (sku, picture, name_product, stock_internal, stock_external, price, p1, p2, p3, p4, product_id, branch_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      const value = [
        item.sku,
        item.picture,
        item.name_product,
        item.stock_internal,
        item.stock_external,
        item.price,
        item.p1,
        item.p2,
        item.p3,
        item.p4,
        item.product_id,
        item.branch_id,
      ];
      const create = await this.connect.execute(query, value);
      const { insertId } = create as any;
      const result = await this.findById(insertId);
      const qurey = `
        SELECT stock.*, product.sku, branch.title AS br_name
        FROM external_stock AS stock
        LEFT JOIN wp_wc_product_meta_lookup AS product ON product.product_id = stock.product_id
        LEFT JOIN external_branch AS branch ON stock.branch_id = branch.id
      `;
      const updateStock = await this.connect.querys(qurey);
      this.cache.setRedis('stocks', JSON.stringify(updateStock), 1200);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAll(): Promise<Stocks[] | NotFound> {
    const response = {
      status: 202,
      message: 'is Not Item in Database!!!',
    };
    try {
      const redis: Stocks[] | undefined = JSON.parse(
        await this.cache.getRedisStocks(),
      );
      if (!redis) {
        const query = `
        SELECT stock.*, product.sku AS product_sku, branch.title AS br_name
        FROM external_stock AS stock
        LEFT JOIN wp_wc_product_meta_lookup AS product ON product.product_id = stock.product_id
        LEFT JOIN external_branch AS branch ON stock.branch_id = branch.id
      `;
        const find = await this.connect.querys(query);
        if (find.length === 0) {
          return response;
        }
        await this.cache.setRedis('stocks', JSON.stringify(find), 1200);
        return find;
      } else {
        if (redis.length === 0) {
          return response;
        }
        return redis;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAllByPagination(item: { page: number; pageSize: number }) {
    const response = {
      status: 202,
      message: 'is Not Item in Database!!!',
    };
    try {
      const offset = (item.page - 1) * item.pageSize;
      const query = `
        SELECT stock.*, product.sku, branch.title AS br_name
        FROM external_stock AS stock
        LEFT JOIN wp_wc_product_meta_lookup AS product ON product.product_id = stock.product_id
        LEFT JOIN external_branch AS branch ON stock.branch_id = branch.id
        LIMIT ${item.pageSize} OFFSET ${offset}
      `;
      const find = await this.connect.querys(query);
      if (find.length === 0) {
        return response;
      }
      const startIndex = (item.page - 1) * item.pageSize;
      const endIdex = startIndex + item.pageSize;
      const pagination = find.slice(startIndex, endIdex);
      return pagination;
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
      if (result) {
        const findAll = await this.connect.execute(
          `
          SELECT stock.*, product.sku AS product_sku, branch.title AS br_name
          FROM external_stock AS stock
          LEFT JOIN wp_wc_product_meta_lookup AS product ON product.product_id = stock.product_id
          LEFT JOIN external_branch AS branch ON stock.branch_id = branch.id
          `,
        );
        await this.cache.setRedis('stocks', JSON.stringify(findAll), 1200);
        return result;
      }
    } catch (error) {}
  }
  async findProductAndStockById(id: number) {
    console.log(id);
    try {
      const query = `
        SELECT stock.*, product.sku, branch.title AS br_name
        FROM external_stock AS stock
        LEFT JOIN wp_wc_product_meta_lookup AS product ON product.product_id = stock.product_id 
        LEFT JOIN external_branch AS branch ON stock.branch_id = branch.id  WHERE stock.product_id = ${id}
      `;
      const find = await this.connect.querys(query);
      return find;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async search(filterTemp: Filters<Stocks>) {
    try {
      const query = `
      SELECT stock.*, product.sku AS product_sku, branch.title AS br_name
      FROM external_stock AS stock
      LEFT JOIN wp_wc_product_meta_lookup AS product ON product.product_id = stock.product_id
      LEFT JOIN external_branch AS branch ON stock.branch_id = branch.id
      `;
      const result = await this.connect.execute(query);
      const data = result.filter((filter) => {
        if (!filterTemp.data) {
          return filter;
        }
        const listKey = Object.keys(filterTemp.data);
        if (listKey.length > 0) {
          for (const key of listKey) {
            if (typeof filterTemp.data[key] === 'string') {
              const ProductsSearch = filter[key].toLowerCase();
              const searchName = filterTemp.data[key].toLowerCase();
              return ProductsSearch.indexOf(searchName) !== -1;
            } else if (
              Number.parseFloat(filterTemp.data[key]) ||
              Number.parseInt(filterTemp.data[key])
            ) {
              return filter[key] === filterTemp.data[key];
            } else if (typeof filterTemp.data[key] === 'number') {
              return filter[key] === filterTemp.data[key];
            } else if (typeof filterTemp.data[key] === 'boolean') {
              return filter[key] === filterTemp.data[key];
            } else if (Date.parse(filterTemp.data[key])) {
              return filter[key] === new Date(filterTemp.data[key]);
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
