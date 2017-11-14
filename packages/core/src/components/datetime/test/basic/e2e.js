const { register, Page } = require('../../../../../scripts/e2e');

describe('datetime: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/datetime/test/basic');
    return page.navigate();
  });

});
