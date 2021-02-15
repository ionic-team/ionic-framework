import { newE2EPage } from '@stencil/core/testing';

const navChanged = () => new Promise(resolve => window.addEventListener('ionNavDidChange', resolve));

// TODO: get this to pass
test.skip('nav: nested', async () => {

  const page = await newE2EPage({
    url: '/src/components/nav/test/nested?ionic:_testing=true'
  });

  expect(await page.compareScreenshot()).toMatchScreenshot();

  await page.click('page-one ion-button.next');
  await page.waitForTimeout(navChanged);
  await page.click('page-two-one ion-button.next');
  await page.waitForTimeout(navChanged);
  await page.click('page-two-two ion-button.next');
  await page.waitForTimeout(navChanged);
  await page.click('page-three ion-back-button');
  await page.waitForTimeout(navChanged);
  await page.click('page-two-two ion-back-button');
  await page.waitForTimeout(navChanged);
  await page.click('page-two-one ion-back-button');
  await page.waitForTimeout(navChanged);

  expect(await page.compareScreenshot('stack traversal')).toMatchScreenshot();
});
