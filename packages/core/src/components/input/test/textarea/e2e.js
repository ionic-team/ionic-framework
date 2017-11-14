const { register, Page } = require('../../../../../scripts/e2e');

describe('input: textarea', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/input/test/textarea');
    return page.navigate();
  });

});
