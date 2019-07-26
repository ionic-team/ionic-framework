import { browser, element, by } from 'protractor';
import { handleErrorMessages, waitTime } from './utils';

describe('view-child', () => {

  beforeEach(async () => {
    await browser.get('/view-child');
    await waitTime(30);
  });
  afterEach(() => {
    return handleErrorMessages();
  });

  it('should get a reference to all children', async () => {
    // button should be red
    expect(await element(by.css('#color-button.ion-color-danger')).isPresent()).toBeTruthy();

    // tabs should be found
    expect(await element(by.css('#tabs-result')).getText()).toEqual('all found');
  });

});
