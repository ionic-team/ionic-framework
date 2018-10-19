import { newE2EPage } from '@stencil/core/testing';

it('select: single-value', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/single-value?ionic:_testing=true'
  });

  console.log(1);

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  console.log(2);

  const select = await page.find('#gender');
  await select.click();

  console.log(3);

  const alert = await page.find('ion-alert');
  await alert.waitForVisible();

  console.log(4);

  compare = await page.compareScreenshot('should open gender single select');
  expect(compare).toMatchScreenshot();

  console.log(5);
});
