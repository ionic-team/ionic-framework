const { register, navigate, Page } = require('../../../../../scripts/e2e');
const testPageURL = 'http://localhost:3333/src/components/select/test/basic';

describe('select/basic', () => {

  register('should init', navigate(testPageURL));

  register('shows selector', driver => {
    const page = new Page(driver, testPageURL);
    return page.present('.e2eSelectGender > button', { waitFor: 'ion-alert' });
  });

});
