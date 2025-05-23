import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: item with list'), () => {
    test('should render correctly in list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-checkbox>Enable Notifications</ion-checkbox>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`checkbox-list`));
    });
    test('should render correctly in inset list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-checkbox>Enable Notifications</ion-checkbox>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`checkbox-inset-list`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: label in item'), () => {
    test('label should have correct contrast when used in an item', async ({ page }) => {
      await page.setContent(
        `
        <ion-item color="primary">
          <ion-checkbox>Enable Notifications</ion-checkbox>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      await expect(item).toHaveScreenshot(screenshot(`checkbox-item-color`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: long label in item'), () => {
    test('should not have visual regressions when using long label in item', async ({ page }) => {
      await page.setContent(
        `
          <ion-list>
            <ion-item>
              <ion-checkbox justify="start">
                <ion-label class="ion-text-wrap">Enable Notifications Enable Notifications Enable Notifications</ion-label>
              </ion-checkbox>
            </ion-item>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`checkbox-long-label-in-item`));
    });
    test('should not have visual regressions when using long label in item with start alignment', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29837',
      });
      await page.setContent(
        `
          <ion-list>
            <ion-item>
              <ion-checkbox justify="start" alignment="start">
                <ion-label class="ion-text-wrap">Enable Notifications Enable Notifications Enable Notifications</ion-label>
              </ion-checkbox>
            </ion-item>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`checkbox-long-label-in-item-align-start`));
    });
  });

  test.describe(title('checkbox: end label in item'), () => {
    test('should not have visual regressions when using end label in item', async ({ page }) => {
      await page.setContent(
        `
          <ion-list>
            <ion-item>
              <ion-checkbox label-placement="end">Enable Notifications</ion-checkbox>
            </ion-item>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`checkbox-end-label-in-item`));
    });
  });

  test.describe(title('checkbox: stacked label in item'), () => {
    test('should not have visual regressions when using stacked label in item', async ({ page }) => {
      await page.setContent(
        `
          <ion-list>
            <ion-item>
              <ion-checkbox label-placement="stacked">Enable Notifications</ion-checkbox>
            </ion-item>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`checkbox-stacked-label-in-item`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('checkbox: item functionality'), () => {
    test('clicking padded space within item should click the checkbox', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27169',
      });

      await page.setContent(
        `
        <ion-item>
          <ion-checkbox>Size</ion-checkbox>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      const ionChange = await page.spyOnEvent('ionChange');

      // Clicks the padded space within the item
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
          <ion-checkbox>
            Checkbox
          </ion-checkbox>
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

      // Verify that the event target is the checkbox and not the item
      const event = onClick.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-checkbox');
    });
  });
});
