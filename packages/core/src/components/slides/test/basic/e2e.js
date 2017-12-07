const { register, navigate } = require('../../../../../scripts/e2e');

describe('slides/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/slides/test/basic'));

});
