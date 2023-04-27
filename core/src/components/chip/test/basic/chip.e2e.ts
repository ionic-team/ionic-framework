import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('chip: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/chip/test/basic', config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`chip-basic`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('chip: descenders'), () => {
    test('should not clip descenders in item', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/18313',
      });

      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-chip>
              <ion-label>Agreements</ion-label>
            </ion-chip>
          </ion-item>
        </ion-list>
      `,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot(`chip-descender`));
    });
  });
});
