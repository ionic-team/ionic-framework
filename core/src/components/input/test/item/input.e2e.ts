import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('input: item'), () => {
    test('should render correctly in list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-input
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter your email"
              maxlength="20"
              counter="true"
            ></ion-input>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`input-list-no-fill`));
    });
    test('should render correctly in inset list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-input
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter your email"
              maxlength="20"
              counter="true"
            ></ion-input>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`input-inset-list-no-fill`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: item functionality'), () => {
    test('clicking padded space within item should focus the input', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/21982',
      });

      await page.setContent(
        `
        <ion-item>
          <ion-input label="Input"></ion-input>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');
      const input = page.locator('ion-input input');

      // Clicks the padded space within the item
      await item.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      await expect(input).toBeFocused();
    });

    test('clicking padded space within item should fire one click event', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29761',
      });

      await page.setContent(
        `
        <ion-item>
          <ion-input label="Input"></ion-input>
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
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-input');
    });

    test('clicking native wrapper should fire one click event', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-input label="Input"></ion-input>
        </ion-item>
      `,
        config
      );

      const nativeWrapper = page.locator('.native-wrapper');
      const onClick = await page.spyOnEvent('click');

      await nativeWrapper.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      expect(onClick).toHaveReceivedEventTimes(1);

      // Verify that the event target is the input and not the native wrapper
      const event = onClick.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-input');
    });

    test('clicking native input within item should fire click event with target as ion-input', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-input label="Input"></ion-input>
        </ion-item>
      `,
        config
      );

      const nativeInput = page.locator('.native-input');
      const onClick = await page.spyOnEvent('click');

      await nativeInput.click();
      expect(onClick).toHaveReceivedEventTimes(1);

      // Verify that the event target is the ion-input and not the native input
      const event = onClick.events[0];
      expect((event.target as HTMLElement).tagName.toLowerCase()).toBe('ion-input');
    });
  });
});
