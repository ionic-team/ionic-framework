const { register, navigate } = require('../../../../../scripts/e2e');

describe('menu: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/menu/test/basic'));

});
