import { browser, element, by, ElementFinder } from 'protractor';
import { waitTime, testStack, handleErrorMessages } from './utils';

describe('tabs', () => {

  beforeEach(async () => {
    await browser.get('/tabs');
  });
  afterEach(() => {
    handleErrorMessages();
  });

  it('should redirect and load tab-account', async () => {
    await testTabTitle('Tab 1 - Page 1');
    await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1']);
  });

  it('should simulate stack + double tab click', async () => {
    const tab = await getSelectedTab() as ElementFinder;
    await tab.$('#goto-tab1-page2').click();
    await testTabTitle('Tab 1 - Page 2');
    await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested']);

    await element(by.css('#tab-button-contact')).click();
    await testTabTitle('Tab 2 - Page 1');
    await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested', 'app-tabs-tab2']);

    await element(by.css('#tab-button-account')).click();
    await testTabTitle('Tab 1 - Page 2');
    await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab1-nested', 'app-tabs-tab2']);

    await element(by.css('#tab-button-account')).click();
    await testTabTitle('Tab 1 - Page 1');
    await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
  });

  it('should simulate stack + back button click', async () => {
    const tab = await getSelectedTab();
    await tab.$('#goto-tab1-page2').click();
    await testTabTitle('Tab 1 - Page 2');

    await element(by.css('#tab-button-contact')).click();
    await testTabTitle('Tab 2 - Page 1');

    await element(by.css('#tab-button-account')).click();
    await testTabTitle('Tab 1 - Page 2');

    await element(by.css('ion-back-button')).click();
    await testTabTitle('Tab 1 - Page 1');
    await testStack('ion-tabs ion-router-outlet', ['app-tabs-tab1', 'app-tabs-tab2']);
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
});

async function testTabTitle(title: string) {
  await waitTime(600);
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
