const { register, navigate } = require('../../../../../scripts/e2e');

describe('toolbar: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/toolbar/test/basic'));

});
