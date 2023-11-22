import WooCommerceRestApi from 'woocommerce-rest-ts-api';

const apaceConsumer = 'ck_a90269733198f79f6e4ff5a6a7c1ba1a96d5d210'
const apaceConsumerSecret = 'cs_b1b7db37c239b9759dc160599659aa03f2e1bf26'

const nginxUpdate = 'ck_6e351c2c03847a1016ec97936477881fede50959'
const nginxSecretUpdate = 'cs_2047851d83a6432080c3d01b3107028743b1ca16'

const oldConsumer = 'ck_42f7cc9aab59be4c12c33dccebc4f5a727a5401a';
const oldConsumerSecret = 'cs_fb6330bfc2a696af229a8189d926d88b6d037471';

const mampConsumer = 'ck_7cc10c135fb7d54b82d0cb453daf75f3e19d9c0a'
const mampConsumerSecret = 'cs_7beab32e01349e13074c8bbb7c957631dc20d986'

const newPosV2 = 'ck_8a259abaab73851ed09c2c19d2ef32c605d9be80'
const newPosV2Secret = 'cs_362dbf024cc865d7029fbdc5ac856eed4e3e3e28'

const nginx = 'http://localhost:8080/'
const apace = 'http://localhost:8888/';
const mamp = 'http://localhost/wordpress'
const pos = 'http://localhost/pos'

export class GatewayConfig {
  static End_point = new WooCommerceRestApi({
    url: pos,
    consumerKey: newPosV2,
    consumerSecret: newPosV2Secret,
    version: 'wc/v3',
    queryStringAuth: false, // Force Basic Authentication as query string true and using under
    timeout: 10000,
  });
}
