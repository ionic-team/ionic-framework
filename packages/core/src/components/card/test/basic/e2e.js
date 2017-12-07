const { register, navigate } = require('../../../../../scripts/e2e');

describe('card/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/card/test/basic'));

});
