import { newE2EPage } from '@stencil/core/testing';

it('datetime: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/basic?ionic:_testing=true'
  });

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const datetime = await page.find('#customPickerOptions');
  await datetime.click();

  const picker = await page.find('ion-picker');
  await picker.waitForVisible();
  await page.waitFor(100);

  compare = await page.compareScreenshot('should open custom picker');
  expect(compare).toMatchScreenshot();
});
