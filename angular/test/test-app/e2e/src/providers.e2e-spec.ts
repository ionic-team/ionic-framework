import { browser, element, by } from 'protractor';
import { handleErrorMessages, waitTime } from './utils';

describe('providers', () => {

  afterEach(() => {
    return handleErrorMessages();
  });

  it('should load all providers', async () => {
    await browser.get('/providers');

    expect(await element(by.css('#is-loaded')).getText()).toEqual('true');
    expect(await element(by.css('#is-ready')).getText()).toEqual('true');
    expect(await element(by.css('#is-testing')).getText()).toEqual('false');
    expect(await element(by.css('#is-desktop')).getText()).toEqual('true');
    expect(await element(by.css('#is-mobile')).getText()).toEqual('false');
    expect(await element(by.css('#keyboard-height')).getText()).toEqual('12345');
  });

  it('should detect testing mode', async () => {
    await browser.get('/providers?ionic:_testing=true');

    expect(await element(by.css('#is-testing')).getText()).toEqual('true');
  });
});
