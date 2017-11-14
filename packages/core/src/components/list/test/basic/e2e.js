const { register, Page } = require('../../../../../scripts/e2e');

describe('list: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/list/test/basic');
    return page.navigate();
  });

});
