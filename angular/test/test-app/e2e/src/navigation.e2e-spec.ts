import { browser, element, by } from 'protractor';
import { handleErrorMessages, waitTime, testStack } from './utils';

describe('navigation', () => {

  afterEach(() => {
    return handleErrorMessages();
  });

  // TODO: Fix flaky tests
  xit ('should swipe and abort', async () => {
    await browser.get('/router-link?ionic:mode=ios');
    await waitTime(500);
    await element(by.css('#routerLink')).click();
    await waitTime(500);
    await swipeLeft(5);
    await waitTime(500);

    const pageHidden = element(by.css('app-router-link'));
    expect(await pageHidden.getAttribute('aria-hidden')).toEqual('true');
    expect(await pageHidden.getAttribute('class')).toEqual('ion-page ion-page-hidden');

    const pageVisible = element(by.css('app-router-link-page'));
    expect(await pageVisible.getAttribute('aria-hidden')).toEqual(null);
    expect(await pageVisible.getAttribute('class')).toEqual('ion-page can-go-back');
  });

  xit ('should swipe and go back', async () => {
    await browser.get('/router-link?ionic:mode=ios');
    await waitTime(500);
    await element(by.css('#routerLink')).click();
    await waitTime(500);
    await testStack('ion-router-outlet', ['app-router-link', 'app-router-link-page']);

    await swipeLeft(300);

    await waitTime(1000);
    await testStack('ion-router-outlet', ['app-router-link']);

    const page = element(by.css('app-router-link'));
    expect(await page.getAttribute('aria-hidden')).toEqual(null);
    expect(await page.getAttribute('class')).toEqual('ion-page');
  })

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

function swipeLeft(end: number) {
  return browser.driver.touchActions()
    .tapAndHold({x: 5, y: 1})
    .move({x: 6, y: 1})
    .move({x: 7, y: 1})
    .move({x: 8, y: 1})
    .move({x: 30, y: 1})
    .move({x: 300, y: 1})
    .move({x: end, y: 1})
    .move({x: end, y: 1})
    .release({x: end, y: 1})
    .perform();
}