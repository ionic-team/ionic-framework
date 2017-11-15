const { register, navigate } = require('../../../../../scripts/e2e');

describe('icon: items', () => {

  register('navigates', navigate('http://localhost:3333/src/components/icon/test/items'));

});
