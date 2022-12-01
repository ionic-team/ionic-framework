import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('note: rendering', () => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.setContent(
        `
        <ion-note>99</ion-note>
      `,
        config
      );
      const note = page.locator('ion-note');
      expect(await note.screenshot()).toMatchSnapshot(`note-diff-${page.getSnapshotSettings()}.png`);
    });

    test(title('should render color correctly'), async ({ page }) => {
      await page.setContent(
        `
        <ion-note color="danger">99</ion-note>
      `,
        config
      );
      const note = page.locator('ion-note');
      expect(await note.screenshot()).toMatchSnapshot(`note-color-${page.getSnapshotSettings()}.png`);
    });
  });
});
configs({ modes: ['md'] }).forEach(({ title, config }) => {
  test.describe('note: item', () => {
    test(title('should not have visual regressions when in the start slot of an item'), async ({ page }) => {
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
      expect(await item.screenshot()).toMatchSnapshot(`note-item-start-${page.getSnapshotSettings()}.png`);
    });

    test(title('should not have visual regressions when in the end slot of an item'), async ({ page }) => {
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
      expect(await item.screenshot()).toMatchSnapshot(`note-item-end-${page.getSnapshotSettings()}.png`);
    });
  });

  test.describe('note: item-divider', () => {
    test(title('should not have visual regressions when in the start slot of an item-divider'), async ({ page }) => {
      await page.setContent(
        `
        <ion-item-divider>
          <ion-note slot="start">Start Note</ion-note>
        </ion-item-divider>
      `,
        config
      );
      const itemDivider = page.locator('ion-item-divider');
      expect(await itemDivider.screenshot()).toMatchSnapshot(
        `note-item-divider-start-${page.getSnapshotSettings()}.png`
      );
    });

    test(title('should not have visual regressions when in the end slot of an item-divider'), async ({ page }) => {
      await page.setContent(
        `
        <ion-item-divider>
          <ion-note slot="start">End Note</ion-note>
        </ion-item-divider>
      `,
        config
      );
      const itemDivider = page.locator('ion-item-divider');
      expect(await itemDivider.screenshot()).toMatchSnapshot(`note-item-divider-end-${page.getSnapshotSettings()}.png`);
    });
  });
});
