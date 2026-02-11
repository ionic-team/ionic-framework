import { expect } from '@playwright/test';
import { configs, test, Viewports } from '@utils/test/playwright';

/**
 * These tests verify that safe-area CSS custom properties are correctly
 * applied to modals based on their type and position.
 *
 * Safe-area handling is position-based and not affected by text direction.
 * Testing only LTR to avoid redundant test runs.
 */

/**
 * The test page (index.html) sets these root safe-area values.
 * Keep in sync with the :root block in test/safe-area/index.html.
 */
const TEST_SAFE_AREA_TOP = '47px';
configs({ modes: ['ios', 'md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: safe-area handling'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/modal/test/safe-area', config);
    });

    test('fullscreen modal should inherit all safe-area values on phone', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // On phone viewport, fullscreen modal should inherit safe-area values
      const safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-bottom');
      });

      expect(safeAreaTop).toBe('inherit');
      expect(safeAreaBottom).toBe('inherit');
    });

    test('regular modal should have safe-area zeroed on tablet (centered dialog)', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      await page.setViewportSize(Viewports.tablet.portrait);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // On tablet viewport, the CSS media query renders regular modals as
      // centered dialogs (600x500). Since they don't touch screen edges,
      // safe-area values should be zeroed out.
      const safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-bottom');
      });

      expect(safeAreaTop).toBe('0px');
      expect(safeAreaBottom).toBe('0px');
    });

    test('sheet modal should only use bottom safe-area', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // Sheet modals should have top safe-area zeroed (doesn't touch top edge)
      // but bottom safe-area inherited (touches bottom edge)
      const safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-bottom');
      });

      expect(safeAreaTop).toBe('0px');
      expect(safeAreaBottom).toBe('inherit');
    });

    test('fullscreen modal without footer should have wrapper padding-bottom', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-modal-no-footer');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // When no footer is present, the wrapper should have reduced height
      // and padding-bottom to prevent content from overlapping the system
      // navigation bar, without changing box-sizing (which would break
      // custom modals with --border-width).
      const wrapper = modal.locator('.modal-wrapper');
      const paddingBottom = await wrapper.evaluate((el: HTMLElement) => {
        return el.style.getPropertyValue('padding-bottom');
      });
      const height = await wrapper.evaluate((el: HTMLElement) => {
        return el.style.getPropertyValue('height');
      });

      expect(paddingBottom).toBe('var(--ion-safe-area-bottom, 0px)');
      expect(height).toBe('calc(var(--height) - var(--ion-safe-area-bottom, 0px))');
    });

    test('sheet modal at breakpoint 1 should keep top safe-area zeroed', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // Initially at breakpoint 0.5 — top safe-area should be zeroed
      let safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      expect(safeAreaTop).toBe('0px');

      // Move to breakpoint 1 (fully expanded) via the public method
      const ionBreakpointDidChange = await page.spyOnEvent('ionBreakpointDidChange');
      await modal.evaluate((el: HTMLIonModalElement) => {
        el.setCurrentBreakpoint(1);
      });
      await ionBreakpointDidChange.next();

      // At breakpoint 1, top safe-area should still be 0px because the
      // sheet height is frozen with the resolved root value. This prevents
      // header content from getting double-offset padding.
      safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      expect(safeAreaTop).toBe('0px');
    });

    test('sheet modal should have --ion-modal-offset-top set with resolved safe-area value', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#sheet-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // The internal --ion-modal-offset-top property should be set to the
      // resolved root --ion-safe-area-top value. The SCSS --height formula
      // uses this instead of --ion-safe-area-top directly.
      const offsetTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-modal-offset-top');
      });
      expect(offsetTop).toBe(TEST_SAFE_AREA_TOP);
    });

    test('fullscreen modal safe-area should update on resize from phone to tablet', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#fullscreen-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // On phone viewport, modal should inherit safe-area
      const safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      expect(safeAreaTop).toBe('inherit');

      // Resize to tablet viewport (centered dialog breakpoint)
      await page.setViewportSize(Viewports.tablet.portrait);

      // Poll until the debounced resize handler updates safe-area overrides
      await expect
        .poll(async () => {
          return modal.evaluate((el: HTMLIonModalElement) => el.style.getPropertyValue('--ion-safe-area-top'));
        })
        .toBe('0px');

      const safeAreaBottom = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-bottom');
      });

      expect(safeAreaBottom).toBe('0px');
    });

    test('centered dialog should have all safe-area values zeroed on tablet', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      await page.setViewportSize(Viewports.tablet.portrait);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#centered-dialog');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // Centered dialogs don't touch any edge, so all safe-areas should be zeroed
      const safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-bottom');
      });

      expect(safeAreaTop).toBe('0px');
      expect(safeAreaBottom).toBe('0px');
    });

    test('safe-area overrides should be cleared on dismiss', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      // Present modal programmatically so we control the lifecycle
      // (the HTML page's presenters call modal.remove() after dismiss,
      // which races with our post-dismiss evaluation)
      await page.evaluate(async () => {
        const modal = document.createElement('ion-modal');
        modal.component = document.createElement('div');
        document.body.appendChild(modal);
        await modal.present();
      });

      const modal = page.locator('ion-modal');

      // Verify overrides are set
      let safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      expect(safeAreaTop).not.toBe('');

      // Dismiss the modal but don't remove the element
      await modal.evaluate(async (el: HTMLIonModalElement) => {
        await el.dismiss();
      });

      // Verify overrides are cleared after dismiss
      safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      expect(safeAreaTop).toBe('');

      // Clean up
      await modal.evaluate((el: HTMLIonModalElement) => el.remove());
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
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // Card modals need top safe-area for height calculation
      const safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-bottom');
      });
      const safeAreaLeft = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-left');
      });
      const safeAreaRight = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-right');
      });

      expect(safeAreaTop).toBe('inherit');
      expect(safeAreaBottom).toBe('inherit');
      expect(safeAreaLeft).toBe('0px');
      expect(safeAreaRight).toBe('0px');
    });

    test('card modal on tablet should still inherit safe-area values', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30900',
      });

      await page.setViewportSize(Viewports.tablet.portrait);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card-modal');
      await ionModalDidPresent.next();

      const modal = page.locator('ion-modal');

      // Card modals use safe-area values in CSS calculations regardless of viewport,
      // so they should inherit even on tablet where regular modals become centered dialogs.
      const safeAreaTop = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-top');
      });
      const safeAreaBottom = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-bottom');
      });
      const safeAreaLeft = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-left');
      });
      const safeAreaRight = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.style.getPropertyValue('--ion-safe-area-right');
      });

      expect(safeAreaTop).toBe('inherit');
      expect(safeAreaBottom).toBe('inherit');
      expect(safeAreaLeft).toBe('0px');
      expect(safeAreaRight).toBe('0px');
    });
  });
});
