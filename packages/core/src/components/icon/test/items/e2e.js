const { register, Page } = require('../../../../../scripts/e2e');

describe('icon: items', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/icon/test/items');
    return page.navigate();
  });

});
