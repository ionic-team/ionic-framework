import { browser, element, by } from 'protractor';
import { handleErrorMessages, setProperty, getText, waitTime } from './utils';

describe('form', () => {

  afterEach(() => {
    return handleErrorMessages();
  });

  describe('change', () => {
    beforeEach(async () => {
      await browser.get('/form');
      await waitTime(30);
    });

    it('should have default values', async () => {
      await testStatus('INVALID');
      expect(await getText('#submit')).toEqual('false');
      await testData({
        'datetime': '2010-08-20',
        'select': null,
        'toggle': false,
        'input': '',
        'input2': 'Default Value',
        'checkbox': false,
        'range': 5
      });
    });

    it('should become valid', async () => {
      await setProperty('ion-input.required', 'value', 'Some value');
      await testStatus('INVALID');
      await setProperty('ion-select', 'value', 'nes');
      await testStatus('INVALID');
      await setProperty('ion-range', 'value', 40);
      await testStatus('VALID');
      await testData({
        'datetime': '2010-08-20',
        'select': 'nes',
        'toggle': false,
        'input': 'Some value',
        'input2': 'Default Value',
        'checkbox': false,
        'range': 40
      });
    });

    it('ion-toggle should change', async () => {
      await element(by.css('form ion-toggle')).click();
      await testData({
        'datetime': '2010-08-20',
        'select': null,
        'toggle': true,
        'input': '',
        'input2': 'Default Value',
        'checkbox': false,
        'range': 5
      });
    });

    it('ion-checkbox should change', async () => {
      await element(by.css('ion-checkbox')).click();
      await testData({
        'datetime': '2010-08-20',
        'select': null,
        'toggle': false,
        'input': '',
        'input2': 'Default Value',
        'checkbox': true,
        'range': 5
      });
    });

    it('should submit', async () => {
      await element(by.css('#set-values')).click();
      await waitTime(100);
      await element(by.css('#submit-button')).click();
      expect(await getText('#submit')).toEqual('true');
    });
  });

  describe('blur', () => {
    beforeEach(async () => {
      await browser.get('/form#blur');
      await waitTime(30);
    });

    it('ion-toggle should change only after blur', async () => {
      await element(by.css('form ion-toggle')).click();
      await testData({
        'datetime': '2010-08-20',
        'select': null,
        'toggle': false,
        'input': '',
        'input2': 'Default Value',
        'checkbox': false,
        'range': 5
      });
      await element(by.css('ion-checkbox')).click();
      await testData({
        'datetime': '2010-08-20',
        'select': null,
        'toggle': true,
        'input': '',
        'input2': 'Default Value',
        'checkbox': false,
        'range': 5
      });
    });
  });
});

async function testStatus(status: string) {
  expect(await element(by.css('#status')).getText()).toEqual(status);
}

async function testData(data: any) {
  expect(JSON.parse(await element(by.css('#data')).getText())).toEqual(data);
}
