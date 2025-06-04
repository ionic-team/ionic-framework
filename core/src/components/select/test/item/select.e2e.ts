import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: item'), () => {
    test('should render correctly in list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-select
              label="Email"
              value="apple"
            >
              <ion-select-option value="apple">Apple</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`select-list-no-fill`));
    });
    test('should render correctly in inset list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-select
              label="Fruit"
              value="apple"
            >
              <ion-select-option value="apple">Apple</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`select-inset-list-no-fill`));
    });
    test('should render correctly in an item inside of a flex container', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="display: flex">
          <ion-list>
            <ion-item>
              <ion-select label="Fruit" value="apple">
                <ion-select-option value="apple">Apple</ion-select-option>
              </ion-select>
            </ion-item>
          <ion-list>
        </div>
      `,
        config
      );
      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`select-item-flex-container`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: item functionality'), () => {
    test('clicking padded space within item should click the select', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27169',
      });

      await page.setContent(
        `
        <ion-item>
          <ion-select label="Fruit" interface="action-sheet">
            <ion-select-option value="apple">Apple</ion-select-option>
            <ion-select-option value="banana">Banana</ion-select-option>
          </ion-select>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      // Clicks the padded space within the item
      await item.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      await ionActionSheetDidPresent.next();

      expect(ionActionSheetDidPresent).toHaveReceivedEvent();
    });

    test('clicking padded space within item should fire one click event', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29758',
      });

      await page.setContent(
        `
        <ion-item>
          <ion-select
            label="Fruit"
            value="apple"
          >
            <ion-select-option value="apple">Apple</ion-select-option>
          </ion-select>
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

      // Verify that the event target is the select and not the item
      const event = onClick.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-select');
    });
  });
});
