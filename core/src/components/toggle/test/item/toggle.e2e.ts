import { expect } from '@playwright/test';
import { applyKeyboardFocus, configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: item'), () => {
    test('should render correctly in list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-toggle>Enable Notifications</ion-toggle>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`toggle-list`));
    });
    test('should render correctly in inset list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-toggle>Enable Notifications</ion-toggle>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`toggle-inset-list`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: item color contrast'), () => {
    test('label should have correct contrast when used in an item', async ({ page }) => {
      await page.setContent(
        `
        <ion-item color="primary">
          <ion-toggle>Enable Notifications</ion-toggle>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      await expect(item).toHaveScreenshot(screenshot(`toggle-item-color`));
    });
  });
});

configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: long label in item'), () => {
    test('should not have visual regressions when using long label in item', async ({ page }) => {
      await page.setContent(
        `
          <ion-list>
            <ion-item>
              <ion-toggle justify="start">
                <ion-label class="ion-text-wrap">Enable Notifications Enable Notifications Enable Notifications</ion-label>
              </ion-toggle>
            </ion-item>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`toggle-long-label-in-item`));
    });
  });

  test.describe(title('toggle: end label in item'), () => {
    test('should not have visual regressions when using end label in item', async ({ page }) => {
      await page.setContent(
        `
          <ion-list>
            <ion-radio-group>
              <ion-item>
                <ion-toggle label-placement="end">Enable Notifications</ion-toggle>
              </ion-item>
            </ion-radio-group>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`toggle-end-label-in-item`));
    });
  });

  test.describe(title('toggle: stacked label in item'), () => {
    test('should not have visual regressions when using stacked label in item', async ({ page }) => {
      await page.setContent(
        `
          <ion-list>
            <ion-radio-group>
              <ion-item>
                <ion-toggle label-placement="stacked">Enable Notifications</ion-toggle>
              </ion-item>
            </ion-radio-group>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`toggle-stacked-label-in-item`));
    });
  });
});

/**
 * The focus indicator differs between iOS and MD, so these run in both modes.
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: focus in item'), () => {
    test('should render focus indicator in an item', async ({ page }) => {
      // The item gets `ion-focused` too, which is what suppresses the toggle's indicator.
      await page.setContent(
        `
        <ion-app>
          <ion-item>
            <ion-toggle>Unchecked</ion-toggle>
          </ion-item>
        </ion-app>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');

      await applyKeyboardFocus(page, toggle);

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`toggle-in-item-focus`));
    });

    test('should render focus indicator for a checked toggle with a color in an item', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-item>
            <ion-toggle color="danger" checked>Checked</ion-toggle>
          </ion-item>
        </ion-app>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');

      await applyKeyboardFocus(page, toggle);

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`toggle-color-checked-in-item-focus`));
    });

    test('should render focus indicator for a toggle in a clickable item', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-item button>
            <ion-toggle>Unchecked</ion-toggle>
          </ion-item>
        </ion-app>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');

      await applyKeyboardFocus(page, toggle);

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`toggle-in-clickable-item-focus`));
    });

    test('should render focus indicator for a toggle in a multi-input item', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <ion-item>
            <ion-toggle justify="start">Toggle 1</ion-toggle>
            <ion-toggle justify="start">Toggle 2</ion-toggle>
          </ion-item>
        </ion-app>
      `,
        config
      );

      const item = page.locator('ion-item');

      // The item adds this after its controls render, and the toggles re-render off
      // it, so waiting avoids capturing the pre-settle state.
      await expect(item).toHaveClass(/item-multiple-inputs/);

      const toggle = page.locator('ion-toggle').first();

      await applyKeyboardFocus(page, toggle);

      await expect(item).toHaveScreenshot(screenshot(`toggle-multiple-in-item-focus`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('toggle: item functionality'), () => {
    test('clicking padded space within item should click the toggle', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27169',
      });

      await page.setContent(
        `
        <ion-item>
          <ion-toggle>Size</ion-toggle>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      const ionChange = await page.spyOnEvent('ionChange');

      /**
       * Clicks the padded space within the item.
       *
       * We intentionally activate the toggle control when clicking either
       * the label or padded space. This is different than native iOS,
       * but we do it for three reasons:
       * 1. Clicking a label connected to a control is standard behavior for web controls.
       * 2. iOS is inconsistent in their implementation and other controls can be activated by clicking the label.
       * 3. MD is consistent in their implementation and activates controls by clicking the label.
       */
      await item.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      expect(ionChange).toHaveReceivedEvent();
    });

    test('clicking padded space within item should fire one click event', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29758',
      });

      await page.setContent(
        `
        <ion-item>
          <ion-toggle>
            Toggle
          </ion-toggle>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');
      const onClick = await page.spyOnEvent('click');

      // Click the padding area (5px from left edge)
      await item.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      expect(onClick).toHaveReceivedEventTimes(1);

      // Verify that the event target is the toggle and not the item
      const event = onClick.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-toggle');
    });
  });
});
