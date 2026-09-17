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

/**
 * Attribute syncing does not vary across modes or directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('button: aria attribute sync'), () => {
    /**
     * A sample rather than the full ARIA list, since they all go through the same
     * membership check and looping every one of them only multiplies the run time.
     */
    const ariaAttributes = ['aria-checked', 'aria-label', 'aria-pressed', 'aria-description'];

    for (const attr of ariaAttributes) {
      test(`should sync ${attr} to the native button when it changes on the host`, async ({ page }) => {
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
      await page.setContent(`<ion-button aria-disabled="true">Button</ion-button>`, config);

      const host = page.locator('ion-button');
      const nativeButton = host.locator('button');

      // The developer-provided value is still copied to the native button at load.
      await expect(nativeButton).toHaveAttribute('aria-disabled', 'true');

      // The host's `aria-disabled` belongs to the `disabled` prop from here on, so later
      // writes to it must not reach the native button. We write `aria-label` in the same
      // batch as a barrier, since once that lands the sync has run.
      await host.evaluate((el) => {
        el.setAttribute('aria-disabled', 'false');
        el.setAttribute('aria-label', 'barrier');
      });
      await expect(nativeButton).toHaveAttribute('aria-label', 'barrier');
      await expect(nativeButton).toHaveAttribute('aria-disabled', 'true');

      // Toggling disabled makes the component write and then clear aria-disabled on the
      // host. Neither write should reach the native button.
      await host.evaluate((el: HTMLIonButtonElement) => {
        el.disabled = true;
        el.setAttribute('aria-label', 'disabled');
      });
      await expect(nativeButton).toHaveAttribute('aria-label', 'disabled');
      await expect(nativeButton).toHaveAttribute('aria-disabled', 'true');

      await host.evaluate((el: HTMLIonButtonElement) => {
        el.disabled = false;
        el.setAttribute('aria-label', 'enabled');
      });
      await expect(nativeButton).toHaveAttribute('aria-label', 'enabled');
      await expect(nativeButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('should not sync role from the host', async ({ page }) => {
      await page.setContent(`<ion-button role="switch">Button</ion-button>`, config);

      const host = page.locator('ion-button');
      const nativeButton = host.locator('button');

      // The initial copy moves role onto the native button, as it always has.
      await expect(nativeButton).toHaveAttribute('role', 'switch');

      // A later write is only read, so it stays on the host. Copying it as well would put
      // the same role on both elements, and two of that role in the accessibility tree.
      await host.evaluate((el) => {
        el.setAttribute('role', 'checkbox');
        el.setAttribute('aria-label', 'barrier');
      });
      await expect(nativeButton).toHaveAttribute('aria-label', 'barrier');
      await expect(nativeButton).toHaveAttribute('role', 'switch');
    });

    test('should keep syncing after the button is detached and reattached', async ({ page }) => {
      await page.setContent(
        `
          <div id="container">
            <ion-button aria-description="described">Button</ion-button>
          </div>
        `,
        config
      );

      const host = page.locator('ion-button');
      const nativeButton = host.locator('button');

      await expect(nativeButton).toHaveAttribute('aria-description', 'described');

      await host.evaluate((el) => {
        const parent = el.parentElement!;
        parent.removeChild(el);
        parent.appendChild(el);
      });
      await page.waitForChanges();

      // The value captured at load survives the move.
      await expect(nativeButton).toHaveAttribute('aria-description', 'described');

      // Updates made after the move must still reach the native button.
      await host.evaluate((el) => el.setAttribute('aria-description', 'updated'));
      await expect(nativeButton).toHaveAttribute('aria-description', 'updated');

      // So must one made while it was detached, when nothing is watching.
      await host.evaluate((el) => {
        const parent = el.parentElement!;
        parent.removeChild(el);
        el.setAttribute('aria-description', 'while detached');
        parent.appendChild(el);
      });
      await expect(nativeButton).toHaveAttribute('aria-description', 'while detached');
    });

    test('should sync updates, empty values and removals after the initial copy', async ({ page }) => {
      await page.setContent(`<ion-button aria-description="initial">Button</ion-button>`, config);

      const host = page.locator('ion-button');
      const nativeButton = host.locator('button');

      // The initial copy moves the value from the host to the native button.
      await expect(host).not.toHaveAttribute('aria-description');
      await expect(nativeButton).toHaveAttribute('aria-description', 'initial');

      // Post-load writes stay on the host and are copied to the native button.
      await host.evaluate((el) => el.setAttribute('aria-description', 'second'));
      await expect(host).toHaveAttribute('aria-description', 'second');
      await expect(nativeButton).toHaveAttribute('aria-description', 'second');

      // An empty string is a valid ARIA attribute value.
      await host.evaluate((el) => el.setAttribute('aria-description', ''));
      await expect(nativeButton).toHaveAttribute('aria-description', '');

      // A removal of a post-load write does reach the native button.
      await host.evaluate((el) => el.removeAttribute('aria-description'));
      await expect(host).not.toHaveAttribute('aria-description');
      await expect(nativeButton).not.toHaveAttribute('aria-description');
    });

    test('should keep a value from the initial markup when the host attribute is removed', async ({ page }) => {
      await page.setContent(`<ion-button aria-label="initial">Button</ion-button>`, config);

      const host = page.locator('ion-button');
      const nativeButton = host.locator('button');

      await expect(nativeButton).toHaveAttribute('aria-label', 'initial');

      // The initial copy already took the attribute off the host, so removing it there
      // changes nothing and the native button keeps the copied value. Setting an empty
      // value is how you clear one of these.
      await host.evaluate((el) => el.removeAttribute('aria-label'));

      // Force a render and wait for it, otherwise the assertion passes on a button that
      // never re-rendered at all.
      await host.evaluate((el: HTMLIonButtonElement) => (el.color = 'primary'));
      await expect(host).toHaveClass(/ion-color-primary/);

      await expect(nativeButton).toHaveAttribute('aria-label', 'initial');
    });
  });
});
