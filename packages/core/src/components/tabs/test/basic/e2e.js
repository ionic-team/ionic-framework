const { register, navigate } = require('../../../../../scripts/e2e');

describe('tabs: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/tabs/test/basic'));

});
