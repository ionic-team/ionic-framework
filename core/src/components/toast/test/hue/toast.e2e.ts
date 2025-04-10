import { expect } from '@playwright/test';
import type { E2EPage, E2EPageOptions, ScreenshotFn, EventSpy } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

class ToastFixture {
  readonly page: E2EPage;

  private ionToastDidPresent!: EventSpy;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(config: E2EPageOptions) {
    const { page } = this;
    await page.goto(`/src/components/toast/test/hue`, config);
    this.ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
  }

  async openToast(selector: string) {
    const { page, ionToastDidPresent } = this;
    const button = page.locator(selector);
    await button.click();

    await ionToastDidPresent.next();

    return {
      toast: page.locator('ion-toast'),
    };
  }

  async screenshot(screenshotModifier: string, screenshot: ScreenshotFn) {
    const { page } = this;

    const screenshotString = screenshot(`toast-${screenshotModifier}`);

    await expect(page).toHaveScreenshot(screenshotString);
  }
}

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toast: hue'), () => {
    let toastFixture: ToastFixture;
    test.beforeEach(async ({ page }) => {
      toastFixture = new ToastFixture(page);
      await toastFixture.goto(config);
    });

    test('should show all subtle toasts', async () => {
      await toastFixture.openToast('#show-subtle-toasts');
      await toastFixture.screenshot('subtle', screenshot);
    });

    test('should show all bold toasts', async () => {
      await toastFixture.openToast('#show-bold-toasts');
      await toastFixture.screenshot('bold', screenshot);
    });
  });
});
