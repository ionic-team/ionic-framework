import { newE2EPage } from '@stencil/core/testing';

it('select: multiple-value', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/multiple-value?ionic:animated=false'
  });

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const select = await page.find('#toppings');
  await select.click();

  const alert = await page.find('ion-alert');
  await alert.waitForVisible();

  compare = await page.compareScreenshot('should open toppings multiple select');
  expect(compare).toMatchScreenshot();
});
