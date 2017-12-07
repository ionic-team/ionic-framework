const { register, navigate } = require('../../../../../scripts/e2e');

describe('inifinite-scroll/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/infinite-scroll/test/basic'));

});
