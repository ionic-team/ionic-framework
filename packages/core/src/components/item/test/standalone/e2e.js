
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('item/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/item/test/standalone'));

  });
  
