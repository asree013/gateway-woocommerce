import { Injectable } from '@nestjs/common';
import { GatewayConfig } from 'src/configs/gateway_config';
import { WooRestApiEndpoint, WooRestApiParams } from 'woocommerce-rest-ts-api';
@Injectable()
export class GatewayService {
  private endPoint = GatewayConfig.End_point;
  getAll(path: WooRestApiEndpoint) {
    return this.endPoint.get(path);
  }
  getById(path: WooRestApiEndpoint, id: number) {
    return this.endPoint.get(path, {
      id: id,
    });
  }
  create(path: WooRestApiEndpoint, item: any) {
    return this.endPoint.post(path, item);
  }
  delete(
    path: WooRestApiEndpoint,
    id: number,
    option?: Pick<WooRestApiParams, 'force'>,
  ) {
    return this.endPoint.delete(path, option, {
      id: id,
    });
  }
  update(path: WooRestApiEndpoint, id: number, data: any) {
    return this.endPoint.put(path, data, {
      id: id,
    });
  }
}
