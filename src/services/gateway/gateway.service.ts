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
    return result.data;
  }
  async creates(item: any) {
    const result = await this.endPoint.post('products/batch', item);
    return result.data;
  }
  async deleteForce(path: WooRestApiEndpoint, id: number) {
    const reslut = await this.endPoint.delete(
      path,
      { force: true },
      {
        id: id,
      },
    );
    return reslut.data;
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
  async update(path: WooRestApiEndpoint, id: number, data: any) {
    const result = await this.endPoint.put(path, data, { id: id });
    return result.data;
  }
}
