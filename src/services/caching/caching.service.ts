import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CachingService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  setRedis(path: any, value: any, times: number) {
    return this.redis.set(path, value, 'EX', times);
  }
  getRedisProducts() {
    return this.redis.get('products');
  }
  getRedisOrders() {
    return this.redis.get('orders');
  }
  getRedisPayment() {
    return this.redis.get('payment_gateways');
  }
}
