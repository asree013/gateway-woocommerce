import WooCommerceRestApi from 'woocommerce-rest-ts-api';

export class GatewayConfig {
  static End_point = new WooCommerceRestApi({
    url: 'http://localhost/pos',
    consumerKey: 'ck_42f7cc9aab59be4c12c33dccebc4f5a727a5401a',
    consumerSecret: 'cs_fb6330bfc2a696af229a8189d926d88b6d037471',
    version: 'wc/v3',
    queryStringAuth: false, // Force Basic Authentication as query string true and using under
  });
}
