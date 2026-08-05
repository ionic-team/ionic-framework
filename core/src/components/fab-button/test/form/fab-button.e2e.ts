import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Form submission does not vary across modes or directions.
 */
configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('fab-button: form'), () => {
    test.describe('fab-button: submit functionality', () => {
      test('should submit the closest form', async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/18550',
        });

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

      test('should submit the closest form by pressing the `enter` key on a form input', async ({ page }) => {
        /**
         * Two inputs are used because a single-field form with no submit button
         * submits implicitly on "Enter", which would pass without the hidden button.
         */
        await page.setContent(
          `
          <form>
            <input type="text" />
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

      test('should submit the form by id when form is set async', async ({ page }) => {
        await page.setContent(
          `
          <form id="myForm"></form>
          <ion-fab-button type="submit">Submit</ion-fab-button>
        `,
          config
        );

        const fabButton = page.locator('ion-fab-button');
        await fabButton.evaluate((el: HTMLIonFabButtonElement) => (el.form = 'myForm'));
        await page.waitForChanges();

        const submitEvent = await page.spyOnEvent('submit');

        await page.click('ion-fab-button');

        expect(submitEvent).toHaveReceivedEvent();
      });

      test('should not submit the form after disabled is set async', async ({ page }) => {
        /**
         * A single input is used so the browser attempts implicit submission on
         * "Enter", which is only suppressed when the hidden button is disabled.
         */
        await page.setContent(
          `
          <form>
            <input type="text" />
            <ion-fab-button type="submit">Submit</ion-fab-button>
          </form>
        `,
          config
        );

        const fabButton = page.locator('ion-fab-button');
        await fabButton.evaluate((el: HTMLIonFabButtonElement) => (el.disabled = true));
        await page.waitForChanges();

        const submitEvent = await page.spyOnEvent('submit');

        await page.press('input', 'Enter');

        expect(submitEvent).not.toHaveReceivedEvent();
      });

      test('should not submit the closest form when type is the default', async ({ page }) => {
        await page.setContent(
          `
          <form>
            <input type="text" />
            <ion-fab-button>Click</ion-fab-button>
          </form>
        `,
          config
        );

        const submitEvent = await page.spyOnEvent('submit');

        await page.click('ion-fab-button');

        expect(submitEvent).not.toHaveReceivedEvent();
      });

      test('should submit the closest form and toggle the fab', async ({ page }) => {
        await page.setContent(
          `
          <form onsubmit="return false">
            <ion-fab>
              <ion-fab-button type="submit">Submit</ion-fab-button>
              <ion-fab-list side="top">
                <ion-fab-button>Item</ion-fab-button>
              </ion-fab-list>
            </ion-fab>
          </form>
        `,
          config
        );

        const submitEvent = await page.spyOnEvent('submit');

        await page.click('ion-fab > ion-fab-button');

        expect(submitEvent).toHaveReceivedEvent();
        await expect(page.locator('ion-fab')).toHaveJSProperty('activated', true);
      });

      test('should submit the form when href is also set', async ({ page }) => {
        await page.setContent(
          `
          <form onsubmit="return false">
            <ion-fab-button href="#navigated" type="submit">Submit</ion-fab-button>
          </form>
        `,
          config
        );

        const submitEvent = await page.spyOnEvent('submit');

        await page.click('ion-fab-button');

        expect(submitEvent).toHaveReceivedEvent();
        expect(await page.evaluate(() => window.location.hash)).not.toBe('#navigated');
      });
    });

    test.describe('fab-button: reset functionality', () => {
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

      test('should reset the form after type is changed from submit to reset', async ({ page }) => {
        await page.setContent(
          `
          <form>
            <input type="text" value="initial" />
            <input type="text" />
            <ion-fab-button type="submit">Submit</ion-fab-button>
          </form>
        `,
          config
        );

        const fabButton = page.locator('ion-fab-button');
        await fabButton.evaluate((el: HTMLIonFabButtonElement) => (el.type = 'reset'));
        await page.waitForChanges();

        const submitEvent = await page.spyOnEvent('submit');

        const input = page.locator('input').first();
        await input.fill('changed');

        await page.click('ion-fab-button');

        expect(await input.inputValue()).toBe('initial');
        expect(submitEvent).not.toHaveReceivedEvent();
      });
    });
  });

  test.describe(title('fab-button: form warnings'), () => {
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

    test('form id does not belong to a form element', async ({ page }) => {
      const logs: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'warning') {
          logs.push(msg.text());
        }
      });

      await page.setContent(
        `
        <div id="notAForm"></div>
        <ion-fab-button type="submit" form="notAForm">Submit</ion-fab-button>
      `,
        config
      );

      expect(logs.length).toBe(1);
      expect(logs[0]).toContain(
        '[Ionic Warning]: [ion-fab-button] - Form with selector: "#notAForm" could not be found. Verify that the id is attached to a <form> element.'
      );
    });

    test('form is an element reference', async ({ page }) => {
      const logs: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'warning') {
          logs.push(msg.text());
        }
      });

      await page.setContent(`<ion-fab-button type="submit">Submit</ion-fab-button>`, config);

      const fabButton = page.locator('ion-fab-button');
      await fabButton.evaluate((el: HTMLIonFabButtonElement) => ((el as any).form = document.createElement('div')));
      await page.waitForChanges();

      expect(logs.length).toBe(1);
      expect(logs[0]).toContain(
        '[Ionic Warning]: [ion-fab-button] - The provided "form" element is invalid. Verify that the form is a HTMLFormElement and rendered in the DOM.'
      );
    });
  });
});
