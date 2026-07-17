import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-ios', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('header: scroll-effect-condense'), () => {
    test('should have the condense class on the large title header', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-condense', config);

      const largeTitleHeader = page.locator('#largeTitleHeader');
      await expect(largeTitleHeader).toHaveClass(/header-collapse-condense/);
    });

    test('should not have visual regressions with large title visible', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-condense', config);

      const largeTitleHeader = page.locator('#largeTitleHeader');
      await expect(largeTitleHeader).toHaveScreenshot(screenshot(`header-condense-large-title-initial-diff`));
    });

    test('should not have visual regressions with large title collapsed', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-condense', config);

      const smallTitleHeader = page.locator('#smallTitleHeader');
      const content = page.locator('ion-content');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollToBottom();
      });
      await page.locator('#largeTitleHeader.header-collapse-condense-inactive').waitFor();

      await expect(smallTitleHeader).toHaveScreenshot(screenshot(`header-condense-large-title-collapsed-diff`));
    });

    test('should hide small title from screen readers when collapsed', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-condense', config);
      const smallTitleHeader = page.locator('#smallTitleHeader');
      const smallTitle = smallTitleHeader.locator('ion-title');
      const content = page.locator('ion-content');

      await expect(smallTitle).toHaveAttribute('aria-hidden', 'true');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollToBottom();
      });
      await page.locator('#largeTitleHeader.header-collapse-condense-inactive').waitFor();

      const ariaHidden = await smallTitle.getAttribute('aria-hidden');
      expect(ariaHidden).toBeNull();
    });

    test('should only have the banner role on the active header', async ({ page }) => {
      await page.goto('/src/components/header/test/scroll-effect-condense', config);
      const largeTitleHeader = page.locator('#largeTitleHeader');
      const smallTitleHeader = page.locator('#smallTitleHeader');
      const content = page.locator('ion-content');

      await expect(largeTitleHeader).toHaveAttribute('role', 'banner');
      await expect(smallTitleHeader).toHaveAttribute('role', 'none');

      await content.evaluate(async (el: HTMLIonContentElement) => {
        await el.scrollToBottom();
      });
      await page.locator('#largeTitleHeader.header-collapse-condense-inactive').waitFor();

      await expect(largeTitleHeader).toHaveAttribute('role', 'none');
      await expect(smallTitleHeader).toHaveAttribute('role', 'banner');
    });
  });
});
