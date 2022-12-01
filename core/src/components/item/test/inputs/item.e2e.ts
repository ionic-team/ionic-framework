import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { EventSpy } from '@utils/test/playwright';
import { test, configs } from '@utils/test/playwright';

test.describe('item: inputs', () => {
  configs().forEach(({ title, config }) => {
    test.describe('item: inputs rendering', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/src/components/item/test/inputs`, config);
      });
      test(title('should not have visual regressions'), async ({ page }) => {
        await page.setIonViewport();
        expect(await page.screenshot()).toMatchSnapshot(`item-inputs-${page.getSnapshotSettings()}.png`);
      });

      test(title('disabled controls should not have visual regressions'), async ({ page }) => {
        const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
        const ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

        const popover = page.locator('ion-popover#optionsPopover');
        await page.click('#popover-trigger');
        await ionPopoverDidPresent.next();

        await page.click('#btnDisabled');

        await page.waitForChanges();

        await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
        await ionPopoverDidDismiss.next();

        await page.setIonViewport();
        expect(await page.screenshot()).toMatchSnapshot(`item-inputs-disabled-${page.getSnapshotSettings()}.png`);
      });
    });
  });

  configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
    test.describe('form data', () => {
      let ionPopoverDidPresent: EventSpy;
      let ionPopoverDidDismiss: EventSpy;

      let formResult: Locator;
      let popover: Locator;

      test.beforeEach(async ({ page }) => {
        await page.goto(`/src/components/item/test/inputs`, config);

        ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
        ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');

        formResult = page.locator('#form-result');
        popover = page.locator('ion-popover#optionsPopover');
      });

      test(title('initial form data should be empty'), async ({ page }) => {
        await page.click('#submit');

        await expect(await formResult.textContent()).toEqual(
          '{"input":"","textarea":"","toggle":"","checkbox":"","select":"","datetime":"2022-04-01T10:00","range":"10"}'
        );
      });

      test(title('form controls have some value'), async ({ page }) => {
        await page.click('#popover-trigger');
        await ionPopoverDidPresent.next();

        await page.click('#btnSomeValue');
        await page.waitForChanges();

        await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
        await ionPopoverDidDismiss.next();

        await page.click('#submit');

        await expect(await formResult.textContent()).toEqual(
          '{"input":"Some value","textarea":"Some value","toggle":"on","checkbox":"on","select":"2","datetime":"2022-04-01T10:00","range":"20"}'
        );
      });

      test(title('form control values set to be empty'), async ({ page }) => {
        await page.click('#popover-trigger');
        await ionPopoverDidPresent.next();

        await page.click('#btnEmptyValue');
        await page.waitForChanges();

        await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
        await ionPopoverDidDismiss.next();

        await page.click('#submit');

        await expect(await formResult.textContent()).toEqual(
          '{"input":"","textarea":"","toggle":"","checkbox":"","select":"","datetime":"","range":"0"}'
        );
      });

      test(title('form control values set to null'), async ({ page }) => {
        await page.click('#popover-trigger');
        await ionPopoverDidPresent.next();

        await page.click('#btnNullValue');
        await page.waitForChanges();

        await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
        await ionPopoverDidDismiss.next();

        await page.click('#submit');

        await expect(await formResult.textContent()).toEqual(
          '{"input":"","textarea":"","toggle":"","checkbox":"","select":"","datetime":"","range":"0"}'
        );
      });

      test(title('form control values set to undefined'), async ({ page }) => {
        await page.click('#popover-trigger');
        await ionPopoverDidPresent.next();

        await page.click('#btnUndefinedValue');
        await page.waitForChanges();

        await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
        await ionPopoverDidDismiss.next();

        await page.click('#submit');

        await expect(await formResult.textContent()).toEqual(
          '{"input":"","textarea":"","toggle":"","checkbox":"","select":"","datetime":"","range":"0"}'
        );
      });

      test(title('should not have form data when controls are disabled'), async ({ page }) => {
        await page.click('#popover-trigger');
        await ionPopoverDidPresent.next();

        await page.click('#btnSomeValue');
        await page.click('#btnDisabled');

        await page.waitForChanges();

        await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
        await ionPopoverDidDismiss.next();

        await page.click('#submit');

        await expect(await formResult.textContent()).toEqual('{}');
      });
    });
  });
});
