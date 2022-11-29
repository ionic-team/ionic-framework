import { test } from '@utils/test/playwright';

test.describe('animation: basic', async () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });

  test(`should resolve using web animations`, async ({ page }) => {
    await page.goto('/src/utils/animation/test/basic');
    const ionAnimationFinished = await page.spyOnEvent('ionAnimationFinished');

    await page.click('.play');

    await ionAnimationFinished.next();
  });

  test(`should resolve using css animations`, async ({ page }) => {
    await page.goto('/src/utils/animation/test/basic?ionic:_forceCSSAnimations=true');

    const ionAnimationFinished = await page.spyOnEvent('ionAnimationFinished');

    await page.click('.play');

    await ionAnimationFinished.next();
  });
});
