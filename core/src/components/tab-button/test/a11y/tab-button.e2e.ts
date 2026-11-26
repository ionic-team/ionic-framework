import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe(title('tab-button: a11y'), () => {
    test('should not have any axe violations', async ({ page }) => {
      await page.goto('/src/components/tab-button/test/a11y', config);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

/**
 * Tab order does not vary across modes or directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('tab-button: tabindex'), () => {
    test('should reach tab buttons without href and skip a host tabindex of -1', async ({ page, pageUtils }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30648',
      });

      await page.setContent(
        `
        <input id="before" />
        <ion-tabs>
          <ion-tab tab="one">One</ion-tab>
          <ion-tab tab="two">Two</ion-tab>
          <ion-tab tab="three">Three</ion-tab>
          <ion-tab-bar slot="bottom">
            <ion-tab-button tab="one">One</ion-tab-button>
            <ion-tab-button tab="two" tabindex="-1">Two</ion-tab-button>
            <ion-tab-button tab="three">Three</ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      `,
        config
      );

      const three = page.locator('ion-tab-button[tab="three"]');

      await page.locator('#before').focus();

      await pageUtils.pressKeys('Tab');
      await expect(page.locator('ion-tab-button[tab="one"] a')).toBeFocused();

      await pageUtils.pressKeys('Tab');
      await expect(three.locator('a')).toBeFocused();

      await page.keyboard.press('Enter');
      await expect(three).toHaveClass(/tab-selected/);
    });
  });
});
