import { browser, element, by } from 'protractor';
import { handleErrorMessages, waitTime } from './utils';

describe('slides', () => {

  beforeEach(async () => {
    await browser.get('/slides');
    await waitTime(30);
  });
  afterEach(() => {
    return handleErrorMessages();
  });

  it('should change index on slide change', async () => {
    expect(await element.all(by.css('ion-slide')).count()).toEqual(0);
    await addSlides();
    expect(await element.all(by.css('ion-slide')).count()).toEqual(3);

    await checkIndex('0');

    await nextSlide();
    await checkIndex('1');

    await nextSlide();
    await checkIndex('2');

    await prevSlide();
    await checkIndex('1');
  });
});

async function checkIndex(index: string) {
  expect(await element(by.css('#slide-index')).getText()).toEqual(index);
  expect(await element(by.css('#slide-index-2')).getText()).toEqual(index);
}

async function addSlides() {
  await element(by.css('#add-slides')).click();
  await waitTime(800);
}


async function nextSlide() {
  await element(by.css('#btn-next')).click();
  await waitTime(800);
}

async function prevSlide() {
  await element(by.css('#btn-prev')).click();
  await waitTime(800);
}
