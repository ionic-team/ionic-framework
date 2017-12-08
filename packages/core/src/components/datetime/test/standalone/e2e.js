
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('datetime/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/datetime/test/standalone'));

  });
  
