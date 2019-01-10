import { browser, element, by } from 'protractor';
import { getProperty, setProperty, handleErrorMessages } from './utils';

describe('view-child', () => {

  beforeEach(async () => {
    await browser.get('/view-child');
  });
  afterEach(() => {
    handleErrorMessages();
  });

  it('should get a reference to all children', async () => {
    // button should be red
    expect(await element(by.css('#color-button.ion-color-danger')).isPresent()).toBeTruthy();

    // tabs should be found
    expect(await element(by.css('#tabs-result')).getText()).toEqual('tabs found');
  });

});
