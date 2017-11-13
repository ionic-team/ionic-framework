const { register, Page } = require('../../../../../scripts/e2e');

describe('button: toolbar', () => {
  register('navigates', (driver) => {
    const page = new Page(driver, 'http://localhost:3333/src/components/button/test/toolbar');
    return page.navigate();
  });
});
