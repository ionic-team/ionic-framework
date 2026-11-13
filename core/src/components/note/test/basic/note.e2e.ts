import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
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
 * Only MD and ionic ion-item-divider have ion-note specific logic
 */
configs({ modes: ['md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('note: item-divider'), () => {
    test('should not have visual regressions when next to a label in an item-divider', async ({ page }) => {
      await page.setContent(
        `
        <ion-item-divider>
          <ion-label>Label</ion-label>
          <ion-note slot="end">99</ion-note>
        </ion-item-divider>
      `,
        config
      );
      const itemDivider = page.locator('ion-item-divider');
      await expect(itemDivider).toHaveScreenshot(screenshot(`note-item-divider-label`));
    });

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
          <ion-note slot="end">End Note</ion-note>
        </ion-item-divider>
      `,
        config
      );
      const itemDivider = page.locator('ion-item-divider');
      await expect(itemDivider).toHaveScreenshot(screenshot(`note-item-divider-end`));
    });
  });
});
