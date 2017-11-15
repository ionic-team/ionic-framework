const { register, navigate } = require('../../../../../scripts/e2e');

describe('card: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/card/test/basic'));

});
