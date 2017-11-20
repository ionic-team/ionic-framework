const { register, navigate } = require('../../../../../scripts/e2e');

describe('grid: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/grid/test/basic'));

});
