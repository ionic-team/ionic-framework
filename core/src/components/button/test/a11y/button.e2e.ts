import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('button: a11y for ion-color()'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-button>Default</ion-button>
        <ion-button fill="solid">Solid</ion-button>
        <ion-button fill="outline">Outline</ion-button>
        <ion-button fill="clear">Clear</ion-button>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('focused state should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-button class="ion-focused" fill="solid">Solid</ion-button>
        <ion-button class="ion-focused" fill="outline">Outline</ion-button>
        <ion-button class="ion-focused" fill="clear">Clear</ion-button>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('button in toolbar should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-toolbar>
          <ion-button fill="outline" class="ion-activated">Start</ion-button>
        </ion-toolbar>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

/**
 * Only ios mode uses ion-color() for the activated button state
 */
configs({ directions: ['ltr'], modes: ['ios'], palettes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('button: ios contrast'), () => {
    test('activated state should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <ion-button class="ion-activated" fill="solid">Solid</ion-button>
        <ion-button class="ion-activated" fill="outline">Outline</ion-button>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: font scaling'), () => {
    test('should scale default button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button>Default</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-default-scale`));
    });

    test('should scale clear button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button fill="clear">Clear</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-clear-scale`));
    });

    test('should scale small button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button size="small">Small</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-small-scale`));
    });

    test('should scale large button text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-button size="large">Large</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-large-scale`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('button: aria attribute sync'), () => {
    const watchedAriaAttributes = ['aria-checked', 'aria-label', 'aria-pressed', 'aria-description'];

    for (const attr of watchedAriaAttributes) {
      test(`native button updates ${attr} when host attribute changes`, async ({ page }) => {
        test.info().annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/30626',
        });

        await page.setContent(`<ion-button ${attr}="initial">Button</ion-button>`, config);

        const host = page.locator('ion-button');
        const nativeButton = host.locator('button');

        await expect(nativeButton).toHaveAttribute(attr, 'initial');

        await host.evaluate((el, attr) => el.setAttribute(attr, 'updated'), attr);

        await expect(nativeButton).toHaveAttribute(attr, 'updated');
      });
    }

    test('should not sync aria-disabled from the host', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30626',
      });

      await page.setContent(`<ion-button aria-disabled="true">Button</ion-button>`, config);

      const host = page.locator('ion-button');
      const nativeButton = host.locator('button');

      // Initial inheritance moves the developer-provided value to native.
      // The host's aria-disabled is subsequently owned by the disabled prop.
      await expect(host).not.toHaveAttribute('aria-disabled');
      await expect(nativeButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('preserves inherited aria-label after detach and reattach', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30626',
      });

      await page.setContent(
        `
          <div id="container">
            <ion-button aria-label="label">Button</ion-button>
          </div>
        `,
        config
      );

      const host = page.locator('ion-button');
      const nativeButton = host.locator('button');

      await expect(nativeButton).toHaveAttribute('aria-label', 'label');

      // Detach, reattach, and force a render via a prop change.
      await host.evaluate((el) => {
        const parent = el.parentElement!;
        parent.removeChild(el);
        parent.appendChild(el);
        (el as HTMLIonButtonElement).color = 'primary';
      });

      // Assert the original value survived
      await expect(nativeButton).toHaveAttribute('aria-label', 'label');
    });

    test('syncs aria-label updates and removal after initial inheritance', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30626',
      });

      await page.setContent(
        `
          <ion-button aria-label="initial">Button</ion-button>
        `,
        config
      );

      const host = page.locator('ion-button');
      const nativeButton = host.locator('button');

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
