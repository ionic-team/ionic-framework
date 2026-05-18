import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: dismiss behavior'), () => {
    test.describe(title('modal: default dismiss'), () => {
      test('should dismiss the last presented modal when the default dismiss button is clicked', async ({ page }) => {
        await page.goto('/src/components/modal/test/dismiss-behavior', config);

        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
        const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

        await page.click('#present-first-modal');
        await ionModalDidPresent.next();
        const firstModal = page.locator('ion-modal[data-testid="modal-1"]');
        await expect(firstModal).toBeVisible();

        await page.click('#present-next-modal');
        await ionModalDidPresent.next();
        const secondModal = page.locator('ion-modal[data-testid="modal-2"]');
        await expect(secondModal).toBeVisible();

        await page.click('ion-modal[data-testid="modal-2"] ion-button.dismiss-default');
        await ionModalDidDismiss.next();
        await secondModal.waitFor({ state: 'detached' });

        await expect(firstModal).toBeVisible();
        await expect(secondModal).toBeHidden();
      });
    });

    test.describe(title('modal: dismiss by id'), () => {
      test('should dismiss the last presented modal when the dismiss by id button is clicked', async ({ page }) => {
        await page.goto('/src/components/modal/test/dismiss-behavior', config);

        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
        const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

        await page.click('#present-first-modal');
        await ionModalDidPresent.next();
        const firstModal = page.locator('ion-modal[data-testid="modal-1"]');
        await expect(firstModal).toBeVisible();

        await page.click('#present-next-modal');
        await ionModalDidPresent.next();
        const secondModal = page.locator('ion-modal[data-testid="modal-2"]');
        await expect(secondModal).toBeVisible();

        await page.click('ion-modal[data-testid="modal-2"] ion-button.dismiss-by-id');
        await ionModalDidDismiss.next();
        await secondModal.waitFor({ state: 'detached' });

        await expect(firstModal).toBeVisible();
        await expect(secondModal).toBeHidden();
      });
    });
  });
});
