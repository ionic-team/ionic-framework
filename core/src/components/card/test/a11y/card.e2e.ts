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

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('card: aria attribute sync'), () => {
    test('aria sync survives detach and reattach', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30626',
      });

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

      // Detach and reattach
      await host.evaluate((cardEl) => {
        const parent = cardEl.parentElement!;
        parent.removeChild(cardEl);
        parent.appendChild(cardEl);
      });

      await host.evaluate((el) => el.setAttribute('aria-label', 'updated'));
      await expect(nativeCard).toHaveAttribute('aria-label', 'updated');
    });

    test('helper strips host attribute and syncs native element through set, empty, and remove', async ({ page }) => {
      page.on('console', (msg) => {
        console.log(`[browser] ${msg.type()}: ${msg.text()}`);
      });

      await page.setContent(
        `
          <ion-card button="true" aria-label="initial">Button</ion-button>
        `,
        config
      );

      const host = page.locator('ion-card');
      const nativeButton = host.locator('[part="native"]');

      // Initial load: inheritAriaAttributes should have stripped aria-label
      // from the host and copied it onto the native element.
      await expect(host).not.toHaveAttribute('aria-label');
      await expect(nativeButton).toHaveAttribute('aria-label', 'initial');

      // Setting a new value on the host: watcher should capture it, sync it
      // to native, and re-strip it from the host.
      await host.evaluate((el) => el.setAttribute('aria-label', 'second'));
      await expect(host).not.toHaveAttribute('aria-label');
      await expect(nativeButton).toHaveAttribute('aria-label', 'second');

      // Setting to empty string: empty string is a valid, non-null value.
      await host.evaluate((el) => el.setAttribute('aria-label', ''));
      await expect(host).not.toHaveAttribute('aria-label');
      await expect(nativeButton).toHaveAttribute('aria-label', '');

      // Removing the attribute directly: the patched removeAttribute should
      // fire onChange with null, which should remove aria-label from native
      // and host.
      await host.evaluate((el) => el.removeAttribute('aria-label'));
      await expect(host).not.toHaveAttribute('aria-label');
      await expect(nativeButton).not.toHaveAttribute('aria-label');
    });
  });
});
