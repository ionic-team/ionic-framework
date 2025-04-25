import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('textarea: item'), () => {
    test('should render correctly in list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-textarea
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter your email"
              maxlength="20"
              counter="true"
            ></ion-textarea>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`textarea-list-no-fill`));
    });
    test('should render correctly in inset list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-textarea
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter your email"
              maxlength="20"
              counter="true"
            ></ion-textarea>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`textarea-inset-list-no-fill`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('textarea: item functionality'), () => {
    test('clicking padded space within item should focus the textarea', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/21982',
      });

      await page.setContent(
        `
        <ion-item>
          <ion-textarea label="Textarea"></ion-textarea>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      const textarea = page.locator('ion-textarea textarea');

      // Clicks the padded space within the item
      await item.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      await expect(textarea).toBeFocused();
    });

    test('clicking padded space within item should fire one click event', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29761',
      });

      await page.setContent(
        `
       <ion-item>
          <ion-textarea label="Textarea"></ion-textarea>
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

      // Verify that the event target is the input and not the item
      const event = onClick.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-textarea');
    });

    test('clicking native textarea within item should fire click event with target as ion-textarea', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-textarea label="Textarea"></ion-textarea>
        </ion-item>
      `,
        config
      );

      const nativeTextarea = page.locator('.native-textarea');
      const onClick = await page.spyOnEvent('click');

      await nativeTextarea.click();
      expect(onClick).toHaveReceivedEventTimes(1);

      // Verify that the event target is the ion-textarea and not the native textarea
      const event = onClick.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-textarea');
    });
  });
});
