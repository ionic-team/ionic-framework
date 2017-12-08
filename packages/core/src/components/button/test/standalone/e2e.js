
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('button/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/button/test/standalone'));

  });
  
