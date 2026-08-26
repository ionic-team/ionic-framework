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
  test.describe(title('item: aria attribute sync'), () => {
    test('native element updates aria-label when host attribute changes', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30626',
      });

      await page.setContent(
        `
        <ion-card button="true" aria-label="label">Card</ion-card>
      `,
        config
      );

      const host = page.locator('ion-card');
      const nativeItem = host.locator('[part="native"]');

      await expect(nativeItem).toHaveAttribute('aria-label', 'label');

      await host.evaluate((el) => el.setAttribute('aria-label', 'updated'));

      await expect(nativeItem).toHaveAttribute('aria-label', 'updated');
    });

    test('preserves inherited aria-label after detach and reattach', async ({ page }) => {
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
      const nativeItem = host.locator('[part="native"]');

      await expect(nativeItem).toHaveAttribute('aria-label', 'label');

      // Detach, reattach, and force a render via a prop change.
      await host.evaluate((itemEl) => {
        const parent = itemEl.parentElement!;
        parent.removeChild(itemEl);
        parent.appendChild(itemEl);
        (itemEl as HTMLIonButtonElement).color = 'primary';
      });

      // Assert the original value survived
      await expect(nativeItem).toHaveAttribute('aria-label', 'label');
    });

    test('syncs aria-label updates and removal after initial inheritance', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30626',
      });
      await page.setContent(
        `
          <ion-card button="true" aria-label="initial">Card</ion-card>
        `,
        config
      );

      const host = page.locator('ion-card');
      const nativeButton = host.locator('[part="native"]');

      // Initial inheritance moves the value from the host to the native button.
      await expect(host).not.toHaveAttribute('aria-label');
      await expect(nativeButton).toHaveAttribute('aria-label', 'initial');

      // Post-load writes remain on the host and are synchronized to native
      await host.evaluate((el) => el.setAttribute('aria-label', 'second'));
      await expect(host).toHaveAttribute('aria-label');
      await expect(nativeButton).toHaveAttribute('aria-label', 'second');

      // An empty string is a valid ARIA attribute value and remains synchronized.
      await host.evaluate((el) => el.setAttribute('aria-label', ''));
      await expect(host).toHaveAttribute('aria-label');
      await expect(nativeButton).toHaveAttribute('aria-label', '');

      // Native MutationObserver behavior sees a real removal after a post-load write.
      await host.evaluate((el) => el.removeAttribute('aria-label'));
      await expect(host).not.toHaveAttribute('aria-label');
      await expect(nativeButton).not.toHaveAttribute('aria-label');
    });
  });
});
