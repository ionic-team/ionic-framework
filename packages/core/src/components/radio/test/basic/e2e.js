const { register, navigate } = require('../../../../../scripts/e2e');

describe('radio/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/radio/test/basic'));

});
