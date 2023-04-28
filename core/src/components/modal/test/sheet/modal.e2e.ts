import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Sheet does not have any additional RTL behaviors
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('sheet modal: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/modal/test/sheet', config);
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal');

      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-sheet-present`));
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('sheet modal: backdrop'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/sheet', config);
    });
    test('should dismiss the sheet modal when clicking the active backdrop', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#backdrop-active');

      await ionModalDidPresent.next();

      await page.mouse.click(50, 50);

      await ionModalDidDismiss.next();
    });
    test('should present another sheet modal when clicking an inactive backdrop', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('.custom-height');

      await page.click('#backdrop-inactive');
      await ionModalDidPresent.next();

      await page.click('#custom-height-modal');
      await ionModalDidPresent.next();

      await expect(modal).toBeVisible();
    });
    test('input outside sheet modal should be focusable when backdrop is inactive', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#backdrop-inactive');

      await ionModalDidPresent.next();

      const input = page.locator('#root-input input').first();
      await input.click();
      await expect(input).toBeFocused();
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('sheet modal: clicking the handle'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/sheet', config);
    });

    test('should advance to the next breakpoint when handleBehavior is cycle', async ({ page }) => {
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('ion-modal');

      await page.click('#handle-behavior-cycle-modal');
      await ionModalDidPresent.next();

      const handle = page.locator('ion-modal .modal-handle');

      await handle.click();
      await ionBreakpointDidChange.next();

      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(0.5);

      await handle.click();
      await ionBreakpointDidChange.next();

      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(0.75);

      await handle.click();
      await ionBreakpointDidChange.next();

      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(1);

      await handle.click();
      await ionBreakpointDidChange.next();

      // Advancing from the last breakpoint should change the breakpoint to the first non-zero breakpoint
      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(0.25);
    });

    test('should not advance the breakpoint when handleBehavior is none', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('ion-modal');

      await page.click('#sheet-modal');
      await ionModalDidPresent.next();

      const handle = page.locator('ion-modal .modal-handle');

      await handle.click();

      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(0.25);
    });

    test('should not dismiss the modal when backdrop is clicked and breakpoint is moving', async ({ page }) => {
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const modal = page.locator('ion-modal');

      await page.click('#handle-behavior-cycle-modal');
      await ionModalDidPresent.next();

      const handle = page.locator('ion-modal .modal-handle');
      const backdrop = page.locator('ion-modal ion-backdrop');

      await handle.click();
      backdrop.click();

      await ionBreakpointDidChange.next();

      await handle.click();

      await ionBreakpointDidChange.next();

      await expect(await modal.evaluate((el: HTMLIonModalElement) => el.getCurrentBreakpoint())).toBe(0.75);
    });
  });
});
