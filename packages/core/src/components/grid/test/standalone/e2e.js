
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('grid/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/grid/test/standalone'));

  });
  
