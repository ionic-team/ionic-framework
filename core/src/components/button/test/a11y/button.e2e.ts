import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { ariaAttributes } from '@utils/helpers';
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
    // aria-disabled is excluded because button.tsx manages it internally via the `disabled` prop.
    const watchedAriaAttributes = ariaAttributes.filter((attr) => attr !== 'aria-disabled');

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

    test('does not sync aria-disabled, since button.tsx manages it internally', async ({ page }) => {
      test
        .info()
        .annotations.push({ type: 'issue', description: 'https://github.com/ionic-team/ionic-framework/issues/30626' });

      await page.setContent(`<ion-button aria-disabled="true">Button</ion-button>`, config);

      const host = page.locator('ion-button');
      const nativeButton = host.locator('button');

      await expect(nativeButton).not.toHaveAttribute('aria-disabled', 'true');
    });

    test('aria sync survives detach and reattach', async ({ page }) => {
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

      // Detach and reattach
      await host.evaluate((buttonEl) => {
        const parent = buttonEl.parentElement!;
        parent.removeChild(buttonEl);
        parent.appendChild(buttonEl);
      });

      await host.evaluate((el) => el.setAttribute('aria-label', 'updated'));
      await expect(nativeButton).toHaveAttribute('aria-label', 'updated');
    });

    test('helper strips host attribute and syncs native element through set, empty, and remove', async ({ page }) => {
      page.on('console', (msg) => {
        console.log(`[browser] ${msg.type()}: ${msg.text()}`);
      });

      await page.setContent(
        `
          <ion-button aria-label="initial">Button</ion-button>
        `,
        config
      );

      const host = page.locator('ion-button');
      const nativeButton = host.locator('button');

      // Initial load: inheritAriaAttributes should have stripped aria-label
      // from the host and copied it onto the native button.
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
