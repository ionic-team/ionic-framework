import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('note: rendering', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl('Note has no custom RTL logic');
  });
  test('should not have visual regressions', async ({ page }) => {
    await page.setContent(`
      <ion-note>99</ion-note>
    `);
    const note = page.locator('ion-note');
    await expect(note).toHaveScreenshot(`note-diff-${page.getSnapshotSettings()}.png`);
  });

  test('should render color correctly', async ({ page }) => {
    await page.setContent(`
      <ion-note color="danger">99</ion-note>
    `);
    const note = page.locator('ion-note');
    await expect(note).toHaveScreenshot(`note-color-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('note: item', () => {
  test.beforeEach(({ skip }) => {
    skip.mode('ios', 'Only MD ion-item has ion-note specific logic');
  });
  test('should not have visual regressions when in the start slot of an item', async ({ page }) => {
    await page.setContent(`
      <ion-item>
        <ion-label>Label</ion-label>
        <ion-note slot="start">Start Note</ion-note>
      </ion-item>
    `);
    const item = page.locator('ion-item');
    await expect(item).toHaveScreenshot(`note-item-start-${page.getSnapshotSettings()}.png`);
  });

  test('should not have visual regressions when in the end slot of an item', async ({ page }) => {
    await page.setContent(`
      <ion-item>
        <ion-label>Label</ion-label>
        <ion-note slot="end">End Note</ion-note>
      </ion-item>
    `);
    const item = page.locator('ion-item');
    await expect(item).toHaveScreenshot(`note-item-end-${page.getSnapshotSettings()}.png`);
  });
});

test.describe('note: item-divider', () => {
  test.beforeEach(({ skip }) => {
    skip.mode('ios', 'Only MD ion-item-divider has ion-note specific logic');
  });
  test('should not have visual regressions when in the start slot of an item-divider', async ({ page }) => {
    await page.setContent(`
      <ion-item-divider>
        <ion-note slot="start">Start Note</ion-note>
      </ion-item-divider>
    `);
    const itemDivider = page.locator('ion-item-divider');
    await expect(itemDivider).toHaveScreenshot(`note-item-divider-start-${page.getSnapshotSettings()}.png`);
  });

  test('should not have visual regressions when in the end slot of an item-divider', async ({ page }) => {
    await page.setContent(`
      <ion-item-divider>
        <ion-note slot="start">End Note</ion-note>
      </ion-item-divider>
    `);
    const itemDivider = page.locator('ion-item-divider');
    await expect(itemDivider).toHaveScreenshot(`note-item-divider-end-${page.getSnapshotSettings()}.png`);
  });
});
