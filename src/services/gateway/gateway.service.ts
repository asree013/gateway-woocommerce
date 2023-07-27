import { Inject, Injectable } from '@nestjs/common';
import { GatewayConfig } from 'src/configs/gateway_config';
import { WooRestApiEndpoint, WooRestApiParams } from 'woocommerce-rest-ts-api';
import { CachingService } from '../caching/caching.service';

@Injectable()
export class GatewayService {
  constructor(@Inject('caching') private readonly caches: CachingService) {}
  private endPoint = GatewayConfig.End_point;

  async getAll(path: WooRestApiEndpoint, option?: Partial<WooRestApiParams>) {
    const result = await this.endPoint.get(path, option);
    // this.redis.set(path, JSON.stringify(result.data), 'EX', 60);
    this.caches.setRedis(path, JSON.stringify(result.data), 1200);
    return result.data;
  }
  async getById(path: WooRestApiEndpoint, id: number) {
    const result = await this.endPoint.get(path, {
      id: id,
    });
    return result.data;
  }
  search(path: WooRestApiEndpoint, item: string) {
    return this.endPoint.get(path, {
      search: item,
    });
  }
  async create(
    path: WooRestApiEndpoint,
    item: any,
    option?: Partial<WooRestApiParams>,
  ) {
    const result = await this.endPoint.post(path, item, option);
    await this.getAll(path);
    return result.data;
  }
  async creates(item: any) {
    const result = await this.endPoint.post('products/batch', item);
    return result.data;
  }
  async deleteForce(path: WooRestApiEndpoint, id: number) {
    const result = await this.endPoint.delete(
      path,
      { force: true },
      {
        id: id,
      },
    );
    await this.getAll(path);
    return result.data;
  }
  unDeleteForce(path: WooRestApiEndpoint, id: number) {
    return this.endPoint.delete(
      path,
      { force: false },
      {
        id: id,
      },
    );
  }
  update(path: WooRestApiEndpoint, id: number, data: any) {
    return this.endPoint.put(path, data, {
      id: id,
    });
  }
}
