import { newE2EPage } from '@stencil/core/testing';

test('datetime: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/basic?ionic:_testing=true'
  });

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const datetime = await page.find('#customPickerOptions');
  await datetime.waitForVisible();
  await datetime.click();

  const picker = await page.find('ion-picker');
  await picker.waitForVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot('should open custom picker');
  expect(compare).toMatchScreenshot();
});

test('datetime: basic-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/basic?ionic:_testing=true&rtl=true'
  });

  const datetime = await page.find('#customPickerOptions');
  await datetime.click();

  const picker = await page.find('ion-picker');
  await picker.waitForVisible();
  await page.waitFor(250);

  const compare = await page.compareScreenshot('should open custom picker');
  expect(compare).toMatchScreenshot();
});
