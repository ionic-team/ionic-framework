const { register, navigate } = require('../../../../../scripts/e2e');

describe('icon: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/icon/test/basic'));

});
