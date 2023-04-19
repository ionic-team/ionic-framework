import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

test.describe('alert: basic', () => {
  configs({ directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
    test(title('focus trap should work correctly'), async ({ page, browserName }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      const alertFixture = new AlertFixture(page, screenshot);

      const alert = await alertFixture.open('#multipleButtons');
      const alertBtns = alert.locator('button');

      await page.keyboard.press(tabKey);
      await expect(alertBtns.nth(0)).toBeFocused();

      await page.keyboard.press(`Shift+${tabKey}`);
      await expect(alertBtns.nth(2)).toBeFocused();

      await page.keyboard.press(tabKey);
      await expect(alertBtns.nth(0)).toBeFocused();
    });

    test(title('should set custom attributes'), async ({ page }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const alertFixture = new AlertFixture(page, screenshot);

      const alert = await alertFixture.open('#basic');
      await expect(alert).toHaveAttribute('data-testid', 'basic-alert');
    });

    test(title('should dismiss when async handler resolves'), async ({ page }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');
      const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidDismiss');

      const alert = page.locator('ion-alert');

      await page.click('#asyncHandler');
      await ionAlertDidPresent.next();

      await page.click('.alert-button');

      await expect(alert).toBeVisible();

      await ionLoadingDidDismiss.next();
      await ionAlertDidDismiss.next();

      await expect(alert).toBeHidden();
    });
  });
});

test.describe('should not have visual regressions', () => {
  configs().forEach(({ config, screenshot, title }) => {
    test(title('header, subheader, message'), async ({ page }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const alertFixture = new AlertFixture(page, screenshot);

      await alertFixture.open('#basic');
      await alertFixture.screenshot('basic');
    });

    test(title('long message'), async ({ page }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const alertFixture = new AlertFixture(page, screenshot);

      await alertFixture.open('#longMessage');
      await alertFixture.screenshot('longMessage');
    });

    test(title('more than two buttons'), async ({ page }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const alertFixture = new AlertFixture(page, screenshot);

      await alertFixture.open('#multipleButtons');
      await alertFixture.screenshot('multipleButtons');
    });

    test(title('no message'), async ({ page }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const alertFixture = new AlertFixture(page, screenshot);

      await alertFixture.open('#noMessage');
      await alertFixture.screenshot('noMessage');
    });

    test(title('two buttons'), async ({ page }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const alertFixture = new AlertFixture(page, screenshot);

      await alertFixture.open('#confirm');
      await alertFixture.screenshot('confirm');
    });

    test(title('form prompt'), async ({ page }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const alertFixture = new AlertFixture(page, screenshot);

      await alertFixture.open('#prompt');
      await alertFixture.screenshot('prompt');
    });

    test(title('radios'), async ({ page }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const alertFixture = new AlertFixture(page, screenshot);

      await alertFixture.open('#radio');
      await alertFixture.screenshot('radio');
    });

    test(title('checkboxes'), async ({ page }) => {
      await page.goto('/src/components/alert/test/basic', config);

      const alertFixture = new AlertFixture(page, screenshot);

      await alertFixture.open('#checkbox');
      await alertFixture.screenshot('checkbox');
    });
  });
});

class AlertFixture {
  readonly page: E2EPage;
  readonly screenshotFn?: (file: string) => string;

  private alert!: Locator;

  constructor(page: E2EPage, screenshot?: (file: string) => string) {
    this.page = page;
    this.screenshotFn = screenshot;
  }

  async open(selector: string) {
    const ionAlertDidPresent = await this.page.spyOnEvent('ionAlertDidPresent');
    await this.page.locator(selector).click();
    await ionAlertDidPresent.next();
    this.alert = this.page.locator('ion-alert');
    await expect(this.alert).toBeVisible();

    return this.alert;
  }

  async dismiss() {
    const ionAlertDidDismiss = await this.page.spyOnEvent('ionAlertDidDismiss');
    await this.alert.evaluate((el: HTMLIonAlertElement) => el.dismiss());
    await ionAlertDidDismiss.next();
    await expect(this.alert).not.toBeVisible();
  }

  async screenshot(modifier: string) {
    const { screenshotFn } = this;

    if (!screenshotFn) {
      throw new Error(
        'A screenshot function is required to take a screenshot. Pass one in when creating ActionSheetFixture.'
      );
    }

    await expect(this.alert).toHaveScreenshot(screenshotFn(`alert-${modifier}`));
  }
}
