import { browser, element, by } from 'protractor';

describe('input', () => {

  beforeEach(async () => {
    await browser.get('/inputs-test');
  });

  it('should have default values', async () => {
    expect(await getProperty('ion-checkbox', 'checked')).toEqual(false);
    expect(await getProperty('ion-toggle', 'checked')).toEqual(false);
    expect(await getProperty('ion-input', 'value')).toEqual('');
    expect(await getProperty('ion-datetime', 'value')).toEqual('');
    expect(await getProperty('ion-select', 'value')).toEqual('');
    expect(await getProperty('ion-range', 'value')).toEqual(null);
  });

  it('should get some value', async () => {
    await element(by.css('#set-button')).click();

    expect(await getProperty('ion-checkbox', 'checked')).toEqual(true);
    expect(await getProperty('ion-toggle', 'checked')).toEqual(true);
    expect(await getProperty('ion-input', 'value')).toEqual('some text');
    expect(await getProperty('ion-datetime', 'value')).toEqual('1994-03-15');
    expect(await getProperty('ion-select', 'value')).toEqual('nes');
    expect(await getProperty('ion-range', 'value')).toEqual(10);
  });

  it('change values should update angular', async () => {
    await setProperty('ion-checkbox', 'checked', true);
    await setProperty('ion-toggle', 'checked', true);
    await setProperty('ion-input', 'value', 'hola');
    await setProperty('ion-datetime', 'value', '1996-03-15');
    await setProperty('ion-select', 'value', 'playstation');
    await setProperty('ion-range', 'value', 20);

    expect(await element(by.css('#checkbox-note')).getText()).toEqual('true');
    expect(await element(by.css('#toggle-note')).getText()).toEqual('true');
    expect(await element(by.css('#input-note')).getText()).toEqual('hola');
    expect(await element(by.css('#datetime-note')).getText()).toEqual('1996-03-15');
    expect(await element(by.css('#select-note')).getText()).toEqual('playstation');
    expect(await element(by.css('#range-note')).getText()).toEqual('20');
  });
});

function getProperty(selector: string, property: string) {
  return browser.executeScript(`
    return document.querySelector('${selector}')['${property}'];
  `);
}

function setProperty(selector: string, property: string, value: any) {
  const text = JSON.stringify(value);
  return browser.executeScript(`
    document.querySelector('${selector}')['${property}'] = ${text};
  `);
}
