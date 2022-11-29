import { test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

test.describe('animation: basic', async () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });

  test(`should resolve using web animations`, async ({ page }) => {
    await page.goto('/src/utils/animation/test/basic');
    await testPage(page);
  });

  test(`should resolve using css animations`, async ({ page }) => {
    await page.goto('/src/utils/animation/test/basic?ionic:_forceCSSAnimations=true');
    await testPage(page);
  });
});

const testPage = async (page: E2EPage) => {
  const ionAnimationFinished = await page.spyOnEvent('ionAnimationFinished');

  await page.click('.play');

  await ionAnimationFinished.next();
};
