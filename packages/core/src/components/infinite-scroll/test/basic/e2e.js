const { register, navigate } = require('../../../../../scripts/e2e');

describe('inifinite-scroll: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/infinite-scroll/test/basic'));

});
