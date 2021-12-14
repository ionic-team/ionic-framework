import { newE2EPage } from '@stencil/core/testing';
import { testModal } from '../test.utils';

const DIRECTORY = 'card';

test('modal: card', async () => {
  await testModal(DIRECTORY, '#card', true);
});

test('modal: card - custom', async () => {
  await testModal(DIRECTORY, '#card-custom', true);
});

test('modal: card - Stacked, Tablet', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/card?ionic:_testing=true' });

  // Ensure that we get tablet styles
  await page.setViewport({ width: 768, height: 500 });

  const screenshotCompares = [];
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#card');
  await page.waitForSelector('#card');

  await ionModalDidPresent.next();

  screenshotCompares.push(await page.compareScreenshot());

  await page.click('.add');
  await page.waitForSelector('.add');

  await ionModalDidPresent.next();

  screenshotCompares.push(await page.compareScreenshot());
});

test('modal: card - Stacked, Mobile', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/card?ionic:_testing=true' });

  const screenshotCompares = [];
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#card');
  await page.waitForSelector('#card');

  await ionModalDidPresent.next();

  screenshotCompares.push(await page.compareScreenshot());

  await page.click('.add');
  await page.waitForSelector('.add');

  await ionModalDidPresent.next();

  screenshotCompares.push(await page.compareScreenshot());
});

test('modal: card - Custom, Stacked, Tablet', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/card?ionic:_testing=true' });

  // Ensure that we get tablet styles
  await page.setViewport({ width: 768, height: 500 });

  const screenshotCompares = [];
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#card-custom');
  await page.waitForSelector('#card-custom');

  await ionModalDidPresent.next();

  screenshotCompares.push(await page.compareScreenshot());

  await page.click('.add');
  await page.waitForSelector('.add');

  await ionModalDidPresent.next();

  screenshotCompares.push(await page.compareScreenshot());
});

test('modal: card - Custom, Stacked, Mobile', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/card?ionic:_testing=true' });

  const screenshotCompares = [];
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#card-custom');
  await page.waitForSelector('#card-custom');

  await ionModalDidPresent.next();

  screenshotCompares.push(await page.compareScreenshot());

  await page.click('.add');
  await page.waitForSelector('.add');

  await ionModalDidPresent.next();

  screenshotCompares.push(await page.compareScreenshot());
});
