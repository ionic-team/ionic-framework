import { expect } from '@playwright/test';
import type { E2EPage, E2EPageOptions } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('ripple-effect: basic'), () => {
    test('should add .ion-activated when pressed', async ({ page }) => {
      await verifyRippleEffect(page, config, '#small-btn');
      await verifyRippleEffect(page, config, '#large-btn');
      await verifyRippleEffect(page, config, '#large-btn-outline');
      await verifyRippleEffect(page, config, '#large-btn-clear');
      await verifyRippleEffect(page, config, '.block');
    });

    test.describe('ripple effect with nested ion-button', () => {
      test('should add .ion-activated when the block is pressed', async ({ page }) => {
        await page.goto('/src/components/ripple-effect/test/basic?ionic:_testing=false', config);
        await isIdleCallbackComplete(page);

        const el = page.locator('#ripple-with-button');

        await el.scrollIntoViewIfNeeded();

        const boundingBox = await el.boundingBox();

        if (boundingBox) {
          await page.mouse.move(boundingBox.x + 5, boundingBox.y + 5);
          await page.mouse.down();
        }

        // Waits for the ripple effect to be added
        await page.locator('.ion-activated').waitFor();

        await expect(el).toHaveClass(/ion-activated/);
      });

      test('should add .ion-activated when the button is pressed', async ({ page }) => {
        await verifyRippleEffect(page, config, '#ripple-with-button ion-button');
      });
    });
  });
});

const verifyRippleEffect = async (page: E2EPage, config: E2EPageOptions, selector: string) => {
  await page.goto('/src/components/ripple-effect/test/basic?ionic:_testing=false', config);
  await isIdleCallbackComplete(page);

  const el = page.locator(selector);

  await el.scrollIntoViewIfNeeded();

  const boundingBox = await el.boundingBox();

  if (boundingBox) {
    await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    await page.mouse.down();
  }

  await page.locator('.ion-activated').waitFor();

  await expect(el).toHaveClass(/ion-activated/);
};

/**
 * This function is used to wait for the idle callback to be called.
 * It mirrors the custom implementation in app.tsx for either
 * using requestIdleCallback on supported browsers or a setTimeout
 * of 32ms (~2 frames) on unsupported browsers (Safari).
 */
const isIdleCallbackComplete = async (page: E2EPage) => {
  await page.waitForFunction(
    () => {
      return new Promise((resolve) => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(resolve);
        } else {
          setTimeout(resolve, 32);
        }
      });
    },
    { timeout: 5000 }
  );
};
