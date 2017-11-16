const { register, navigate } = require('../../../../../scripts/e2e');

describe('datetime: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/datetime/test/basic'));

});
