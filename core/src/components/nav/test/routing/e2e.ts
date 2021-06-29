import { newE2EPage } from '@stencil/core/testing';

const navChanged = () => new Promise(resolve => window.addEventListener('ionRouteDidChange', resolve));

test.skip('nav: routing', async () => {

  const page = await newE2EPage({
    url: '/src/components/nav/test/routing?ionic:_testing=true'
  });

  expect(await page.compareScreenshot()).toMatchScreenshot();

  await page.click('page-root ion-button.next');
  await page.waitForTimeout(navChanged);
  await page.click('page-one ion-button.next');
  await page.waitForTimeout(navChanged);
  await page.click('page-two ion-button.next');
  await page.waitForTimeout(navChanged);
  await page.click('page-three ion-back-button');
  await page.waitForTimeout(navChanged);
  await page.click('page-two ion-back-button');
  await page.waitForTimeout(navChanged);
  await page.click('page-one ion-back-button');
  await page.waitForTimeout(navChanged);

  expect(await page.compareScreenshot('stack traversal')).toMatchScreenshot();
});
