const { register, Page } = require('../../../../../scripts/e2e');

describe('modal: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/modal/test/basic');
    return page.navigate();
  });

});
