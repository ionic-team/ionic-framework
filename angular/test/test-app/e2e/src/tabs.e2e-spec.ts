import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';
import { handleErrorMessages, testStack, waitTime } from './utils';

describe('tabs', () => {
  afterEach(() => {
    return handleErrorMessages();
  });
  describe('entry url - /tabs', () => {
    beforeEach(async () => {
      await browser.get('/tabs');
      await waitTime(30);
    });

    it('should redirect and load tab-account', async () => {
      await testTabTitle('Tab 1 - Page 1');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1']);
      await testState(1, 'account');
    });

    it('should navigate between tabs and ionChange events should be dispatched ', async () => {
      let tab = await testTabTitle('Tab 1 - Page 1');
      expect(await tab.$('.segment-changed').getText()).toEqual('false');

      await element(by.css('#tab-button-contact')).click();
      tab = await testTabTitle('Tab 2 - Page 1');
      expect(await tab.$('.segment-changed').getText()).toEqual('false');
    });

    it('should simulate stack + double tab click', async () => {
      let tab = await getSelectedTab() as ElementFinder;
      await tab.$('#goto-tab1-page2').click();
      await testTabTitle('Tab 1 - Page 2 (1)');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested']);
      await testState(1, 'account');
      expect(await tab.$('ion-back-button').isDisplayed()).toBe(true);

      await element(by.css('#tab-button-contact')).click();
      await testTabTitle('Tab 2 - Page 1');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested', 'app-tabs-tab2']);
      await testState(2, 'contact');

      await element(by.css('#tab-button-account')).click();
      tab = await testTabTitle('Tab 1 - Page 2 (1)');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested', 'app-tabs-tab2']);
      await testState(3, 'account');
      expect(await tab.$('ion-back-button').isDisplayed()).toBe(true);

      await element(by.css('#tab-button-account')).click();
      await testTabTitle('Tab 1 - Page 1');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
      await testState(3, 'account');
    });

    it('should simulate stack + back button click', async () => {
      const tab = await getSelectedTab();
      await tab.$('#goto-tab1-page2').click();
      await testTabTitle('Tab 1 - Page 2 (1)');
      await testState(1, 'account');

      await element(by.css('#tab-button-contact')).click();
      await testTabTitle('Tab 2 - Page 1');
      await testState(2, 'contact');

      await element(by.css('#tab-button-account')).click();
      await testTabTitle('Tab 1 - Page 2 (1)');
      await testState(3, 'account');

      await element(by.css('ion-back-button')).click();
      await testTabTitle('Tab 1 - Page 1');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
      await testState(3, 'account');
    });

    it('should navigate deep then go home', async () => {
      let tab = await getSelectedTab();
      await tab.$('#goto-tab1-page2').click();
      tab = await testTabTitle('Tab 1 - Page 2 (1)');

      await tab.$('#goto-next').click();
      tab = await testTabTitle('Tab 1 - Page 2 (2)');

      await element(by.css('#tab-button-contact')).click();
      tab = await testTabTitle('Tab 2 - Page 1');

      await element(by.css('#tab-button-account')).click();
      await testTabTitle('Tab 1 - Page 2 (2)');
      await testStack('ion-tabs ion-router-outlet', [
        'app-tabs-tab1',
        'app-tabs-tab1-nested',
        'app-tabs-tab1-nested',
        'app-tabs-tab2'
      ]);
      await element(by.css('#tab-button-account')).click();
      await testTabTitle('Tab 1 - Page 1');
      await testStack('ion-tabs ion-router-outlet', [
        'app-tabs-tab1',
        'app-tabs-tab2'
      ]);
    });

    it('should switch tabs and go back', async () => {
      await element(by.css('#tab-button-contact')).click();
      const tab = await testTabTitle('Tab 2 - Page 1');

      await tab.$('#goto-tab1-page1').click();
      await testTabTitle('Tab 1 - Page 1');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
    });

    it('should switch tabs and go to nested', async () => {
      await element(by.css('#tab-button-contact')).click();
      const tab = await testTabTitle('Tab 2 - Page 1');

      await tab.$('#goto-tab1-page2').click();
      await testTabTitle('Tab 1 - Page 2 (1)');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab2', 'app-tabs-tab1-nested']);
    });

    it('should load lazy loaded tab', async () => {
      await element(by.css('#tab-button-lazy')).click();
      await testTabTitle('Tab 3 - Page 1');
    });

    it('should use ion-back-button defaultHref', async () => {
      let tab = await getSelectedTab() as ElementFinder;
      await tab.$('#goto-tab3-page2').click();
      tab = await testTabTitle('Tab 3 - Page 2');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab3-nested']);

      await tab.$('ion-back-button').click();
      await testTabTitle('Tab 3 - Page 1');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab3']);
    });

    it('should preserve navigation extras when switching tabs', async () => {
      const expectUrlToContain = 'search=hello#fragment';
      let tab = await getSelectedTab() as ElementFinder;
      await tab.$('#goto-nested-page1-with-query-params').click();
      await testTabTitle('Tab 1 - Page 2 (1)');
      await testUrlContains(expectUrlToContain);

      await element(by.css('#tab-button-contact')).click();
      await testTabTitle('Tab 2 - Page 1');

      await element(by.css('#tab-button-account')).click();
      tab = await testTabTitle('Tab 1 - Page 2 (1)');
      await testUrlContains(expectUrlToContain);
    });

    it('should set root when clicking on an active tab to navigate to the root', async () => {
      const expectNestedTabUrlToContain = 'search=hello#fragment';
      const tab = await getSelectedTab() as ElementFinder;
      const initialUrl = await browser.getCurrentUrl();
      await tab.$('#goto-nested-page1-with-query-params').click();
      await testTabTitle('Tab 1 - Page 2 (1)');
      await testUrlContains(expectNestedTabUrlToContain);

      await element(by.css('#tab-button-account')).click();
      await testTabTitle('Tab 1 - Page 1');

      await testUrlEquals(initialUrl);
    });

  });

  describe('entry tab contains navigation extras', () => {
    const expectNestedTabUrlToContain = 'search=hello#fragment';
    const rootUrlParams = 'test=123#rootFragment';
    const rootUrl = `/tabs/account?${rootUrlParams}`;

    beforeEach(async () => {
      await browser.get(rootUrl);
      await waitTime(30);
    });

    it('should preserve root url navigation extras when clicking on an active tab to navigate to the root', async () => {
      await browser.get(rootUrl);

      const tab = await getSelectedTab() as ElementFinder;
      await tab.$('#goto-nested-page1-with-query-params').click();
      await testTabTitle('Tab 1 - Page 2 (1)');
      await testUrlContains(expectNestedTabUrlToContain);

      await element(by.css('#tab-button-account')).click();
      await testTabTitle('Tab 1 - Page 1');

      await testUrlContains(rootUrl);
    });

    it('should preserve root url navigation extras when changing tabs', async () => {
      await browser.get(rootUrl);

      let tab = await getSelectedTab() as ElementFinder;
      await element(by.css('#tab-button-contact')).click();
      tab = await testTabTitle('Tab 2 - Page 1');

      await element(by.css('#tab-button-account')).click();
      await testTabTitle('Tab 1 - Page 1');

      await testUrlContains(rootUrl);
    });

    it('should navigate deep then go home and preserve navigation extras', async () => {
      let tab = await getSelectedTab();
      await tab.$('#goto-tab1-page2').click();
      tab = await testTabTitle('Tab 1 - Page 2 (1)');

      await tab.$('#goto-next').click();
      tab = await testTabTitle('Tab 1 - Page 2 (2)');

      await element(by.css('#tab-button-contact')).click();
      tab = await testTabTitle('Tab 2 - Page 1');

      await element(by.css('#tab-button-account')).click();
      await testTabTitle('Tab 1 - Page 2 (2)');

      await element(by.css('#tab-button-account')).click();
      await testTabTitle('Tab 1 - Page 1');

      await testUrlContains(rootUrl);
    });
  });

  describe('entry url - /tabs/account/nested/1', () => {
    beforeEach(async () => {
      await browser.get('/tabs/account/nested/1');
      await waitTime(30);
    });

    it('should only display the back-button when there is a page in the stack', async () => {
      let tab = await testTabTitle('Tab 1 - Page 2 (1)') as ElementFinder;
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1-nested']);
      expect(await tab.$('ion-back-button').isDisplayed()).toBe(false);

      await element(by.css('#tab-button-account')).click();
      tab = await testTabTitle('Tab 1 - Page 1');

      await tab.$('#goto-tab1-page2').click();
      tab = await testTabTitle('Tab 1 - Page 2 (1)');
      expect(await tab.$('ion-back-button').isDisplayed()).toBe(true);
    });

    it('should not reuse the same page', async () => {
      let tab = await testTabTitle('Tab 1 - Page 2 (1)') as ElementFinder;
      await tab.$('#goto-next').click();
      tab = await testTabTitle('Tab 1 - Page 2 (2)');
      await tab.$('#goto-next').click();
      tab = await testTabTitle('Tab 1 - Page 2 (3)');

      await testStack('ion-tabs ion-router-outlet', [
        'app-tabs-tab1-nested',
        'app-tabs-tab1-nested',
        'app-tabs-tab1-nested'
      ]);

      await tab.$('ion-back-button').click();
      tab = await testTabTitle('Tab 1 - Page 2 (2)');
      await tab.$('ion-back-button').click();
      tab = await testTabTitle('Tab 1 - Page 2 (1)');

      expect(await tab.$('ion-back-button').isDisplayed()).toBe(false);

      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1-nested']);
    });
  });

  describe('entry url - /tabs/lazy', () => {
    beforeEach(async () => {
      await browser.get('/tabs/lazy');
      await waitTime(30);
    });

    it('should not display the back-button if coming from a different stack', async () => {
      let tab = await testTabTitle('Tab 3 - Page 1') as ElementFinder;
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab3']);

      await tab.$('#goto-tab1-page2').click();
      tab = await testTabTitle('Tab 1 - Page 2 (1)');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab3', 'app-tabs-tab1-nested']);
      expect(await tab.$('ion-back-button').isDisplayed()).toBe(false);
    });
  });

  describe('enter url - /tabs/contact/one', () => {
    beforeEach(async () => {
      await browser.get('/tabs/contact/one');
      await waitTime(30);
    });

    it('should return to correct tab after going to page in different outlet', async () => {
      const tab = await getSelectedTab();
      await tab.$('#goto-nested-page1').click();

      await waitTime(600);
      await testStack('app-nested-outlet ion-router-outlet', ['app-nested-outlet-page']);

      const nestedOutlet = await element(by.css('app-nested-outlet'));
      const backButton = await nestedOutlet.$('ion-back-button');
      await backButton.click();

      await testTabTitle('Tab 2 - Page 1');
    });
  })
});

async function testState(count: number, tab: string) {
  expect(await element(by.css('#tabs-state')).getText()).toEqual(`${count}.${tab}`);
}

async function testTabTitle(title: string) {
  await waitTime(1000);
  const tab = await getSelectedTab();
  expect(await tab.$('ion-title').getText()).toEqual(title);
  return tab;
}

async function testUrlContains(urlFragment: string) {
  await browser.wait(ExpectedConditions.urlContains(urlFragment),
    5000,
    `expected ${browser.getCurrentUrl()} to contain ${urlFragment}`);
}

async function testUrlEquals(url: string) {
  await browser.wait(ExpectedConditions.urlIs(url),
    5000,
    `expected ${browser.getCurrentUrl()} to equal ${url}`);
}

async function getSelectedTab(): Promise<ElementFinder> {
  const tabs = element.all(by.css('ion-tabs ion-router-outlet > *:not(.ion-page-hidden)'));
  expect(await tabs.count()).toEqual(1);
  const tab = tabs.first();
  return tab;
}
