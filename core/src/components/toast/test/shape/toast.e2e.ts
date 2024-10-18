import { expect, type Locator } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
import type { E2EPage, E2EPageOptions, ScreenshotFn, EventSpy } from '@utils/test/playwright';

class ToastFixture {
  readonly page: E2EPage;

  private ionToastDidPresent!: EventSpy;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(config: E2EPageOptions) {
    const { page } = this;
    await page.goto(`/src/components/toast/test/shape`, config);
    this.ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
  }

  async openToast(selector: string) {
    const { page, ionToastDidPresent } = this;
    const button = page.locator(selector);
    await button.click();

    await ionToastDidPresent.next();

    return {
      toast: page.locator('ion-toast'),
      container: page.locator('ion-toast .toast-container'),
    };
  }

  async screenshot(screenshotModifier: string, screenshot: ScreenshotFn, el?: Locator) {
    const { page } = this;

    const screenshotString = screenshot(`toast-${screenshotModifier}`);

    if (el === undefined) {
      await expect(page).toHaveScreenshot(screenshotString);
    } else {
      await expect(el).toHaveScreenshot(screenshotString);
    }
  }
}

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('toast: shape'), () => {
    let toastFixture: ToastFixture;

    test.beforeEach(async ({ page }) => {
      toastFixture = new ToastFixture(page);
      await toastFixture.goto(config);
    });

    test('should render the default toast', async () => {
      await toastFixture.openToast('#default-toast');
      await toastFixture.screenshot('shape-round', screenshot);
    });

    test('should render a soft toast', async () => {
      await toastFixture.openToast('#soft-shape-toast');
      await toastFixture.screenshot('shape-soft', screenshot);
    });

    test('should render a round toast', async () => {
      await toastFixture.openToast('#round-shape-toast');
      await toastFixture.screenshot('shape-round', screenshot);
    });

    test('should render a rectangular toast', async () => {
      await toastFixture.openToast('#rect-shape-toast');
      await toastFixture.screenshot('shape-rectangular', screenshot);
    });
  });
});
