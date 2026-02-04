import { expect } from '@playwright/test';
import { configs, test, Viewports } from '@utils/test/playwright';

/**
 * These tests verify that safe-area CSS custom properties are correctly
 * applied to modals based on their type and position.
 *
 * FW-6830: Dynamic Modal Safe-Area Handling
 */
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: safe-area handling'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('fullscreen modal should inherit all safe-area values on phone', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // On phone viewport, fullscreen modal should inherit safe-area values
      const safeAreaTop = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-bottom');
      });

      expect(safeAreaTop.trim()).toBe('inherit');
      expect(safeAreaBottom.trim()).toBe('inherit');
    });

    test('fullscreen modal should inherit all safe-area values on tablet', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/FW-6830',
      });

      await page.setViewportSize(Viewports.tablet.portrait);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // On tablet viewport, fullscreen modal should still inherit safe-area values
      // This is the key fix for FW-6830 - previously these were zeroed out
      const safeAreaTop = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-bottom');
      });

      expect(safeAreaTop.trim()).toBe('inherit');
      expect(safeAreaBottom.trim()).toBe('inherit');
    });

    test('sheet modal should only use bottom safe-area', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // Sheet modals should have top safe-area zeroed (doesn't touch top edge)
      // but bottom safe-area inherited (touches bottom edge)
      const safeAreaTop = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-bottom');
      });

      expect(safeAreaTop.trim()).toBe('0px');
      expect(safeAreaBottom.trim()).toBe('inherit');
    });

    test('centered dialog should have all safe-area values zeroed on tablet', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/FW-6830',
      });

      await page.setViewportSize(Viewports.tablet.portrait);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#centered-dialog');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // Centered dialogs don't touch any edge, so all safe-areas should be zeroed
      const safeAreaTop = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-bottom');
      });

      expect(safeAreaTop.trim()).toBe('0px');
      expect(safeAreaBottom.trim()).toBe('0px');
    });

    test('safe-area overrides should be cleared on dismiss', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#fullscreen-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // Verify overrides are set
      let safeAreaTop = await modal.evaluate((el: HTMLElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      expect(safeAreaTop).not.toBe('');

      // Dismiss the modal
      await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
      await ionModalDidDismiss.next();

      // Verify overrides are cleared
      safeAreaTop = await modal.evaluate((el: HTMLElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      expect(safeAreaTop).toBe('');
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: card modal safe-area (iOS only)'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('card modal should inherit top and bottom safe-area', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/FW-6830',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // Card modals need top safe-area for height calculation
      const safeAreaTop = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-bottom');
      });
      const safeAreaLeft = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-left');
      });
      const safeAreaRight = await modal.evaluate((el: HTMLElement) => {
        return getComputedStyle(el).getPropertyValue('--ion-safe-area-right');
      });

      expect(safeAreaTop.trim()).toBe('inherit');
      expect(safeAreaBottom.trim()).toBe('inherit');
      expect(safeAreaLeft.trim()).toBe('0px');
      expect(safeAreaRight.trim()).toBe('0px');
    });
  });
});
