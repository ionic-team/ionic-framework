import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

test.describe('accordion: nested', () => {
  configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/accordion/test/nested`, config);
    });

    test(title('parent and child should not be disabled'), async ({ page }) => {
      const enabledGroup = page.locator('ion-accordion-group#enabled');

      expect(await enabledGroup.screenshot()).toMatchSnapshot(
        `accordion-nested-enabled-${page.getSnapshotSettings()}.png`
      );
    });

    test(title('parent should not be disabled when only child is disabled'), async ({ page }) => {
      const nestedDisabledGroup = page.locator('ion-accordion-group#nested-disabled');

      expect(await nestedDisabledGroup.screenshot()).toMatchSnapshot(
        `accordion-child-disabled-${page.getSnapshotSettings()}.png`
      );
    });

    test(title('parent and child should be disabled when parent is disabled'), async ({ page }) => {
      const parentDisabledGroup = page.locator('ion-accordion-group#parent-disabled');

      expect(await parentDisabledGroup.screenshot()).toMatchSnapshot(
        `accordion-parent-disabled-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
