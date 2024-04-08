import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('animation: hooks'), async () => {
    test(`should fire hooks using web animations`, async ({ page }) => {
      await page.goto('/src/utils/animation/test/hooks', config);
      await testHooks(page);
    });
  });
});

const testHooks = async (page: E2EPage) => {
  const square = page.locator('.square-a');
  const ionAnimationFinished = await page.spyOnEvent('ionAnimationFinished');
  const beforeRead = await page.spyOnEvent('beforeRead');
  const beforeWrite = await page.spyOnEvent('beforeWrite');
  const afterRead = await page.spyOnEvent('afterRead');
  const afterWrite = await page.spyOnEvent('afterWrite');

  // Test initial classes
  await expect(square).toHaveClass(/hello-world/);
  await expect(square).not.toHaveClass(/test-class/);

  // Test initial styles
  await expect(square).toHaveCSS('padding-bottom', '20px');
  await expect(square).toHaveCSS('color', 'rgb(0, 0, 0)');

  await page.click('.play');

  // Test beforeRemoveClass and beforeAddClass
  await expect(square).not.toHaveClass(/hello-world/);
  await expect(square).toHaveClass(/test-class/);

  // Test beforeStyles and beforeClearStyles
  await expect(square).toHaveCSS('padding-bottom', '0px');
  await expect(square).toHaveCSS('color', 'rgb(128, 0, 128)');

  await beforeRead.next();
  await beforeWrite.next();

  await ionAnimationFinished.next();

  await afterRead.next();
  await afterWrite.next();

  // Test afterRemoveClass and afterAddClass
  await expect(square).toHaveClass(/hello-world/);
  await expect(square).not.toHaveClass(/test-class/);

  // Test afterStyles and afterClearStyles
  await expect(square).toHaveCSS('padding-bottom', '20px');
  await expect(square).toHaveCSS('color', 'rgb(0, 0, 0)');
};
