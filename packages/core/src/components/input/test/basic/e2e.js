const { register, navigate } = require('../../../../../scripts/e2e');

describe('input: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/input/test/basic'));

});
