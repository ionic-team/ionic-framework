const { register, navigate } = require('../../../../../scripts/e2e');

describe('split-pane/basic', () => {

  register('should init', navigate('http://localhost:3333/src/components/split-pane/test/basic'));

});
