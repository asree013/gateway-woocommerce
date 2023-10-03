import WooCommerceRestApi from 'woocommerce-rest-ts-api';

const newConsumer = 'ck_27ecf70ef2763e5d8adce6d0f42c541582f35041';
const newConsumerSecret = 'cs_171d127e35b9497dad8c5e71d2f3d06211a46b66';

const oldConsumer = 'ck_42f7cc9aab59be4c12c33dccebc4f5a727a5401a';
const oldConsumerSecret = 'cs_fb6330bfc2a696af229a8189d926d88b6d037471';
export class GatewayConfig {
  static End_point = new WooCommerceRestApi({
    url: 'http://localhost/pos',
    consumerKey: oldConsumer,
    consumerSecret: oldConsumerSecret,
    version: 'wc/v3',
    queryStringAuth: false, // Force Basic Authentication as query string true and using under
    timeout: 10000,
  });
}
