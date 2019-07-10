import { browser, element, by, ElementFinder } from 'protractor';
import { waitTime, testStack, handleErrorMessages } from './utils';

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

    it('should simulate stack + double tab click', async () => {
      let tab = await getSelectedTab() as ElementFinder;
      await tab.$('#goto-tab1-page2').click();
      await testTabTitle('Tab 1 - Page 2');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested']);
      await testState(1, 'account');
      expect(await tab.$('ion-back-button').isDisplayed()).toBe(true);

      await element(by.css('#tab-button-contact')).click();
      await testTabTitle('Tab 2 - Page 1');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested', 'app-tabs-tab2']);
      await testState(2, 'contact');

      await element(by.css('#tab-button-account')).click();
      tab = await testTabTitle('Tab 1 - Page 2');
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
      await testTabTitle('Tab 1 - Page 2');
      await testState(1, 'account');

      await element(by.css('#tab-button-contact')).click();
      await testTabTitle('Tab 2 - Page 1');
      await testState(2, 'contact');

      await element(by.css('#tab-button-account')).click();
      await testTabTitle('Tab 1 - Page 2');
      await testState(3, 'account');

      await element(by.css('ion-back-button')).click();
      await testTabTitle('Tab 1 - Page 1');
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
      await testState(3, 'account');
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
      await testTabTitle('Tab 1 - Page 2');
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
  });

  describe('entry url - /tabs/account/nested/12', () => {
    beforeEach(async () => {
      await browser.get('/tabs/account/nested/12');
      await waitTime(30);
    });

    it('should only display the back-button when there is a page in the stack', async () => {
      let tab = await testTabTitle('Tab 1 - Page 2') as ElementFinder;
      await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1-nested']);
      expect(await tab.$('ion-back-button').isDisplayed()).toBe(false);

      await element(by.css('#tab-button-account')).click();
      tab = await testTabTitle('Tab 1 - Page 1');

      await tab.$('#goto-tab1-page2').click();
      tab = await testTabTitle('Tab 1 - Page 2');
      expect(await tab.$('ion-back-button').isDisplayed()).toBe(true);
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
      tab = await testTabTitle('Tab 1 - Page 2');
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

async function getSelectedTab(): Promise<ElementFinder> {
  const tabs = element.all(by.css('ion-tabs ion-router-outlet > *:not(.ion-page-hidden)'));
  expect(await tabs.count()).toEqual(1);
  const tab = tabs.first();
  return tab;
}
