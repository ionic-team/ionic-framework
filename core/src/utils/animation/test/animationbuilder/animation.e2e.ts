import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('animation: animationbuilder', async () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('backwards-compatibility animation', async ({ page }) => {
    await page.goto('/src/utils/animation/test/animationbuilder');
    await testNavigation(page);
  });

  test('ios-transition web', async ({ page, skip }) => {
    skip.mode('md');

    await page.goto('/src/utils/animation/test/animationbuilder');
    await testNavigation(page);
  });

  test('ios-transition css', async ({ page, skip }) => {
    skip.mode('md');

    await page.goto('/src/utils/animation/test/animationbuilder?ionic:_forceCSSAnimations=true');
    await testNavigation(page);
  });
});

const testNavigation = async (page: E2EPage) => {
  const ionRouteDidChange = await page.spyOnEvent('ionRouteDidChange');

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
};
