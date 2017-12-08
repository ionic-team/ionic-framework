
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('label/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/label/test/standalone'));

  });
  
