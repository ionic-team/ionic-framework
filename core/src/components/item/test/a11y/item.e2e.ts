import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], palettes: ['dark'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('item: dark palette'), () => {
    /**
     * This test was originally created to ensure the item border has sufficient
     * contrast. We don't use an Axe test here because Axe not warn about color
     * contrast on the item borders.
     */
    test('borders should have sufficient contrast', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29386',
      });
      await page.setContent(
        `
        <ion-list>
          <ion-item>Item</ion-item>
          <ion-item>Item</ion-item>
        </ion-list>
      `,
        config
      );

      const list = page.locator('ion-list');

      await expect(list).toHaveScreenshot(screenshot(`item-dark`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('item: axe'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/item/test/a11y`, config);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    test('should reflect aria-label', async ({ page }) => {
      await page.setContent(
        `
        <ion-item id="item-1" aria-label="test"></ion-item>
        <ion-item id="item-2" aria-label="test" button="true"></ion-item>
      `,
        config
      );

      const item1 = page.locator('#item-1 .item-native');
      const item2 = page.locator('#item-2 .item-native');

      expect(await item1.getAttribute('aria-label')).toEqual('test');
      expect(await item2.getAttribute('aria-label')).toEqual('test');
    });
  });

  test.describe(title('item: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item>
          <ion-label>Item</ion-label>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`item-scale`));
    });
    test('should scale slotted icons on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item>
          <ion-icon slot="start" name="star"></ion-icon>
          <ion-label>Item</ion-label>
          <ion-icon slot="end" name="flag"></ion-icon>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`item-icons-scale`));
    });
    test('should scale detail icon on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item detail="true">
          <ion-label>Item</ion-label>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`item-detail-icon-scale`));
    });
    test('should scale buttons in an item on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-list>
          <ion-item>
            <ion-label>Item</ion-label>
            <ion-button>Default</ion-button>
          </ion-item>
          <ion-item>
            <ion-label>Item</ion-label>
            <ion-button size="small">Small</ion-button>
          </ion-item>
          <ion-item>
            <ion-label>Item</ion-label>
            <ion-button size="large">Large</ion-button>
          </ion-item>
        </ion-list>
      `,
        config
      );

      const list = page.locator('ion-list');

      await expect(list).toHaveScreenshot(screenshot(`item-buttons-scale`));
    });
  });
});

/**
 * Attribute syncing does not vary across modes or directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('item: aria attribute sync'), () => {
    test('should sync aria-label to the native element when it changes on the host', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/30626',
      });

      await page.setContent(`<ion-item button="true" aria-label="label">Item</ion-item>`, config);

      const host = page.locator('ion-item');
      const nativeItem = host.locator('[part="native"]');

      await expect(nativeItem).toHaveAttribute('aria-label', 'label');

      await host.evaluate((el) => el.setAttribute('aria-label', 'updated'));

      await expect(nativeItem).toHaveAttribute('aria-label', 'updated');
    });

    test('should keep syncing after the item is detached and reattached', async ({ page }) => {
      await page.setContent(
        `
          <div id="container">
            <ion-item button="true" aria-label="label">Item</ion-item>
          </div>
        `,
        config
      );

      const host = page.locator('ion-item');
      const nativeItem = host.locator('[part="native"]');

      await expect(nativeItem).toHaveAttribute('aria-label', 'label');

      await host.evaluate((el) => {
        const parent = el.parentElement!;
        parent.removeChild(el);
        parent.appendChild(el);
      });
      await page.waitForChanges();

      // The value captured at load survives the move.
      await expect(nativeItem).toHaveAttribute('aria-label', 'label');

      // Updates made after the move must still reach the native element.
      await host.evaluate((el) => el.setAttribute('aria-label', 'updated'));
      await expect(nativeItem).toHaveAttribute('aria-label', 'updated');

      // So must one made while it was detached, when nothing is watching.
      await host.evaluate((el) => {
        const parent = el.parentElement!;
        parent.removeChild(el);
        el.setAttribute('aria-label', 'while detached');
        parent.appendChild(el);
      });
      await expect(nativeItem).toHaveAttribute('aria-label', 'while detached');
    });

    test('should sync updates, empty values and removals after the initial copy', async ({ page }) => {
      await page.setContent(`<ion-item button="true" aria-label="initial">Item</ion-item>`, config);

      const host = page.locator('ion-item');
      const nativeItem = host.locator('[part="native"]');

      // The initial copy moves the value from the host to the native element.
      await expect(host).not.toHaveAttribute('aria-label');
      await expect(nativeItem).toHaveAttribute('aria-label', 'initial');

      // Post-load writes stay on the host and are copied to the native element.
      await host.evaluate((el) => el.setAttribute('aria-label', 'second'));
      await expect(host).toHaveAttribute('aria-label', 'second');
      await expect(nativeItem).toHaveAttribute('aria-label', 'second');

      // An empty string is a valid ARIA attribute value.
      await host.evaluate((el) => el.setAttribute('aria-label', ''));
      await expect(nativeItem).toHaveAttribute('aria-label', '');

      // A removal of a post-load write does reach the native element.
      await host.evaluate((el) => el.removeAttribute('aria-label'));
      await expect(host).not.toHaveAttribute('aria-label');
      await expect(nativeItem).not.toHaveAttribute('aria-label');
    });

    test('should not sync ARIA attributes other than aria-label', async ({ page }) => {
      await page.setContent(`<ion-item button="true" aria-label="label">Item</ion-item>`, config);

      const host = page.locator('ion-item');
      const nativeItem = host.locator('[part="native"]');

      /**
       * Only `aria-label` should reach the native element. An `ion-item` in a list renders
       * `role="listitem"` on its own Host, so watching `role` would copy that onto the
       * native button.
       */
      await host.evaluate((el) => {
        el.setAttribute('role', 'presentation');
        el.setAttribute('aria-describedby', 'hint');
        // Written in the same batch as a barrier, since once it lands the sync has run.
        el.setAttribute('aria-label', 'updated');
      });

      await expect(nativeItem).toHaveAttribute('aria-label', 'updated');
      await expect(nativeItem).not.toHaveAttribute('aria-describedby');
      await expect(nativeItem).not.toHaveAttribute('role');
    });
  });
});
