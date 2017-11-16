const { register, navigate } = require('../../../../../scripts/e2e');

describe('range: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/range/test/basic'));

});
