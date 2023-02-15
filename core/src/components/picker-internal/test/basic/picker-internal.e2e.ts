import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker-internal', () => {
  // TODO: FW-3020
  test.skip('inline pickers should not have visual regression', async ({ page }) => {
    await page.goto(`/src/components/picker-internal/test/basic`);

    await page.setIonViewport();

    await expect(await page.screenshot()).toHaveScreenshot(
      `picker-internal-inline-diff-${page.getSnapshotSettings()}.png`,{ fullPage: true }
    );
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
    // TODO (FW-1397): Remove this test.skip when the issue is fixed.
    test.skip(true, 'Mobile Safari and Chrome on Linux renders the selected option incorrectly');

    test('popover: should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker-internal/test/basic`);

      await page.setIonViewport();

      await page.click('#popover');

      await page.spyOnEvent('ionPopoverDidPresent');
      await page.waitForChanges();

      await expect(await page.screenshot()).toHaveScreenshot(
        `picker-internal-popover-diff-${page.getSnapshotSettings()}.png`,{ fullPage: true }
      );
    });

    test('modal: should not have visual regression', async ({ page }) => {
      await page.goto(`/src/components/picker-internal/test/basic`);

      await page.setIonViewport();

      await page.click('#modal');

      await page.spyOnEvent('ionModalDidPresent');
      await page.waitForChanges();

      await expect(await page.screenshot()).toHaveScreenshot(
        `picker-internal-modal-diff-${page.getSnapshotSettings()}.png`,{ fullPage: true }
      );
    });
  });
});
