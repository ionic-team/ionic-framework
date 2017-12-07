const { register, navigate } = require('../../../../../scripts/e2e');

describe('item/buttons', () => {

  register('should init', navigate('http://localhost:3333/src/components/item/test/buttons'));

});
