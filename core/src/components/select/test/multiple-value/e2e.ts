import { newE2EPage } from '@stencil/core/testing';

test('select: multiple-value', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/multiple-value?ionic:_testing=true'
  });

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const select = await page.find('#toppings');
  await select.click();

  const alert = await page.find('ion-alert');
  await alert.waitForVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot('should open toppings multiple select');
  expect(compare).toMatchScreenshot();
});
