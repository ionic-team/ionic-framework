const { register, navigate } = require('../../../../../scripts/e2e');

describe('toolbar/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/toolbar/test/basic'));

});
