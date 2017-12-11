const { register, navigate, Page } = require('../../../../../scripts/e2e');
const testPageURL = 'http://localhost:3333/src/components/loading/test/basic';

describe('loading/basic', () => {

  register('should init', navigate(testPageURL));

  register('shows loading', driver => {
    const page = new Page(driver, testPageURL);
    return page.present('.e2eShowLoading', { waitFor: 'ion-loading' });
  });

});
