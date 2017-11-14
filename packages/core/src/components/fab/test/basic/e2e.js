const { register, Page } = require('../../../../../scripts/e2e');

describe('fab: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/fab/test/basic');
    return page.navigate();
  });

});
