const { register, navigate } = require('../../../../../scripts/e2e');

describe('reorder/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/reorder/test/basic'));

});
