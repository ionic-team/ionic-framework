import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('card modal - animations'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-button id="open-modal">Open Modal</ion-button>

        <ion-modal trigger="open-modal"></ion-modal>
      `,
        config
      );
    });
    test('should have animations and then clean them up', async ({ page }) => {
      page.locator('#open-modal').click();

      await page.waitForChanges();

      const modal = page.locator('ion-modal');

      let animations = await page.evaluate(() => {
        return document.querySelector('ion-modal')!.shadowRoot!.getAnimations();
      });

      // While the modal is open, it should have animations
      await expect(animations.length).toBeGreaterThan(0);

      await modal.evaluate(async (el: HTMLIonModalElement) => {
        await el.dismiss();
      });

      animations = await page.evaluate(() => {
        return document.querySelector('ion-modal')!.shadowRoot!.getAnimations();
      });

      // Once the modal has finished closing, there should be no animations
      await expect(animations.length).toBe(0);
    });
  });
});
