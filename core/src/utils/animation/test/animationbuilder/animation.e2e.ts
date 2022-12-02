import type { E2EPage } from '@utils/test/playwright';
import { test, configs } from '@utils/test/playwright';

test.describe('animation: animationbuilder', async () => {
  configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
    test.describe('backwards-compatibility', () => {
      test(title('backwards-compatibility animation'), async ({ page }) => {
        await page.goto('/src/utils/animation/test/animationbuilder', config);
        await testNavigation(page);
      });
    });
  });

  configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
    test.describe('page transition', () => {
      test(title('ios-transition web'), async ({ page }) => {
        await page.goto('/src/utils/animation/test/animationbuilder', config);
        await testNavigation(page);
      });

      test(title('ios-transition css'), async ({ page }) => {
        await page.goto('/src/utils/animation/test/animationbuilder?ionic:_forceCSSAnimations=true', config);
        await testNavigation(page);
      });
    });
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
