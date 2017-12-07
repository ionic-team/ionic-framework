const { register, navigate } = require('../../../../../scripts/e2e');

describe('content/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/content/test/basic'));

});
