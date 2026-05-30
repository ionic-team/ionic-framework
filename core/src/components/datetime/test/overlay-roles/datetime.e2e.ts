import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('datetime: overlay roles'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
          <ion-modal>
            <ion-datetime></ion-datetime>
          </ion-modal>  
        `,
        config
      );
    });
    test('should pass role to overlay when calling confirm method', async ({ page }) => {
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const modal = page.locator('ion-modal');
      const datetime = page.locator('ion-datetime');

      await modal.evaluate((el: HTMLIonModalElement) => el.present());

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.confirm(true));

      await ionModalDidDismiss.next();
      expect(ionModalDidDismiss).toHaveReceivedEventDetail({ data: undefined, role: 'datetime-confirm' });
    });
    test('should pass role to overlay when calling cancel method', async ({ page }) => {
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const modal = page.locator('ion-modal');
      const datetime = page.locator('ion-datetime');

      await modal.evaluate((el: HTMLIonModalElement) => el.present());

      await datetime.evaluate((el: HTMLIonDatetimeElement) => el.cancel(true));

      await ionModalDidDismiss.next();
      expect(ionModalDidDismiss).toHaveReceivedEventDetail({ data: undefined, role: 'datetime-cancel' });
    });
  });
});
