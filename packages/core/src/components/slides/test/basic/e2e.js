const { register, navigate } = require('../../../../../scripts/e2e');

describe('slides: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/slides/test/basic'));

});
