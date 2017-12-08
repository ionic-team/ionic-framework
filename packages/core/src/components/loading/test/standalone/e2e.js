
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('loading/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/loading/test/standalone'));

  });
  
