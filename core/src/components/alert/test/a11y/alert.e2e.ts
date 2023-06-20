import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

const testAria = async (
  page: E2EPage,
  buttonID: string,
  expectedAriaLabelledBy: string | null,
  expectedAriaDescribedBy: string | null
) => {
  const didPresent = await page.spyOnEvent('ionAlertDidPresent');
  const button = page.locator(`#${buttonID}`);

  await button.click();
  await didPresent.next();

  const alert = page.locator('ion-alert');

  /**
   * expect().toHaveAttribute() can't check for a null value, so grab and check
   * the values manually instead.
   */
  const ariaLabelledBy = await alert.getAttribute('aria-labelledby');
  const ariaDescribedBy = await alert.getAttribute('aria-describedby');

  expect(ariaLabelledBy).toBe(expectedAriaLabelledBy);
  expect(ariaDescribedBy).toBe(expectedAriaDescribedBy);
};

configs({ directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('alert: a11y'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/alert/test/a11y`, config);
    });
    test('should not have accessibility violations when header and message are defined', async ({ page }) => {
      const didPresent = await page.spyOnEvent('ionAlertDidPresent');
      const button = page.locator('#bothHeaders');
      await button.click();

      await didPresent.next();

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('should have aria-labelledby when header is set', async ({ page }) => {
      await testAria(page, 'noMessage', 'alert-1-hdr', null);
    });

    test('should have aria-describedby when message is set', async ({ page }) => {
      await testAria(page, 'noHeaders', null, 'alert-1-msg');
    });

    test('should fall back to subHeader for aria-labelledby if header is not defined', async ({ page }) => {
      await testAria(page, 'subHeaderOnly', 'alert-1-sub-hdr', 'alert-1-msg');
    });

    test('should allow for manually specifying aria attributes', async ({ page }) => {
      await testAria(page, 'customAria', 'Custom title', 'Custom description');
    });
  });
});
