import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('fab-button: form'), () => {
    test('should submit the closest form', async ({ page }) => {
      await page.setContent(
        `
        <form>
          <ion-fab-button type="submit">Submit</ion-fab-button>
        </form>
      `,
        config
      );

      const submitEvent = await page.spyOnEvent('submit');

      await page.click('ion-fab-button');

      expect(submitEvent).toHaveReceivedEvent();
    });

    test('should submit the form by id', async ({ page }) => {
      await page.setContent(
        `
        <form id="myForm"></form>
        <ion-fab-button form="myForm" type="submit">Submit</ion-fab-button>
      `,
        config
      );

      const submitEvent = await page.spyOnEvent('submit');

      await page.click('ion-fab-button');

      expect(submitEvent).toHaveReceivedEvent();
    });

    test('should submit the form by reference', async ({ page }) => {
      await page.setContent(
        `
        <form></form>
        <ion-fab-button type="submit">Submit</ion-fab-button>
        <script>
          const form = document.querySelector('form');
          const button = document.querySelector('ion-fab-button');
          button.form = form;
        </script>
      `,
        config
      );

      const submitEvent = await page.spyOnEvent('submit');

      await page.click('ion-fab-button');

      expect(submitEvent).toHaveReceivedEvent();
    });

    test('should submit the closest form by pressing the `enter` key on a form input', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/18550',
      });

      await page.setContent(
        `
        <form>
          <input type="text" />
          <ion-fab-button type="submit">Submit</ion-fab-button>
        </form>
      `,
        config
      );

      const submitEvent = await page.spyOnEvent('submit');

      await page.press('input', 'Enter');

      expect(submitEvent).toHaveReceivedEvent();
    });

    test('should not submit the closest form when button is disabled', async ({ page }) => {
      await page.setContent(
        `
        <form>
          <input type="text" />
          <ion-fab-button type="submit" disabled>Submit</ion-fab-button>
        </form>
      `,
        config
      );

      const submitEvent = await page.spyOnEvent('submit');

      await page.press('input', 'Enter');

      expect(submitEvent).not.toHaveReceivedEvent();
    });

    test('should reset the form', async ({ page }) => {
      await page.setContent(
        `
        <form>
          <input type="text" value="initial" />
          <ion-fab-button type="reset">Reset</ion-fab-button>
        </form>
      `,
        config
      );

      const input = page.locator('input');
      await input.fill('changed');
      expect(await input.inputValue()).toBe('changed');

      await page.click('ion-fab-button');

      expect(await input.inputValue()).toBe('initial');
    });
  });

  test.describe(title('should throw a warning if the form cannot be found'), () => {
    test('form is a string selector', async ({ page }) => {
      const logs: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'warning') {
          logs.push(msg.text());
        }
      });

      await page.setContent(`<ion-fab-button type="submit" form="missingForm">Submit</ion-fab-button>`, config);

      expect(logs.length).toBe(1);
      expect(logs[0]).toContain(
        '[Ionic Warning]: [ion-fab-button] - Form with selector: "#missingForm" could not be found. Verify that the id is correct and the form is rendered in the DOM.'
      );
    });
  });
});
