const { register, navigate } = require('../../../../../scripts/e2e');

describe('chip: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/chip/test/basic'));

});
