import { newE2EPage } from '@stencil/core/testing';

it('select: single-value', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/single-value?ionic:animated=false'
  });

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const select = await page.find('#gender');
  await select.click();

  const alert = await page.find('ion-alert');
  await alert.waitForVisible();

  compare = await page.compareScreenshot('should open gender single select');
  expect(compare).toMatchScreenshot();
});
