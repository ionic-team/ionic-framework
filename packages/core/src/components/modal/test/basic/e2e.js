const { register, navigate } = require('../../../../../scripts/e2e');

describe('modal: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/modal/test/basic'));

});
