const { register, Page } = require('../../../../../scripts/e2e');

describe('icon: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/icon/test/basic');
    return page.navigate();
  });

});
