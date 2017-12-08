
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('fab/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/fab/test/standalone'));

  });
  
