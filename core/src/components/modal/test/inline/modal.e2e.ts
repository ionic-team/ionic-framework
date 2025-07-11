import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('modal: inline'), () => {
    test('it should present and then remain in the dom on dismiss', async ({ page }) => {
      await page.goto('/src/components/modal/test/inline', config);
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const modal = page.locator('ion-modal').first();

      await page.click('#open-inline-modal');

      await ionModalDidPresent.next();

      await expect(modal).toBeVisible();

      await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      await ionModalDidDismiss.next();

      await expect(modal).toBeHidden();
    });

    test('it should dismiss child modals when parent modal is dismissed', async ({ page }) => {
      await page.goto('/src/components/modal/test/inline', config);
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      const parentModal = page.locator('ion-modal').first();
      const childModal = page.locator('#child-modal');

      // Open the parent modal
      await page.click('#open-inline-modal');
      await ionModalDidPresent.next();
      await expect(parentModal).toBeVisible();

      // Open the child modal
      await page.click('#open-child-modal');
      await ionModalDidPresent.next();
      await expect(childModal).toBeVisible();

      // Both modals should be visible
      await expect(parentModal).toBeVisible();
      await expect(childModal).toBeVisible();

      // Dismiss the parent modal
      await page.click('#dismiss-parent');

      // Wait for both modals to be dismissed
      await ionModalDidDismiss.next(); // child modal dismissed
      await ionModalDidDismiss.next(); // parent modal dismissed

      // Both modals should be hidden
      await expect(parentModal).toBeHidden();
      await expect(childModal).toBeHidden();
    });

    test('it should only dismiss child modal when child dismiss button is clicked', async ({ page }) => {
      await page.goto('/src/components/modal/test/inline', config);
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      const parentModal = page.locator('ion-modal').first();
      const childModal = page.locator('#child-modal');

      // Open the parent modal
      await page.click('#open-inline-modal');
      await ionModalDidPresent.next();
      await expect(parentModal).toBeVisible();

      // Open the child modal
      await page.click('#open-child-modal');
      await ionModalDidPresent.next();
      await expect(childModal).toBeVisible();

      // Dismiss only the child modal
      await page.click('#dismiss-child');
      await ionModalDidDismiss.next();

      // Parent modal should still be visible, child modal should be hidden
      await expect(parentModal).toBeVisible();
      await expect(childModal).toBeHidden();
    });

    test('presenting should create a single root element with the ion-page class', async ({ page }, testInfo) => {
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

      await page.click('#date-button');
      await ionModalDidPresent.next();

      // Verifies that the host element exists with the .ion-page class
      expect(await modal.evaluate((el: HTMLIonModalElement) => el.firstElementChild!.className)).toContain('ion-page');

      await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
      await ionModalDidDismiss.next();

      await page.click('#date-button');
      await ionModalDidPresent.next();

      // Verifies that presenting the overlay again does not create a new host element
      expect(await modal.evaluate((el: HTMLIonModalElement) => el.firstElementChild!.className)).toContain('ion-page');
      expect(
        await modal.evaluate((el: HTMLIonModalElement) => el.firstElementChild!.firstElementChild!.className)
      ).not.toContain('ion-page');
    });
  });
});
