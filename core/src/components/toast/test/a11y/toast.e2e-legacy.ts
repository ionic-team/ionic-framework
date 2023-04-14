import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toast: a11y', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This test does not check LTR vs RTL layouts');
    await page.goto(`/src/components/toast/test/a11y`);
  });
  test('should not have any axe violations with polite toasts', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

    const politeButton = page.locator('#polite');
    await politeButton.click();

    await ionToastDidPresent.next();

    /**
     * IonToast overlays the entire screen, so
     * Axe will be unable to verify color contrast
     * on elements under the toast.
     */
    const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();
    expect(results.violations).toEqual([]);
  });
  test('should not have any axe violations with assertive toasts', async ({ page }) => {
    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

    const politeButton = page.locator('#assertive');
    await politeButton.click();

    await ionToastDidPresent.next();

    /**
     * IonToast overlays the entire screen, so
     * Axe will be unable to verify color contrast
     * on elements under the toast.
     */
    const results = await new AxeBuilder({ page }).disableRules('color-contrast').analyze();
    expect(results.violations).toEqual([]);
  });
});
