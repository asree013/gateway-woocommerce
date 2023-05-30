import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import { Products } from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';
import { CachingService } from '../caching/caching.service';
import { Filters } from 'src/models/searchproduct.model';

@Injectable()
export class ProductService {
  constructor(
    @Inject('gateway') private readonly gateway: GatewayService,
    @Inject('caching') private readonly caches: CachingService,
  ) {}
  async findAll() {
    try {
      const result: Products[] | undefined = JSON.parse(
        await this.caches.getRedisProducts(),
      );
      if (!result) {
        const result: Products[] = await this.gateway.getAll('products');
        return result;
      } else {
        return result;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: number) {
    try {
      const result: Products[] | undefined = await this.findAll();
      if (!result) {
        const result = await this.gateway.getById('products', id);
        return result;
      } else {
        return result.find((f) => f.id === id);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  // async search(item: string) {
  //   try {
  //     const result = await this.gateway.search('products', item);
  //     return result.data;
  //   } catch (error) {
  //     throw new BadRequestException(error);
  //   }
  // }
  async search(filterTemp: Filters<Products>) {
    try {
      const result = await this.findAll();
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
              console.log(searchName);
              return ProductsSearch.indexOf(searchName) !== -1;
            }
            if (typeof filterTemp.data[key] === 'number') {
              return filter[key] === filterTemp.data[key];
            }
            if (typeof filterTemp.data[key] === 'boolean') {
              return filter[key] === filterTemp.data[key];
            }
            if (Date.parse(filterTemp.data[key])) {
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
  async create(data: Products) {
    try {
      const result = await this.gateway.create('products', data);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteY(id: number) {
    try {
      const result = await this.gateway.deleteForce('products', id);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteN(id: number) {
    try {
      const result = await this.gateway.deleteForce('products', id);
      return result.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async update(id: number, data: Products) {
    try {
      const products = await this.findById(id);
      if (!products) {
        throw new BadRequestException('is not Product in Database');
      }
      const update = await this.gateway.update('products', id, data);
      return update;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
