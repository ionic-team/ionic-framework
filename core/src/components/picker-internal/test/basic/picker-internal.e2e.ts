import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker-internal', () => {
  // TODO: FW-3020
  test.skip('inline pickers should not have visual regression', async ({ page }) => {
    await page.goto(`/src/components/picker-internal/test/basic`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`picker-internal-inline-diff-${page.getSnapshotSettings()}.png`, {
      fullPage: true,
    });
  });

  test.describe('picker-internal: focus', () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(`
        <ion-picker-internal>
          <ion-picker-column-internal value="full-stack" id="first"></ion-picker-column-internal>
          <ion-picker-column-internal value="onion" id="second"></ion-picker-column-internal>
        </ion-picker-internal>

        <script>
          const columns = document.querySelectorAll('ion-picker-column-internal');
          columns[0].items = [
            { text: 'Minified', value: 'minified' },
            { text: 'Responsive', value: 'responsive' },
            { text: 'Full Stack', value: 'full-stack' },
            { text: 'Mobile First', value: 'mobile-first' },
            { text: 'Serverless', value: 'serverless' },
          ]

          columns[1].items = [
            { text: 'Tomato', value: 'tomato' },
            { text: 'Avocado', value: 'avocado' },
            { text: 'Onion', value: 'onion' },
            { text: 'Potato', value: 'potato' },
            { text: 'Artichoke', value: 'artichoke' },
          ];
        </script>
      `);
    });

    test('tabbing should correctly move focus between columns', async ({ page }) => {
      const firstColumn = page.locator('ion-picker-column-internal#first');
      const secondColumn = page.locator('ion-picker-column-internal#second');

      // Focus first column
      await page.keyboard.press('Tab');
      await expect(firstColumn).toBeFocused();

      await page.waitForChanges();

      // Focus second column
      await page.keyboard.press('Tab');
      await expect(secondColumn).toBeFocused();
    });

    test('tabbing should correctly move focus back', async ({ page }) => {
      const firstColumn = page.locator('ion-picker-column-internal#first');
      const secondColumn = page.locator('ion-picker-column-internal#second');

      await secondColumn.focus();
      await expect(secondColumn).toBeFocused();

      await page.waitForChanges();

      // Focus first column
      await page.keyboard.press('Shift+Tab');
      await expect(firstColumn).toBeFocused();
    });
  });

  test.describe('within overlay:', () => {
    test('popover: should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker-internal/test/basic`);

      const didPresent = await page.spyOnEvent('ionPopoverDidPresent');

      await page.click('#popover');

      await didPresent.next();

      const popover = page.locator('ion-popover');

      await expect(popover).toBeVisible();

      await expect(popover).toHaveScreenshot(`picker-internal-popover-diff-${page.getSnapshotSettings()}.png`, {
        animations: 'disabled'
      });
    });

    test.only('modal: should not have visual regression', async ({ page }) => {
      await page.goto('/src/components/picker-internal/test/basic');

      const modal = page.locator('ion-modal');
      const button = page.locator('#modal');
      const didPresent = await page.spyOnEvent('ionModalDidPresent');
      const pickerInternal = page.locator('ion-modal ion-picker-internal');

      await button.click();
      await didPresent.next();

      // Prevent a dismiss - just in case
      await modal.evaluate((el: HTMLIonModalElement) => el.canDismiss = false);
      await page.waitForChanges();

      await expect(pickerInternal).toBeVisible();

      await expect(modal).toHaveScreenshot(`picker-internal-modal-diff-${page.getSnapshotSettings()}.png`);
    });
  });
});
