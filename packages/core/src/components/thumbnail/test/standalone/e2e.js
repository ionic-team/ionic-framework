
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('thumbnail/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/thumbnail/test/standalone'));

  });
  
