import WooCommerceRestApi from 'woocommerce-rest-ts-api';

export class GatewayConfig {
  static End_point = new WooCommerceRestApi({
    url: 'http://localhost/',
    consumerKey: 'ck_1f1f7645337a2028126f775a777577e816d5890a',
    consumerSecret: 'cs_64e4314f8d0cec4cd50ac60625fe8d13e7960985',
    version: 'wc/v3',
    queryStringAuth: false, // Force Basic Authentication as query string true and using under
    port: 8800,
  });
}
