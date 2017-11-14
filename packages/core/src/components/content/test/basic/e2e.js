const { register, Page } = require('../../../../../scripts/e2e');

describe('content: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/content/test/basic');
    return page.navigate();
  });

});
