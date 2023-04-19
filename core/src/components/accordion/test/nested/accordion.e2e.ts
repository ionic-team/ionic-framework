import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

test.describe('accordion: nested', () => {
  configs({ directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
    test(title('parent and child should not be disabled'), async ({ page }) => {
      await page.goto(`/src/components/accordion/test/nested`, config);

      const enabledGroup = page.locator('ion-accordion-group#enabled');

      await expect(enabledGroup).toHaveScreenshot(screenshot('accordion-nested-enabled'));
    });

    test(title('parent should not be disabled when only child is disabled'), async ({ page }) => {
      await page.goto(`/src/components/accordion/test/nested`, config);

      const nestedDisabledGroup = page.locator('ion-accordion-group#nested-disabled');

      await expect(nestedDisabledGroup).toHaveScreenshot(screenshot('accordion-child-disabled'));
    });

    test(title('parent and child should be disabled when parent is disabled'), async ({ page }) => {
      await page.goto(`/src/components/accordion/test/nested`, config);

      const parentDisabledGroup = page.locator('ion-accordion-group#parent-disabled');

      await expect(parentDisabledGroup).toHaveScreenshot(screenshot('accordion-parent-disabled'));
    });
  });
});
