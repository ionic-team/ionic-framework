import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const getScrollTop = (content: Locator) => {
  return content.evaluate(async (el: HTMLIonContentElement) => (await el.getScrollElement()).scrollTop);
};

const scrollContent = async (content: Locator) => {
  await content.evaluate((el: HTMLIonContentElement) => el.scrollToPoint(0, 500));
  await expect.poll(() => getScrollTop(content)).toBe(500);
};

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('tabs: tabTap'), () => {
    test('should scroll the content to the top when pressing the selected tab button', async ({ page }) => {
      await page.goto('/src/components/tabs/test/tab-tap?ionic:tabTap=true', config);

      const content = page.locator('page-one ion-content');
      await scrollContent(content);

      await page.click('ion-tab-button[tab="tab-one"]');

      await expect.poll(() => getScrollTop(content)).toBe(0);
    });

    test('should scroll the content of a selected tab without a nav to the top', async ({ page }) => {
      await page.goto('/src/components/tabs/test/tab-tap?ionic:tabTap=true', config);

      await page.click('ion-tab-button[tab="tab-two"]');

      const content = page.locator('ion-tab[tab="tab-two"] ion-content');
      await expect(content).toBeVisible();
      await scrollContent(content);

      await page.click('ion-tab-button[tab="tab-two"]');

      await expect.poll(() => getScrollTop(content)).toBe(0);
    });

    test('should not scroll the content when the nav is not at its root page', async ({ page }) => {
      await page.goto('/src/components/tabs/test/tab-tap?ionic:tabTap=true', config);

      await page.click('#push-page-two');

      const content = page.locator('page-two ion-content');
      await expect(content).toBeVisible();
      await scrollContent(content);

      await page.click('ion-tab-button[tab="tab-one"]');

      // Wait longer than the scroll animation so that a scroll would have finished
      await page.waitForTimeout(500);

      expect(await getScrollTop(content)).toBe(500);
    });

    test('should not scroll the content when tabTap is disabled', async ({ page }) => {
      await page.goto('/src/components/tabs/test/tab-tap', config);

      const content = page.locator('page-one ion-content');
      await scrollContent(content);

      await page.click('ion-tab-button[tab="tab-one"]');

      // Wait longer than the scroll animation so that a scroll would have finished
      await page.waitForTimeout(500);

      expect(await getScrollTop(content)).toBe(500);
    });
  });
});
