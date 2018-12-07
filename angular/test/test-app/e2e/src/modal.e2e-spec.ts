import { browser, element, by } from 'protractor';
import { waitTime, getText, handleErrorMessages } from './utils';

describe('modals', () => {

  beforeEach(async () => {
    await browser.get('/modals');
  });
  afterEach(() => {
    handleErrorMessages();
  });

  it('should open and close', async () => {
    await element(by.css('#action-button')).click();

    await waitTime(1000);

    const modal = element(by.css('app-modal-example'));
    expect(await modal.$('h2').getText()).toEqual('123');

    expect(await getText('#onWillDismiss')).toEqual('false');
    expect(await getText('#onDidDismiss')).toEqual('false');

    await modal.$('#close-modal').click();
    await waitTime(1000);

    expect(await getText('#onWillDismiss')).toEqual('true');
    expect(await getText('#onDidDismiss')).toEqual('true');
  });

});
