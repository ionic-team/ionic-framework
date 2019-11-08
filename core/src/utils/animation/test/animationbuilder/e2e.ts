import { E2EPage, newE2EPage } from '@stencil/core/testing';

test('animation:backwards-compatibility animation', async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/animationbuilder' });
  await testNavigation(page);
});

test('animation:ios-transition web', async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/animationbuilder?ionic:mode=ios' });
  await testNavigation(page);
});

test('animation:ios-transition css', async () => {
  const page = await newE2EPage({ url: '/src/utils/animation/test/animationbuilder?ionic:mode=ios&ionic:_forceCSSAnimations=true' });
  await testNavigation(page);
});

const testNavigation = async (page: E2EPage) => {
  const screenshotCompares = [];
  const ionRouteDidChange = await page.spyOnEvent('ionRouteDidChange');

  screenshotCompares.push(await page.compareScreenshot());

  await page.click('page-root ion-button.next');
  await ionRouteDidChange.next();
  page.click('page-one ion-button.next');
  await ionRouteDidChange.next();
  page.click('page-two ion-button.next');
  await ionRouteDidChange.next();
  page.click('page-three ion-back-button');
  await ionRouteDidChange.next();
  page.click('page-two ion-back-button');
  await ionRouteDidChange.next();
  page.click('page-one ion-back-button');
  await ionRouteDidChange.next();

  screenshotCompares.push(await page.compareScreenshot('end navigation'));

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
};
