import { browser, element, by } from 'protractor';
import { handleErrorMessages, waitTime } from './utils';

describe('slides', () => {

  beforeEach(async () => {
    await browser.get('/slides');
  });
  afterEach(() => {
    handleErrorMessages();
  });

  it('should change index on slide change', async () => {
    expect(await element(by.css('#slide-index')).getText()).toEqual('0');
    await nextSlide();

    expect(await element(by.css('#slide-index')).getText()).toEqual('1');
    await nextSlide();

    expect(await element(by.css('#slide-index')).getText()).toEqual('2');
    await prevSlide();

    expect(await element(by.css('#slide-index')).getText()).toEqual('1');
  });
});

async function nextSlide() {
  await element(by.css('#btn-next')).click();
  await waitTime(800);
}

async function prevSlide() {
  await element(by.css('#btn-prev')).click();
  await waitTime(800);
}