import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type {
  E2EPage,
  E2EPageOptions,
  ScreenshotFn,
  EventSpy,
} from '@utils/test/playwright';
import {
  configs,
  test,
} from '@utils/test/playwright';

class ToastFixture {
  readonly page: E2EPage;

  private ionToastDidPresent!: EventSpy;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(config: E2EPageOptions) {
    const { page } = this;
    await page.goto(
      `/src/components/toast/test/basic`,
      config
    );
    this.ionToastDidPresent =
      await page.spyOnEvent(
        'ionToastDidPresent'
      );
  }

  async openToast(selector: string) {
    const { page, ionToastDidPresent } =
      this;
    const button =
      page.locator(selector);
    await button.click();

    await ionToastDidPresent.next();

    return {
      toast: page.locator('ion-toast'),
      container: page.locator(
        'ion-toast .toast-container'
      ),
    };
  }

  async screenshot(
    screenshotModifier: string,
    screenshot: ScreenshotFn,
    el?: Locator
  ) {
    const { page } = this;

    const screenshotString = screenshot(
      `toast-${screenshotModifier}`
    );

    if (el === undefined) {
      await expect(
        page
      ).toHaveScreenshot(
        screenshotString
      );
    } else {
      await expect(el).toHaveScreenshot(
        screenshotString
      );
    }
  }
}

configs({
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title(
        'toast: position rendering'
      ),
      () => {
        let toastFixture: ToastFixture;
        test.beforeEach(
          async ({ page }) => {
            toastFixture =
              new ToastFixture(page);
            await toastFixture.goto(
              config
            );
          }
        );
        test('should render toast at the top', async () => {
          await toastFixture.openToast(
            '#show-top-toast'
          );
          await toastFixture.screenshot(
            'top',
            screenshot
          );
        });
        test('should render toast at the middle', async () => {
          await toastFixture.openToast(
            '#show-middle-toast'
          );
          await toastFixture.screenshot(
            'middle',
            screenshot
          );
        });
        test('should render toast at the bottom', async () => {
          await toastFixture.openToast(
            '#show-bottom-toast'
          );
          await toastFixture.screenshot(
            'bottom',
            screenshot
          );
        });
      }
    );
    test.describe(
      title('toast: color rendering'),
      () => {
        test('should set color correctly', async ({
          page,
        }) => {
          const toastFixture =
            new ToastFixture(page);
          await toastFixture.goto(
            config
          );
          const { container } =
            await toastFixture.openToast(
              '#color-toast'
            );
          await toastFixture.screenshot(
            'color',
            screenshot,
            container
          );
        });
      }
    );

    test.describe(
      title('toast: text wrapping'),
      () => {
        test('should wrap text correctly', async ({
          page,
        }) => {
          const toastFixture =
            new ToastFixture(page);
          await toastFixture.goto(
            config
          );
          const { container } =
            await toastFixture.openToast(
              '#two-line-toast'
            );
          await toastFixture.screenshot(
            'text',
            screenshot,
            container
          );
        });
      }
    );
  }
);

configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(
  ({ title, screenshot, config }) => {
    /**
     * Translucency only works on iOS
     */
    test.describe(
      title('toast: translucency'),
      () => {
        test('should set translucency correctly', async ({
          page,
        }) => {
          const toastFixture =
            new ToastFixture(page);
          await toastFixture.goto(
            config
          );

          const { container } =
            await toastFixture.openToast(
              '#translucent-toast'
            );
          await toastFixture.screenshot(
            'translucent',
            screenshot,
            container
          );
        });

        test('should set translucency correctly when color is provided', async ({
          page,
        }) => {
          const toastFixture =
            new ToastFixture(page);
          await toastFixture.goto(
            config
          );

          const { container } =
            await toastFixture.openToast(
              '#translucent-color-toast'
            );
          await toastFixture.screenshot(
            'translucent-color',
            screenshot,
            container
          );
        });
      }
    );

    /**
     * This functionality has no mode specific logic.
     */
    test.describe(
      title('toast: properties'),
      () => {
        let toastFixture: ToastFixture;
        test.beforeEach(
          async ({ page }) => {
            toastFixture =
              new ToastFixture(page);

            await toastFixture.goto(
              config
            );
          }
        );

        test('should correctly set custom class', async () => {
          const { toast } =
            await toastFixture.openToast(
              '#custom-class-toast'
            );
          await expect(
            toast
          ).toHaveClass(
            /my-custom-class/
          );
        });
      }
    );
  }
);

configs().forEach(
  ({ title, screenshot, config }) => {
    test.describe(
      title('toast: rendering'),
      () => {
        let toastFixture: ToastFixture;
        test.beforeEach(
          async ({ page }) => {
            toastFixture =
              new ToastFixture(page);
            await toastFixture.goto(
              config
            );
          }
        );

        test('should set buttons correctly', async () => {
          const { container } =
            await toastFixture.openToast(
              '#custom-action-buttons-toast'
            );
          await toastFixture.screenshot(
            'buttons',
            screenshot,
            container
          );
        });

        test('should set start/end positioning correctly', async () => {
          const { container } =
            await toastFixture.openToast(
              '#toast-start-and-end'
            );
          await toastFixture.screenshot(
            'start-end',
            screenshot,
            container
          );
        });
      }
    );
  }
);
