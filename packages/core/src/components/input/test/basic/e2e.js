const { register, Page } = require('../../../../../scripts/e2e');

describe('input: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/input/test/basic');
    return page.navigate();
  });

});
