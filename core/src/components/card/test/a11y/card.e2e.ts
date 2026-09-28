import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('card: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Card Title</ion-card-title>
            <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a week
            in the woods. Wash your spirit clean.
          </ion-card-content>
        </ion-card>
      `,
        config
      );

      const card = page.locator('ion-card');

      await expect(card).toHaveScreenshot(screenshot(`card-scale`));
    });
  });
});

/**
 * Attribute syncing does not vary across modes or directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('card: aria attribute sync'), () => {
    test('should sync aria-label to the native element when it changes on the host', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30626',
      });

      await page.setContent(`<ion-card button="true" aria-label="label">Card</ion-card>`, config);

      const host = page.locator('ion-card');
      const nativeCard = host.locator('[part="native"]');

      await expect(nativeCard).toHaveAttribute('aria-label', 'label');

      await host.evaluate((el) => el.setAttribute('aria-label', 'updated'));

      await expect(nativeCard).toHaveAttribute('aria-label', 'updated');
    });

    test('should keep syncing after the card is detached and reattached', async ({ page }) => {
      await page.setContent(
        `
          <div id="container">
            <ion-card button="true" aria-label="label">Card</ion-card>
          </div>
        `,
        config
      );

      const host = page.locator('ion-card');
      const nativeCard = host.locator('[part="native"]');

      await expect(nativeCard).toHaveAttribute('aria-label', 'label');

      await host.evaluate((el) => {
        const parent = el.parentElement!;
        parent.removeChild(el);
        parent.appendChild(el);
      });
      await page.waitForChanges();

      // The value captured at load survives the move.
      await expect(nativeCard).toHaveAttribute('aria-label', 'label');

      // Updates made after the move must still reach the native element.
      await host.evaluate((el) => el.setAttribute('aria-label', 'updated'));
      await expect(nativeCard).toHaveAttribute('aria-label', 'updated');

      // So must one made while it was detached, when nothing is watching.
      await host.evaluate((el) => {
        const parent = el.parentElement!;
        parent.removeChild(el);
        el.setAttribute('aria-label', 'while detached');
        parent.appendChild(el);
      });
      await expect(nativeCard).toHaveAttribute('aria-label', 'while detached');
    });

    test('should sync updates, empty values and removals after the initial copy', async ({ page }) => {
      await page.setContent(`<ion-card button="true" aria-label="initial">Card</ion-card>`, config);

      const host = page.locator('ion-card');
      const nativeCard = host.locator('[part="native"]');

      // The initial copy moves the value from the host to the native element.
      await expect(host).not.toHaveAttribute('aria-label');
      await expect(nativeCard).toHaveAttribute('aria-label', 'initial');

      // Post-load writes stay on the host and are copied to the native element.
      await host.evaluate((el) => el.setAttribute('aria-label', 'second'));
      await expect(host).toHaveAttribute('aria-label', 'second');
      await expect(nativeCard).toHaveAttribute('aria-label', 'second');

      // An empty string is a valid ARIA attribute value.
      await host.evaluate((el) => el.setAttribute('aria-label', ''));
      await expect(nativeCard).toHaveAttribute('aria-label', '');

      // A removal of a post-load write does reach the native element.
      await host.evaluate((el) => el.removeAttribute('aria-label'));
      await expect(host).not.toHaveAttribute('aria-label');
      await expect(nativeCard).not.toHaveAttribute('aria-label');
    });

    test('should apply aria-label to the native element when the card becomes clickable', async ({ page }) => {
      await page.setContent(`<ion-card aria-label="label">Card</ion-card>`, config);

      const host = page.locator('ion-card');
      await page.waitForChanges();

      // A card that is neither a button nor a link renders no native element.
      await expect(host.locator('[part="native"]')).toHaveCount(0);

      // Both `button` and `href` can be set after load, and the native element that
      // appears then still needs the label copied at load.
      await host.evaluate((el: HTMLIonCardElement) => (el.button = true));

      await expect(host.locator('[part="native"]')).toHaveAttribute('aria-label', 'label');
    });

    test('should not sync ARIA attributes other than aria-label', async ({ page }) => {
      await page.setContent(`<ion-card button="true" aria-label="label">Card</ion-card>`, config);

      const host = page.locator('ion-card');
      const nativeCard = host.locator('[part="native"]');

      /**
       * Only `aria-label` should reach the native element. A wider watch set would put
       * attributes there after load that the element never gets at load.
       */
      await host.evaluate((el) => {
        el.setAttribute('role', 'presentation');
        el.setAttribute('aria-describedby', 'hint');
        // Written in the same batch as a barrier, since once it lands the sync has run.
        el.setAttribute('aria-label', 'updated');
      });

      await expect(nativeCard).toHaveAttribute('aria-label', 'updated');
      await expect(nativeCard).not.toHaveAttribute('aria-describedby');
      await expect(nativeCard).not.toHaveAttribute('role');
    });
  });
});
