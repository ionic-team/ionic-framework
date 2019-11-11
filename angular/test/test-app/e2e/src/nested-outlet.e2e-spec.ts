import { browser, element, by } from 'protractor';
import { waitTime, handleErrorMessages, goBack } from './utils';

describe('nested-outlet', () => {

  afterEach(() => {
    return handleErrorMessages();
  });

  it('should navigate correctly', async () => {
    await browser.get('/nested-outlet/page');
    expect(await element(by.css('ion-router-outlet ion-router-outlet app-nested-outlet-page h1')).getText()).toEqual('Nested page 1');

    await element(by.css('#goto-tabs')).click();
    await waitTime(500);
    await element(by.css('#goto-nested-page1')).click();
    await waitTime(500);
    await element(by.css('#goto-nested-page2')).click();
    await waitTime(500);
    expect(await element(by.css('ion-router-outlet ion-router-outlet app-nested-outlet-page2 h1')).getText()).toEqual('Nested page 2');
  });
});

