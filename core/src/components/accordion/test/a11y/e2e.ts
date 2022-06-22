import { newE2EPage } from '@stencil/core/testing';

const getActiveElementText = async (page) => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return page.evaluate((el) => el?.innerText, activeElement);
};

const getActiveInputID = async (page) => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return page.evaluate((el) => el?.closest('ion-input')?.id, activeElement);
};

test('accordion: a11y', async () => {
  const page = await newE2EPage({
    url: '/src/components/accordion/test/a11y?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('accordion:rtl: a11y', async () => {
  const page = await newE2EPage({
    url: '/src/components/accordion/test/a11y?ionic:_testing=true&rtl=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('accordion: keyboard navigation', async () => {
  const page = await newE2EPage({
    url: '/src/components/accordion/test/a11y?ionic:_testing=true',
  });

  await page.keyboard.press('Tab');
  expect(await getActiveElementText(page)).toEqual('Personal Information');

  await page.keyboard.press('ArrowDown');
  expect(await getActiveElementText(page)).toEqual('Billing Address');

  await page.keyboard.press('ArrowDown');
  expect(await getActiveElementText(page)).toEqual('Shipping Address');

  await page.keyboard.press('ArrowDown');
  expect(await getActiveElementText(page)).toEqual('Personal Information');

  await page.keyboard.press('ArrowUp');
  expect(await getActiveElementText(page)).toEqual('Shipping Address');

  // open Shipping Address accordion and move focus to the input inside it
  await page.keyboard.press('Enter');
  await page.waitForChanges();
  await page.keyboard.press('Tab');

  const activeID = await getActiveInputID(page);
  expect(activeID).toEqual('address1');

  // ensure keyboard interaction doesn't move focus from body
  await page.keyboard.press('ArrowDown');
  const activeIDAgain = await getActiveInputID(page);
  expect(activeIDAgain).toEqual('address1');
});
