import { browser, element, by } from 'protractor';
import { handleErrorMessages, waitTime, testStack } from './utils';

describe('navigation', () => {

  afterEach(() => {
    return handleErrorMessages();
  });

  it('should navigate correctly', async () => {
    await browser.get('/navigation/page1');
    await waitTime(2000);
    await testStack('ion-router-outlet', ['app-navigation-page2', 'app-navigation-page1']);

    const pageHidden = element(by.css('app-navigation-page2'));
    expect(await pageHidden.getAttribute('aria-hidden')).toEqual('true');
    expect(await pageHidden.getAttribute('class')).toEqual('ion-page ion-page-hidden');

    const pageVisible = element(by.css('app-navigation-page1'));
    expect(await pageVisible.getAttribute('aria-hidden')).toEqual(null);
    expect(await pageVisible.getAttribute('class')).toEqual('ion-page can-go-back');
  });

});
