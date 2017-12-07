const { register, navigate } = require('../../../../../scripts/e2e');

describe('toggle/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/toggle/test/basic'));

});
