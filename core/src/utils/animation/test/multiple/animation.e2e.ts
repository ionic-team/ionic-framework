import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

test.skip('animation: multiple', async () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });

  test(`should resolve grouped animations using web animations`, async ({ page }) => {
    await page.goto('/src/utils/animation/test/multiple');
    await testMultiple(page);
  });

  /**
   * CSS animations will occasionally resolve out of order, so we skip for now
   */
  test.skip(`should resolve grouped animations using css animations`, async ({ page }) => {
    await page.goto('/src/utils/animation/test/multiple?ionic:_forceCSSAnimations=true');
    await testMultiple(page);
  });
});

const testMultiple = async (page: E2EPage) => {
  const ionAnimationFinished = await page.spyOnEvent('ionAnimationFinished');

  await page.click('.play');

  await ionAnimationFinished.next();
  await expect(ionAnimationFinished).toHaveReceivedEventDetail('AnimationCSubBFinished');

  await ionAnimationFinished.next();
  await expect(ionAnimationFinished).toHaveReceivedEventDetail('AnimationBFinished');

  await ionAnimationFinished.next();
  await expect(ionAnimationFinished).toHaveReceivedEventDetail('AnimationCSubAFinished');

  await ionAnimationFinished.next();
  await expect(ionAnimationFinished).toHaveReceivedEventDetail('AnimationCFinished');

  await ionAnimationFinished.next();
  await expect(ionAnimationFinished).toHaveReceivedEventDetail('AnimationAFinished');

  await ionAnimationFinished.next();
  await expect(ionAnimationFinished).toHaveReceivedEventDetail('AnimationRootFinished');

  await expect(ionAnimationFinished).toHaveReceivedEventTimes(6);
};
