import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { EventSpy } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item: inputs'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item/test/inputs`, config);

      await page.setIonViewport();
      await expect(page).toHaveScreenshot(screenshot(`item-inputs`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('disabled state rendering'), () => {
    let ionPopoverDidPresent: EventSpy;
    let ionPopoverDidDismiss: EventSpy;

    let popover: Locator;

    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/item/test/inputs`, config);

      ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

      popover = page.locator('ion-popover#optionsPopover');
    });
    // TODO (FW-6769): Enable test when its fixed
    test.skip('disabled controls should not have visual regressions', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnDisabled');

      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.setIonViewport();
      await expect(page).toHaveScreenshot(screenshot(`item-inputs-disabled`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('form data'), () => {
    let ionPopoverDidPresent: EventSpy;
    let ionPopoverDidDismiss: EventSpy;
    let formData: EventSpy;

    let popover: Locator;

    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/item/test/inputs`, config);

      ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
      formData = await page.spyOnEvent('formData');

      popover = page.locator('ion-popover#optionsPopover');
    });

    test('initial form data should be empty', async ({ page }) => {
      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({
        input: '',
        textarea: '',
        toggle: '',
        checkbox: '',
        select: '',
        datetime: '2022-04-01T10:00',
        range: '10',
      });
    });

    test('form controls have some value', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnSomeValue');
      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({
        input: 'Some value',
        textarea: 'Some value',
        toggle: 'on',
        checkbox: 'on',
        select: '2',
        datetime: '2022-04-01T10:00',
        range: '20',
      });
    });

    test('form control values set to be empty', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnEmptyValue');
      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({
        input: '',
        textarea: '',
        toggle: '',
        checkbox: '',
        select: '',
        datetime: '',
        range: '0',
      });
    });

    test('form control values set to null', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnNullValue');
      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({
        input: '',
        textarea: '',
        toggle: '',
        checkbox: '',
        select: '',
        datetime: '',
        range: '0',
      });
    });

    test('form control values set to undefined', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnUndefinedValue');
      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({
        input: '',
        textarea: '',
        toggle: '',
        checkbox: '',
        select: '',
        datetime: '',
        range: '0',
      });
    });

    test('should not have form data when controls are disabled', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnSomeValue');
      await page.click('#btnDisabled');

      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({});
    });
  });
});

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item: inputs'), () => {
    test('should not shrink the width of a div next to a checkbox, radio, select or toggle', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29319',
      });
      await page.setContent(
        `
        <style>
          .box {
            background: lightgreen;

            width: 60px;
            height: 60px;
          }
        </style>

        <ion-list lines="none">
          <ion-item>
            <div class="box"></div>
            <ion-checkbox>Checkbox</ion-checkbox>
          </ion-item>
          <ion-item>
            <div class="box"></div>
            <ion-radio>Radio</ion-radio>
          </ion-item>
          <ion-item>
            <div class="box"></div>
            <ion-select label="Select">
              <ion-select-option>Option</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <div class="box"></div>
            <ion-toggle>Toggle</ion-toggle>
          </ion-item>
        </ion-list>
      `,
        config
      );

      const list = page.locator('ion-list');

      await expect(list).toHaveScreenshot(screenshot(`item-inputs-div-with-inputs`));
    });

    test('should update interactivity state when elements are conditionally rendered', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29763',
      });

      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-label>Conditional Checkbox</ion-label>
          </ion-item>
        </ion-list>
        `,
        config
      );

      const item = page.locator('ion-item');

      await page.evaluate(() => {
        const item = document.querySelector('ion-item');
        const checkbox = document.createElement('ion-checkbox');
        item?.appendChild(checkbox);
      });

      await page.waitForChanges();

      const checkbox = page.locator('ion-checkbox');
      await expect(checkbox).not.toBeChecked();

      // Test that clicking on the left edge of the item toggles the checkbox
      await item.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      await expect(checkbox).toBeChecked();
    });
  });
});
