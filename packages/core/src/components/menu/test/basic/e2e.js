const { register, Page } = require('../../../../../scripts/e2e');

describe('menu: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/menu/test/basic');
    return page.navigate();
  });

});
