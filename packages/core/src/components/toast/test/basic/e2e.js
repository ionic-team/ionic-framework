const { register, navigate, Page } = require('../../../../../scripts/e2e');
const testPageURL = 'http://localhost:3333/src/components/toast/test/basic';

describe('toast: basic', () => {

  register('navigates', navigate(testPageURL));

  describe('present', () => {

    register('shows bottom toast', driver => {
      const page = new Page(driver, testPageURL);
      return page.present('.e2eShowBottomToast', { waitFor: 'ion-toast' });
    });

  });

});
