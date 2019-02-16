import { newE2EPage } from '@stencil/core/testing';

const navChanged = () => new Promise(resolve => window.addEventListener('ionRouteDidChange', resolve));

test.skip('nav: routing', async () => {

  const page = await newE2EPage({
    url: '/src/components/nav/test/routing?ionic:_testing=true'
  });

  expect(await page.compareScreenshot()).toMatchScreenshot();

  page.click('page-root ion-button.next');
  await page.waitFor(navChanged);
  page.click('page-one ion-button.next');
  await page.waitFor(navChanged);
  page.click('page-two ion-button.next');
  await page.waitFor(navChanged);
  page.click('page-three ion-back-button');
  await page.waitFor(navChanged);
  page.click('page-two ion-back-button');
  await page.waitFor(navChanged);
  page.click('page-one ion-back-button');
  await page.waitFor(navChanged);

  expect(await page.compareScreenshot('stack traversal')).toMatchScreenshot();
});
