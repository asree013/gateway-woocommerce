import WooCommerceRestApi from 'woocommerce-rest-ts-api';

export class GatewayConfig {
  static End_point = new WooCommerceRestApi({
    url: 'http://localhost/wordpress',
    consumerKey: 'ck_0d339f53802eefc09574340071be89907e0b6175',
    consumerSecret: 'cs_60f8a617b201c3cc54fb65f72fb3d64ccf0beb98',
    version: 'wc/v3',
    queryStringAuth: false, // Force Basic Authentication as query string true and using under
  });
}
