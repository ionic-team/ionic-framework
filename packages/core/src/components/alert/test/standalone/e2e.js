
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('alert/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/alert/test/standalone'));

  });
  
