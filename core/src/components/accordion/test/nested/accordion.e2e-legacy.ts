import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('accordion: nested', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();

    await page.goto(`/src/components/accordion/test/nested`);
  });

  test('parent and child should not be disabled', async ({ page }) => {
    const enabledGroup = page.locator('ion-accordion-group#enabled');

    await expect(enabledGroup).toHaveScreenshot(`accordion-nested-enabled-${page.getSnapshotSettings()}.png`);
  });

  test('parent should not be disabled when only child is disabled', async ({ page }) => {
    const nestedDisabledGroup = page.locator('ion-accordion-group#nested-disabled');

    await expect(nestedDisabledGroup).toHaveScreenshot(`accordion-child-disabled-${page.getSnapshotSettings()}.png`);
  });

  test('parent and child should be disabled when parent is disabled', async ({ page }) => {
    const parentDisabledGroup = page.locator('ion-accordion-group#parent-disabled');

    await expect(parentDisabledGroup).toHaveScreenshot(`accordion-parent-disabled-${page.getSnapshotSettings()}.png`);
  });
});
