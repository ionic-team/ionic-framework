const { register, navigate } = require('../../../../../scripts/e2e');

describe('nav/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/nav/test/basic'));

});
