import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('ripple-effect: basic', () => {
    test(title('should add .ion-activated when pressed'), async ({ page }) => {
      await page.goto(`/src/components/ripple-effect/test/basic?ionic:_testing=false`, config);

      await verifyRippleEffect(page, '#small-btn');
      await verifyRippleEffect(page, '#large-btn');
      await verifyRippleEffect(page, '#large-btn-outline');
      await verifyRippleEffect(page, '#large-btn-clear');
      await verifyRippleEffect(page, '.block');
    });

    test.describe('ripple effect with nested ion-button', () => {
      test(title('should add .ion-activated when the block is pressed'), async ({ page }) => {
        await page.goto(`/src/components/ripple-effect/test/basic?ionic:_testing=false`, config);

        const el = page.locator('#ripple-with-button');

        await el.scrollIntoViewIfNeeded();

        const boundingBox = await el.boundingBox();

        if (boundingBox) {
          await page.mouse.move(boundingBox.x + 5, boundingBox.y + 5);
          await page.mouse.down();
        }

        // Waits for the ripple effect to be added
        await page.waitForSelector('.ion-activated');

        const elHandle = await el.elementHandle();
        const classes = await elHandle?.evaluate((el) => el.classList.value);
        expect(classes).toMatch('ion-activated');
      });

      test(title('should add .ion-activated when the button is pressed'), async ({ page }) => {
        await page.goto(`/src/components/ripple-effect/test/basic?ionic:_testing=false`, config);
        await verifyRippleEffect(page, '#ripple-with-button ion-button');
      });
    });
  });
});

const verifyRippleEffect = async (page: E2EPage, selector: string) => {
  const el = page.locator(selector);

  await el.scrollIntoViewIfNeeded();

  const boundingBox = await el.boundingBox();

  if (boundingBox) {
    await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    await page.mouse.down();
  }

  // Waits for the ripple effect to be added
  await page.waitForSelector(`${selector}.ion-activated`);

  const elHandle = await el.elementHandle();
  const classes = await elHandle?.evaluate((el) => el.classList.value);
  expect(classes).toMatch('ion-activated');
};
