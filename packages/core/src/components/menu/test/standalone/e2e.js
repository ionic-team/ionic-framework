
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('menu/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/menu/test/standalone'));

  });
  
