import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('button: form'), () => {
    test('should submit the form by id', async ({ page }) => {
      await page.setContent(
        `
        <form id="myForm"></form>
        <ion-button form="myForm" type="submit">Submit</ion-button>
      `,
        config
      );

      const submitEvent = await page.spyOnEvent('submit');

      await page.click('ion-button');

      expect(submitEvent).toHaveReceivedEvent();
    });

    test('should submit the form by reference', async ({ page }) => {
      await page.setContent(
        `
        <form></form>
        <ion-button type="submit">Submit</ion-button>
        <script>
          const form = document.querySelector('form');
          const button = document.querySelector('ion-button');
          button.form = form;
        </script>
      `,
        config
      );

      const submitEvent = await page.spyOnEvent('submit');

      await page.click('ion-button');

      expect(submitEvent).toHaveReceivedEvent();
    });

    test('should submit the closest form', async ({ page }) => {
      await page.setContent(
        `
        <form>
           <ion-button type="submit">Submit</ion-button>
        </form>
      `,
        config
      );

      const submitEvent = await page.spyOnEvent('submit');

      await page.click('ion-button');

      expect(submitEvent).toHaveReceivedEvent();
    });
  });

  test.describe(title('should throw a warning if the form cannot be found'), () => {
    test('form is a string selector', async ({ page }) => {
      await page.setContent(`<ion-button type="submit" form="missingForm">Submit</ion-button>`, config);

      const logs: string[] = [];

      page.on('console', (msg) => {
        logs.push(msg.text());
      });

      await page.click('ion-button');

      expect(logs.length).toBe(1);
      expect(logs[0]).toContain(
        '[Ionic Warning]: Form with selector: "#missingForm" could not be found. Verify that the id is correct and the form is rendered in the DOM.'
      );
    });

    test('form is an element reference', async ({ page }) => {
      await page.setContent(
        `
        <ion-button type="submit">Submit</ion-button>
        <script>
          const form = document.querySelector('form');
          const button = document.querySelector('ion-button');

          button.form = form;
        </script>
      `,
        config
      );

      const logs: string[] = [];

      page.on('console', (msg) => {
        logs.push(msg.text());
      });

      await page.click('ion-button');

      expect(logs.length).toBe(1);
      expect(logs[0]).toContain(
        '[Ionic Warning]: The provided "form" element is invalid. Verify that the form is a HTMLFormElement and rendered in the DOM.'
      );
    });
  });
});
