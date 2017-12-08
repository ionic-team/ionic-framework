
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('modal/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/modal/test/standalone'));

  });
  
