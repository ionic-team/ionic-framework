const { register, navigate } = require('../../../../../scripts/e2e');

describe('checkbox: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/checkbox/test/basic'));

});
