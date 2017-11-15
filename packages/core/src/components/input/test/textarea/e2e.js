const { register, navigate } = require('../../../../../scripts/e2e');

describe('input: textarea', () => {

  register('navigates', navigate('http://localhost:3333/src/components/input/test/textarea'));

});
