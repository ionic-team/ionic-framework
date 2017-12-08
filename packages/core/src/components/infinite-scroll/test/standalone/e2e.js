
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('infinite-scroll/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/infinite-scroll/test/standalone'));

  });
  
