
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('range/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/range/test/standalone'));

  });
  
