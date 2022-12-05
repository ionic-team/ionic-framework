import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('modal: inline', () => {
    test(title('it should present and then remain in the dom on dismiss'), async ({ page }) => {
      await page.goto('/src/components/modal/test/inline', config);
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#open-inline-modal');

      await ionModalDidPresent.next();

      expect(await page.screenshot()).toMatchSnapshot(`modal-inline-present-${page.getSnapshotSettings()}.png`);

      const modal = await page.locator('ion-modal');
      await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      await ionModalDidDismiss.next();
      await page.waitForSelector('ion-modal', { state: 'hidden' });

      expect(await page.screenshot()).toMatchSnapshot(`modal-inline-dismiss-${page.getSnapshotSettings()}.png`);
    });

    test(
      title('presenting should create a single root element with the ion-page class'),
      async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/26117',
        });

        await page.setContent(
          `
      <ion-datetime-button datetime="datetime"></ion-datetime-button>

      <ion-modal>
        <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
      </ion-modal>
      `,
          config
        );

        const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
        const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
        const modal = page.locator('ion-modal');

        await page.locator('#date-button').click();
        await ionModalDidPresent.next();

        // Verifies that the host element exists with the .ion-page class
        expect(await modal.evaluate((el: HTMLIonModalElement) => el.firstElementChild!.className)).toContain(
          'ion-page'
        );

        await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
        await ionModalDidDismiss.next();

        await page.locator('#date-button').click();
        await ionModalDidPresent.next();

        // Verifies that presenting the overlay again does not create a new host element
        expect(await modal.evaluate((el: HTMLIonModalElement) => el.firstElementChild!.className)).toContain(
          'ion-page'
        );
        expect(
          await modal.evaluate((el: HTMLIonModalElement) => el.firstElementChild!.firstElementChild!.className)
        ).not.toContain('ion-page');
      }
    );
  });
});
