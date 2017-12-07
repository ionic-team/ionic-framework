const { register, navigate } = require('../../../../../scripts/e2e');

describe('item-sliding/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/item-sliding/test/basic'));

});
