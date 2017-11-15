const { register, navigate } = require('../../../../../scripts/e2e');

describe('fab: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/fab/test/basic'));

});
