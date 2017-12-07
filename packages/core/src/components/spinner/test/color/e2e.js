const { register, navigate } = require('../../../../../scripts/e2e');

describe('spinner/color', () => {

  register('should init', navigate('http://localhost:3333/src/components/spinner/test/color'));

});
