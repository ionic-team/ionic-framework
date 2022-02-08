import { newE2EPage } from '@stencil/core/testing';

test('select: compareWith', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/compare-with?ionic:_testing=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot());

  const selectMultiple = await page.find('#multiple');
  await selectMultiple.click();

  let alert = await page.find('ion-alert');
  await alert.waitForVisible();
  await page.waitForTimeout(250);

  compares.push(await page.compareScreenshot('should open select[multiple] with option selected'));

  await alert.callMethod('dismiss');

  const selectSingle = await page.find('#single');
  await selectSingle.click();

  alert = await page.find('ion-alert');
  await alert.waitForVisible();
  await page.waitForTimeout(250);

  compares.push(await page.compareScreenshot('should open select with option selected'));

  await alert.callMethod('dismiss');

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }

});