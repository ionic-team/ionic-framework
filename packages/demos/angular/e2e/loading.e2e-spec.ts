import { browser, ElementFinder } from 'protractor/built';

import { LoadingPage } from './loading.po';
import { sleep } from './utils/helpers';

describe('Loading Page', () => {
  let page: LoadingPage;

  beforeEach(() => {
    page = new LoadingPage();
  });

  it('should open page', async (done) => {
    await page.navigateTo();
    done();
  });

  it('should open the loading indicator, then close it', async (done) => {
    const button = await page.getButton();
    await sleep(100);
    await button.click();
    await sleep(500);
    let loading = await page.getLoading();
    expect(loading).toBeTruthy();
    await sleep(1000);
    loading = null;
    loading = await page.getLoading();
    expect(await loading.isPresent()).toBeFalsy();
    done();
  });
});
