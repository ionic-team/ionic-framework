const { register, navigate, Page } = require('../../../../../scripts/e2e');
const testPageURL = 'http://localhost:3333/src/components/modal/test/basic';

describe('modal/basic', () => {

  register('should init', navigate(testPageURL));

  describe('present', () => {

    register('shows modal', driver => {
      const page = new Page(driver, testPageURL);
      return page.present('.e2ePresentModal', { waitFor: 'ion-modal' });
    });

  });

});
