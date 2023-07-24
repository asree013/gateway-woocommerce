import { Inject, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway/gateway.service';
import { CachingService } from '../caching/caching.service';
import { Products } from 'woocommerce-rest-ts-api/dist/src/typesANDinterfaces';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('gateway') private readonly gateway: GatewayService,
    private readonly caching: CachingService,
  ) {}
}
