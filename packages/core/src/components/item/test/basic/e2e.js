const { register, navigate } = require('../../../../../scripts/e2e');

describe('item: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/item/test/basic'));

});
