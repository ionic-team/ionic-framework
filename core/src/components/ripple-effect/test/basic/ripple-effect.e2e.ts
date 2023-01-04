import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

// TODO FW-3081
test.describe.skip('ripple-effect: basic', () => {
  test('should add .ion-activated when pressed', async ({ page }) => {
    await verifyRippleEffect(page, '#small-btn');
    await verifyRippleEffect(page, '#large-btn');
    await verifyRippleEffect(page, '#large-btn-outline');
    await verifyRippleEffect(page, '#large-btn-clear');
    await verifyRippleEffect(page, '.block');
  });

  test.describe('ripple effect with nested ion-button', () => {
    test('should add .ion-activated when the block is pressed', async ({ page }) => {
      await page.goto(`/src/components/ripple-effect/test/basic?ionic:_testing=false&ionic:mode=md`);

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

    test('should add .ion-activated when the button is pressed', async ({ page }) => {
      await verifyRippleEffect(page, '#ripple-with-button ion-button');
    });
  });
});

const verifyRippleEffect = async (page: E2EPage, selector: string) => {
  await page.goto(`/src/components/ripple-effect/test/basic?ionic:_testing=false&ionic:mode=md`);

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
