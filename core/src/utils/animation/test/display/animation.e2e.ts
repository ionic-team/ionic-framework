import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('animation: display', async () => {
    test(title('should resolve using web animations'), async ({ page }) => {
      await page.goto('/src/utils/animation/test/display', config);
      await testDisplay(page);
    });

    test(title('should resolve using css animations'), async ({ page }) => {
      await page.goto('/src/utils/animation/test/display?ionic:_forceCSSAnimations=true', config);
      await testDisplay(page);
    });
  });
});

const testDisplay = async (page: E2EPage) => {
  const ionAnimationFinished = await page.spyOnEvent('ionAnimationFinished');

  await page.click('.play');

  await ionAnimationFinished.next();
  await expect(ionAnimationFinished).toHaveReceivedEventDetail('AnimationBFinished');

  await ionAnimationFinished.next();
  await expect(ionAnimationFinished).toHaveReceivedEventDetail('AnimationAFinished');

  await ionAnimationFinished.next();
  await expect(ionAnimationFinished).toHaveReceivedEventDetail('AnimationRootFinished');

  await expect(ionAnimationFinished).toHaveReceivedEventTimes(3);
};
