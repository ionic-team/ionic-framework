import { browser, element, by } from 'protractor';
import { waitTime, testStack, testLifeCycle, handleErrorMessages } from './utils';

describe('router-link', () => {

  beforeEach(async () => {
    await browser.get('/router-link');
  });
  afterEach(() => {
    handleErrorMessages();
  });


  it('should have correct lifecycle counts', async () => {
    await testLifeCycle('app-router-link', {
      ionViewWillEnter: 1,
      ionViewDidEnter: 1,
      ionViewWillLeave: 0,
      ionViewDidLeave: 0,
    });
  });

  describe('forward', () => {

    it('should go forward with ion-button[routerLink]', async () => {
      await element(by.css('#routerLink')).click();
      await testForward();

      // test go back
      await element(by.css('ion-back-button')).click();
      await waitTime(500);

      await testStack('ion-router-outlet', ['app-router-link']);
      await testLifeCycle('app-router-link', {
        ionViewWillEnter: 2,
        ionViewDidEnter: 2,
        ionViewWillLeave: 1,
        ionViewDidLeave: 1,
      });
    });

    it('should go forward with a[routerLink]', async () => {
      await element(by.css('#a')).click();
      await testForward();
    });

    it('should go forward with button + navigateByUrl()', async () => {
      await element(by.css('#button')).click();
      await testForward();
    });

    it('should go forward with button + navigateForward()', async () => {
      await element(by.css('#button-forward')).click();
      await testForward();
    });
  });

  describe('root', () => {

    it('should go root with ion-button[routerLink][routerDirection=root]', async () => {
      await element(by.css('#routerLink-root')).click();
      await testRoot();
    });

    it('should go root with a[routerLink][routerDirection=root]', async () => {
      await element(by.css('#a-root')).click();
      await testRoot();
    });

    it('should go root with button + navigateRoot', async () => {
      await element(by.css('#button-root')).click();
      await testRoot();
    });
  });

  describe('back', () => {

    it('should go back with ion-button[routerLink][routerDirection=back]', async () => {
      await element(by.css('#routerLink-back')).click();
      await testBack();
    });

    it('should go back with a[routerLink][routerDirection=back]', async () => {
      await element(by.css('#a-back')).click();
      await testBack();
    });

    it('should go back with button + navigateBack', async () => {
      await element(by.css('#button-back')).click();
      await testBack();
    });
  });
});

async function testForward() {
  await waitTime(500);
  await testStack('ion-router-outlet', ['app-router-link', 'app-router-link-page']);
  await testLifeCycle('app-router-link', {
    ionViewWillEnter: 1,
    ionViewDidEnter: 1,
    ionViewWillLeave: 1,
    ionViewDidLeave: 1,
  });
  await testLifeCycle('app-router-link-page', {
    ionViewWillEnter: 1,
    ionViewDidEnter: 1,
    ionViewWillLeave: 0,
    ionViewDidLeave: 0,
  });

}

async function testRoot() {
  await waitTime(200);
  await testStack('ion-router-outlet', ['app-router-link-page']);
  await testLifeCycle('app-router-link-page', {
    ionViewWillEnter: 1,
    ionViewDidEnter: 1,
    ionViewWillLeave: 0,
    ionViewDidLeave: 0,
  });
}

async function testBack() {
  await waitTime(500);
  await testStack('ion-router-outlet', ['app-router-link-page']);
  await testLifeCycle('app-router-link-page', {
    ionViewWillEnter: 1,
    ionViewDidEnter: 1,
    ionViewWillLeave: 0,
    ionViewDidLeave: 0,
  });
}
