
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('toast/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/toast/test/standalone'));

  });
  
