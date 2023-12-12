import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConnectDbService } from '../connect_db/connect_db.service';
import { StockQuantity, Stocks } from 'src/DTOS/stock.dto';
import { Filters } from 'src/models/searchproduct.model';

@Injectable()
export class StockQuantityService {
  constructor(
    @Inject('connectDB') private readonly connect: ConnectDbService,
  ) {}

  async create(item: StockQuantity) {
    try {
      const query = `
            INSERT INTO external_stock_quantity (name, picture, sku , all_front_quantity, all_back_quantity)
            VALUES (?, ?, ?, ?, ?)
        `;
      const value = [
        item.name,
        item.picture,
        item.sku,
        item.all_front_quantity,
        item.all_back_quantity,
      ];
      const create = await this.connect.execute(query, value);
      const { insertId } = create as any;
      const response = await this.findById(insertId);
      return response;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: number) {
    try {
      const query = `
            SELECT *
            FROM external_stock_quantity AS sq
            WHERE sq.id = ?
        `;
      const value = [id];
      const reslut = await this.connect.execute(query, value);
      return reslut[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAll() {
    try {
      const query = `
          SELECT * FROM external_stock_quantity 
        `;
      const result = await this.connect.querys(query);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async update(id: number, item: StockQuantity) {
    try {
      const query = `
          UPDATE external_stock_quantity
          SET name = ?, picture = ?, sku = ?, all_front_quantity = ?, all_back_quantity = ?
          WHERE id = ?
      `;
      const values = [
        item.name,
        item.picture,
        item.sku,
        item.all_front_quantity,
        item.all_back_quantity,
        id,
      ];
      const update = await this.connect.execute(query, values);
      if (update) {
        const find = await this.connect.execute(
          'SELECT * FROM external_stock_quantity WHERE id = ?',
          [id],
        );
        console.log('find: ', find[0]);
        return find[0];
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateQuantity(id: number, item: StockQuantity) {
    console.log({
      id: id,
      item: item,
    });
    try {
      const query = `
        UPDATE external_stock_quantity 
        SET all_front_quantity = ?, all_back_quantity = ?
        WHERE id = ?
      `;
      const value = [item.all_front_quantity, item.all_back_quantity, id];
      const update = await this.connect.execute(query, value);
      if (update) {
        const find = await this.connect.execute(
          'SELECT * FROM external_stock_quantity WHERE id = ' + id,
        );
        return find[0];
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async delete(id: number) {
    try {
      const query = `
            DELETE FROM external_stock_quantity WHERE external_stock_quantity.id = ?
        `;
      const value = [id];
      await this.connect.execute(query, value);
      return id;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findBySku(id: string) {
    try {
      const query = `
        SELECT * 
        FROM external_stock_quantity AS sq 
        WHERE sq.sku = ?
      `;
      const value = [id];
      const reslut = await this.connect.execute(query, value);
      return reslut[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findStockAndQuantityAll() {
    try {
      const query = `
      SELECT sq.id, sq.all_front_quantity AS front, sq.all_back_quantity AS back, stock.sku, stock.picture, stock.name_product,
      stock.price, stock.p1, stock.p2, stock.p3, stock.p4, stock.stock_external, stock.stock_internal, stock.create_at, stock.update_at,
      sq.name
      FROM external_stock_quantity AS sq
      LEFT JOIN external_stock AS stock ON sq.sku = stock.sku
      `;
      const reuslt = await this.connect.execute(query);
      const stockQuantityObj: any[] = [];
      let currentStockId = null;
      let currentStock: any = null;

      for (const rows of reuslt) {
        if (rows.id !== currentStockId) {
          if (currentStock) {
            stockQuantityObj.push(currentStock);
          }
          currentStock = {
            id: rows.id,
            name: rows.name,
            front: rows.front,
            back: rows.back,
            stocks: [],
          };
          currentStockId = rows.id;
        }
        currentStock.stocks.push({
          id: rows.id,
          name_product: rows.name_product,
          sku: rows.sku,
          picture: rows.picture,
          price: rows.price,
          p1: rows.p1,
          p2: rows.p2,
          p3: rows.p3,
          p4: rows.p4,
          product_id: rows.product_id,
          stock_external: rows.stock_external,
          stock_internal: rows.stock_internal,
          create_at: rows.create_at,
          update_at: rows.update_at,
        });
      }

      if (currentStock) {
        stockQuantityObj.push(currentStock);
      }
      return stockQuantityObj;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async search(filterTemp: Filters<StockQuantity>) {
    try {
      const query = `
      SELECT * FROM external_stock_quantity 
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
        throw new BadRequestException('not item in Database');
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async inventoryUpdate(sku: string, item: StockQuantity) {
    try {
      const findStockQuantiy = await this.findBySku(sku);
      if (findStockQuantiy) {
        const update = {} as StockQuantity;
        update.all_front_quantity =
          findStockQuantiy.all_front_quantity - item.all_front_quantity;
        const query = `
          UPDATE external_stock_quantity 
          SET all_front_quantity = ?
          WHERE id = ?
        `;
        const value = [update.all_front_quantity, findStockQuantiy.id];
        await this.connect.execute(query, value);
        const find = await this.findById(findStockQuantiy.id);
        return find;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async pushingStock(sku: string, item: StockQuantity) {
    try {
      const findStockQuantiy = await this.findBySku(sku);
      if(findStockQuantiy){
        const query = `
          UPDATE external_stock_quantity 
          SET all_front_quantity = ?
          WHERE id = ?
        `;
        const value = [item.all_front_quantity, findStockQuantiy.id];
        await this.connect.execute(query, value);
        const find = await this.findById(findStockQuantiy.id);
        return find;
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  async deleteBySku(sku: string) {
    try {
      const query = `
        DELETE FROM external_stock_quantity WHERE external_stock_quantity.sku = ?
      `
      const value = [sku]
      const result = await this.connect.execute(query, value)
      if(result){
        return sku
      }
    } catch (error) {
      
    }
  }
}
