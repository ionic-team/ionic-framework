const { register, navigate } = require('../../../../../scripts/e2e');

describe('button/strong', () => {

  register('should init', navigate('http://localhost:3333/src/components/button/test/strong'));

});
