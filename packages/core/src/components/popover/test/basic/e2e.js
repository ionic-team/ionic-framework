const { register, navigate, Page } = require('../../../../../scripts/e2e');
const testPageURL = 'http://localhost:3333/src/components/popover/test/basic';


describe('popover/basic', () => {

  register('should init', navigate(testPageURL));

  register('shows modal', driver => {
    const page = new Page(driver, testPageURL);
    return page.present('.e2eShowPopover', { waitFor: 'ion-popover' });
  });

});
