const { register, navigate } = require('../../../../../scripts/e2e');

describe('segment/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/segment/test/basic'));

});
