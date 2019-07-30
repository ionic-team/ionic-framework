import { newE2EPage } from '@stencil/core/testing';

const navChanged = () => new Promise(resolve => window.addEventListener('ionRouteDidChange', resolve));

test('animation:backwards-compatibility animationbuilder', async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/animationbuilder?ionic:_testing=true' });
  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

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

  screenshotCompares.push(await page.compareScreenshot());
});
