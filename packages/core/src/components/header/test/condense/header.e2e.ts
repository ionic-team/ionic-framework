import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('header: condense'), () => {
    test('should be hidden from screen readers when collapsed', async ({ page }) => {
      await page.goto('/src/components/header/test/condense', config);
      const largeTitleHeader = page.locator('#largeTitleHeader');
      const smallTitleHeader = page.locator('#smallTitleHeader');
      const content = page.locator('ion-content');

      await expect(smallTitleHeader).toHaveAttribute('aria-hidden', 'true');

      await expect(largeTitleHeader).toHaveScreenshot(screenshot(`header-condense-large-title-initial-diff`));

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollToBottom();
      });
      await page.locator('#largeTitleHeader.header-collapse-condense-inactive').waitFor();

      await expect(smallTitleHeader).toHaveScreenshot(screenshot(`header-condense-large-title-collapsed-diff`));

      /**
       * Playwright can't do .not.toHaveAttribute() because a value is expected,
       * and toHaveAttribute can't accept a value of type null.
       */
      const ariaHidden = await smallTitleHeader.getAttribute('aria-hidden');
      expect(ariaHidden).toBeNull();

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollToTop();
      });
      await page.locator('#smallTitleHeader.header-collapse-condense-inactive').waitFor();

      await expect(smallTitleHeader).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
