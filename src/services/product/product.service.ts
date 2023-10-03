import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import { Categories, Products } from '../../DTOS/woocommercDTO';
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
        const caches: Products[] = await this.gateway.getAll('products');
        await this.caches.setRedis('products', JSON.stringify(caches), 1200);
        return caches;
      } else {
        return result;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findAllPaginate(page: number) {
    try {
      page = 1;
      const pageSize = 5;
      const startIndex = page - 1 * pageSize;
      const endIndex = startIndex + pageSize;

      const result: Products[] | undefined = JSON.parse(
        await this.caches.getRedisProducts(),
      );
      if (!result) {
        const caches: Products[] = await this.gateway.getAll('products');
        const paginatedData = caches.slice(startIndex, endIndex);
        return paginatedData;
      } else {
        return result;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findById(id: number) {
    try {
      const result = await this.gateway.getById('products', id);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findCatagory() {
    try {
      const cache: Categories[] | undefined = JSON.parse(
        await this.caches.getRedisProducts(),
      );
      if (!cache) {
        const result = await this.gateway.getAll('products', {
          category: 'categories',
        });
        return result;
      } else {
        return cache;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async craeteCatagory(item: Categories) {
    try {
      const result = await this.gateway.create('products', item, {
        category: 'categories',
      });
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async search(filterTemp: Filters<Products>) {
    try {
      console.log(filterTemp);
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
  async create(data: Products) {
    console.log('create product');
    console.log(data);
    try {
      const result = await this.gateway.create('products', data);
      const findAll = await this.gateway.getAll('products');
      await this.caches.setRedis('products', JSON.stringify(findAll), 120);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async createProducts(item: any) {
    try {
      const result = await this.gateway.creates(item);
      if (result) {
        await this.gateway.getAll('products');
        return result;
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteY(id: number) {
    try {
      const deleted = await this.gateway.deleteForce('products', id);
      if (deleted) {
        const result = await this.gateway.getAll('products');
        await this.caches.setRedis('products', JSON.stringify(result), 120);
        return deleted;
      }
      return;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async deleteN(id: number) {
    try {
      const result = await this.gateway.deleteForce('products', id);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async update(id: number, data: Products) {
    try {
      const update = await this.gateway.update('products', id, data);
      const find = await this.gateway.getAll('products');
      await this.caches.setRedis('products', JSON.stringify(find), 120);
      if (update) {
        console.log('updated');
        return update;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async uploadImage(id: number, image: string) {
    try {
      const product = await this.findById(id);
      if (!product) {
        throw new BadRequestException('in no Product in Database');
      }
      const uploadImage = await this.gateway.update('products', id, image);
      return uploadImage.data;
    } catch (error) {}
  }
}
