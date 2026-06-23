import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * Force every theme's alert to the same canvas so the
 * label-placement snapshots can be compared one-to-one.
 * iOS does not respect the viewport so styles must be
 * updated instead.
 */
const ALERT_SIZE_OVERRIDES = `
  ion-alert {
    --max-width: 560px !important;
    --max-height: none !important;
  }
  ion-alert .alert-radio-group,
  ion-alert .alert-checkbox-group {
    max-height: none !important;
  }
`;

configs({ modes: ['md', 'ios'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('alert: label placement'), () => {
    let alertFixture!: AlertFixture;

    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/alert/test/label-placement', config);
      await page.addStyleTag({ content: ALERT_SIZE_OVERRIDES });
      alertFixture = new AlertFixture(page, screenshot);
    });

    test('radio - placement start', async () => {
      await alertFixture.open('#radioStart');
      await alertFixture.screenshot('radio-placement-start');
    });

    test('radio - placement end', async () => {
      await alertFixture.open('#radioEnd');
      await alertFixture.screenshot('radio-placement-end');
    });

    test('checkbox - placement start', async () => {
      await alertFixture.open('#checkboxStart');
      await alertFixture.screenshot('checkbox-placement-start');
    });

    test('checkbox - placement end', async () => {
      await alertFixture.open('#checkboxEnd');
      await alertFixture.screenshot('checkbox-placement-end');
    });
  });
});

class AlertFixture {
  readonly page: E2EPage;
  readonly screenshotFn: (file: string) => string;

  private alert!: Locator;

  constructor(page: E2EPage, screenshot: (file: string) => string) {
    this.page = page;
    this.screenshotFn = screenshot;
  }

  async open(selector: string) {
    const ionAlertDidPresent = await this.page.spyOnEvent('ionAlertDidPresent');
    await this.page.locator(selector).click();
    await ionAlertDidPresent.next();
    this.alert = this.page.locator('ion-alert');
    await expect(this.alert).toBeVisible();

    // Move mouse to away from the alert so hover styles don't interfere with screenshots
    await this.page.mouse.move(0, 0);

    return this.alert;
  }

  async screenshot(modifier: string) {
    const alertWrapper = this.alert.locator('.alert-wrapper');
    await expect(alertWrapper).toHaveScreenshot(this.screenshotFn(`alert-label-${modifier}`));
  }
}
