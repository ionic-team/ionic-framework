const { register, navigate } = require('../../../../../scripts/e2e');

describe('input/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/input/test/basic'));

});
