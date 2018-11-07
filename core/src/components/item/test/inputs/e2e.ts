import { newE2EPage } from '@stencil/core/testing';

test('item: inputs', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/inputs?ionic:_testing=true'
  });

  // Default case, enabled and no value
  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  // Disable everything
  await page.click('#btnDisabled');
  await page.waitFor(250);

  compare = await page.compareScreenshot('should disable all');
  expect(compare).toMatchScreenshot();

  // Reenable and set some value
  await page.click('#btnDisabled');
  await page.click('#btnSomeValue');
  await page.waitFor(250);

  compare = await page.compareScreenshot('should reenable and set value');
  expect(compare).toMatchScreenshot();

  // Set "null"
  await page.click('#btnNullValue');
  await page.waitFor(250);

  compare = await page.compareScreenshot('should set null');
  expect(compare).toMatchScreenshot();

  // Set "empty"
  await page.click('#btnEmptyValue');
  await page.waitFor(250);

  compare = await page.compareScreenshot('should set empty');
  expect(compare).toMatchScreenshot();

  // Set "empty"
  await page.click('#btnEmptyValue');
  await page.waitFor(250);

  compare = await page.compareScreenshot('should set empty');
  expect(compare).toMatchScreenshot();
});
