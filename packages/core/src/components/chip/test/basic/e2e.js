const { register, Page } = require('../../../../../scripts/e2e');

describe('chip: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/chip/test/basic');
    return page.navigate();
  });

});
