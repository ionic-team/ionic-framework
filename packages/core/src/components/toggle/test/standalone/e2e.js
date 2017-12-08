
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('toggle/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/toggle/test/standalone'));

  });
  
