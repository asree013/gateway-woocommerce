import WooCommerceRestApi from 'woocommerce-rest-ts-api';

const apaceConsumer = 'ck_a90269733198f79f6e4ff5a6a7c1ba1a96d5d210'
const apaceConsumerSecret = 'cs_b1b7db37c239b9759dc160599659aa03f2e1bf26'

const nginxConsumer = 'ck_f059d1e97bbaa375428e8eae33bd554d4be33696';
const nginxConsumerSecret = 'cs_4bafebbf7f9950ffece10afbc1700270709cbc67';

const oldConsumer = 'ck_42f7cc9aab59be4c12c33dccebc4f5a727a5401a';
const oldConsumerSecret = 'cs_fb6330bfc2a696af229a8189d926d88b6d037471';

const nginx = 'http://localhost:8080/:'
const apace = 'http://localhost:8888/'

export class GatewayConfig {
  static End_point = new WooCommerceRestApi({
    url: nginx,
    consumerKey: nginxConsumer,
    consumerSecret: nginxConsumerSecret,
    version: 'wc/v3',
    queryStringAuth: false, // Force Basic Authentication as query string true and using under
    timeout: 10000,
  });
}
