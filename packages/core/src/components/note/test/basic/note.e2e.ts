import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Note has no custom RTL logic
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('note: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-note>99</ion-note>
      `,
        config
      );
      const note = page.locator('ion-note');
      await expect(note).toHaveScreenshot(screenshot(`note-diff`));
    });

    test('should render color correctly', async ({ page }) => {
      await page.setContent(
        `
        <ion-note color="danger">99</ion-note>
      `,
        config
      );
      const note = page.locator('ion-note');
      await expect(note).toHaveScreenshot(screenshot(`note-color`));
    });
  });
});

/**
 * Only MD ion-item has ion-note specific logic
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('note: item'), () => {
    test('should not have visual regressions when in the start slot of an item', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-label>Label</ion-label>
          <ion-note slot="start">Start Note</ion-note>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      await expect(item).toHaveScreenshot(screenshot(`note-item-start`));
    });

    test('should not have visual regressions when in the end slot of an item', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-label>Label</ion-label>
          <ion-note slot="end">End Note</ion-note>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      await expect(item).toHaveScreenshot(screenshot(`note-item-end`));
    });
  });
});

/**
 * Only MD ion-item-divider has ion-note specific logic
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('note: item-divider'), () => {
    test('should not have visual regressions when in the start slot of an item-divider', async ({ page }) => {
      await page.setContent(
        `
        <ion-item-divider>
          <ion-note slot="start">Start Note</ion-note>
        </ion-item-divider>
      `,
        config
      );
      const itemDivider = page.locator('ion-item-divider');
      await expect(itemDivider).toHaveScreenshot(screenshot(`note-item-divider-start`));
    });

    test('should not have visual regressions when in the end slot of an item-divider', async ({ page }) => {
      await page.setContent(
        `
        <ion-item-divider>
          <ion-note slot="start">End Note</ion-note>
        </ion-item-divider>
      `,
        config
      );
      const itemDivider = page.locator('ion-item-divider');
      await expect(itemDivider).toHaveScreenshot(screenshot(`note-item-divider-end`));
    });
  });
});
