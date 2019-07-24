import { browser, element, by } from 'protractor';
import { waitTime, getText, handleErrorMessages } from './utils';

describe('modals', () => {

  beforeEach(async () => {
    await browser.get('/modals');
    await waitTime(30);
  });
  afterEach(() => {
    return handleErrorMessages();
  });

  it('should open standalone modal and close', async () => {
    await element(by.css('#action-button')).click();

    await waitTime(800);

    const modal = element(by.css('app-modal-example'));
    expect(await modal.$('h2').getText()).toEqual('123');
    expect(await modal.$('h3').getText()).toEqual('321');

    expect(await getText('#onWillDismiss')).toEqual('false');
    expect(await getText('#onDidDismiss')).toEqual('false');

    await modal.$('#close-modal').click();
    await waitTime(800);

    expect(await getText('#onWillDismiss')).toEqual('true');
    expect(await getText('#onDidDismiss')).toEqual('true');
  });

  it('should open nav modal and close', async () => {
    await element(by.css('#action-button-2')).click();

    await waitTime(800);

    let page = element(by.css('ion-nav > *:last-child'));
    expect(await page.$('h2').getText()).toEqual('123');
    expect(await page.$('h3').getText()).toEqual('321');

    await page.$('.push-page').click();
    await waitTime(800);

    page = element(by.css('ion-nav > *:last-child'));
    expect(await page.$('h2').getText()).toEqual('pushed!');
    expect(await page.$('h3').getText()).toEqual('');

    await page.$('.pop-page').click();
    await waitTime(800);

    page = element(by.css('ion-nav > *:last-child'));
    expect(await page.$('h2').getText()).toEqual('123');
  });
});
