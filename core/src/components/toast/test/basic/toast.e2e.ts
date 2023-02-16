import type { Locator, TestInfo } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage, EventSpy } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

class ToastFixture {
  readonly page: E2EPage;
  readonly testInfo: TestInfo;

  private ionToastDidPresent!: EventSpy;

  constructor(page: E2EPage, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
  }

  async goto() {
    const { page } = this;
    await page.goto(`/src/components/toast/test/basic`);
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

  async screenshot(screenshotModifier: string, el?: Locator) {
    const { page } = this;

    const screenshotString = `toast-${screenshotModifier}-${page.getSnapshotSettings()}.png`;

    if (el === undefined) {
      await expect(page).toHaveScreenshot(screenshotString);
    } else {
      await expect(el).toHaveScreenshot(screenshotString);
    }
  }

  skipRTL(testRef: typeof test, reason = 'This functionality does not have RTL-specific behaviors.') {
    const { testInfo } = this;
    testRef.skip(testInfo.project.metadata.rtl === true, reason);
  }

  skipMode(testRef: typeof test, mode: string, reason: string) {
    const { testInfo } = this;
    testRef.skip(testInfo.project.metadata.mode === mode, reason);
  }
}

test.describe('toast: rendering', () => {
  let toastFixture: ToastFixture;
  test.beforeEach(async ({ page }, testInfo) => {
    toastFixture = new ToastFixture(page, testInfo);
    await toastFixture.goto();
  });

  test.describe('toast: position', () => {
    test.beforeEach(() => {
      toastFixture.skipRTL(test);
    });
    test('should render toast at the top', async () => {
      await toastFixture.openToast('#show-top-toast');
      await toastFixture.screenshot('top');
    });
    test('should render toast at the middle', async () => {
      await toastFixture.openToast('#show-middle-toast');
      await toastFixture.screenshot('middle');
    });
    test('should render toast at the bottom', async () => {
      await toastFixture.openToast('#show-bottom-toast');
      await toastFixture.screenshot('bottom');
    });
  });

  test('should set buttons correctly', async () => {
    const { container } = await toastFixture.openToast('#custom-action-buttons-toast');
    await toastFixture.screenshot('buttons', container);
  });

  test('should set start/end positioning correctly', async () => {
    const { container } = await toastFixture.openToast('#toast-start-and-end');
    await toastFixture.screenshot('start-end', container);
  });

  test('should wrap text correctly', async () => {
    toastFixture.skipRTL(test);
    const { container } = await toastFixture.openToast('#two-line-toast');
    await toastFixture.screenshot('text', container);
  });

  test('should set color correctly', async () => {
    toastFixture.skipRTL(test);
    const { container } = await toastFixture.openToast('#color-toast');
    await toastFixture.screenshot('color', container);
  });

  test('should set translucency correctly', async () => {
    toastFixture.skipRTL(test);
    toastFixture.skipMode(test, 'md', 'Translucency only works on iOS');

    const { container } = await toastFixture.openToast('#translucent-toast');
    await toastFixture.screenshot('translucent', container);
  });
});

test.describe('toast: properties', () => {
  let toastFixture: ToastFixture;
  test.beforeEach(async ({ page }, testInfo) => {
    toastFixture = new ToastFixture(page, testInfo);

    toastFixture.skipMode(test, 'md', 'This functionality has no mode specific logic.');
    toastFixture.skipRTL(test);

    await toastFixture.goto();
  });
  test('should correctly set htmlAttributes', async () => {
    const { toast } = await toastFixture.openToast('#show-bottom-toast');
    await expect(toast).toHaveAttribute('data-testid', 'basic-toast');
  });

  test('should correctly set custom html', async () => {
    const { toast } = await toastFixture.openToast('#toast-html');
    await expect(toast.locator('ion-button')).toBeVisible();
  });

  test('should correctly set custom class', async () => {
    const { toast } = await toastFixture.openToast('#custom-class-toast');
    await expect(toast).toHaveClass(/my-custom-class/);
  });
});

test.describe('toast: duration config', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });
  test('should have duration set to 0', async ({ page }) => {
    await page.setContent(`
      <ion-toast></ion-toast>
    `);
    const toast = page.locator('ion-toast');
    await expect(toast).toHaveJSProperty('duration', 0);
  });

  test('should have duration set to 5000', async ({ page }) => {
    await page.setContent(`
      <ion-toast></ion-toast>
      <script>
        window.Ionic = {
          config: { toastDuration: 5000 }
        }
      </script>
    `);

    const toast = page.locator('ion-toast');
    await expect(toast).toHaveJSProperty('duration', 5000);
  });
});
