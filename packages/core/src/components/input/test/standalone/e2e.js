
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('input/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/input/test/standalone'));

  });
  
