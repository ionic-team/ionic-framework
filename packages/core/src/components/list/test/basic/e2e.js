const { register, navigate } = require('../../../../../scripts/e2e');

describe('list: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/list/test/basic'));

});
