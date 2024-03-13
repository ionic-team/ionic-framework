import type { Locator } from '@playwright/test';
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
    await page.goto(`/src/components/toast/test/buttons`, config);
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

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('Test cancel buttons'), () => {
    let toastFixture: ToastFixture;

    test.beforeEach(async ({ page }) => {
      toastFixture = new ToastFixture(page);
      await toastFixture.goto(config);
    });

    test('cancel button 1', async ({ page }) => {
      await toastFixture.openToast('#multipleCancelButtons');
      const optBtn1 = page.locator('ion-toast button.cancel1-btn');
      await optBtn1.click();
      const confirmOptBtn1Alert = page.locator('ion-alert[data-testid=cancel1-btn-clicked]');
      const optBtn1AlertInfo = confirmOptBtn1Alert.locator('.alert-message').innerText();
      const optBtn1AlertOkBtn = confirmOptBtn1Alert.locator('.alert-button-group button');
      expect(await optBtn1AlertInfo).toBe('cancel1-btn-clicked');
      await toastFixture.screenshot('toastCancelBtn1', screenshot);
      await optBtn1AlertOkBtn.click();
    });

    test('cancel button 2', async ({ page }) => {
      await toastFixture.openToast('#multipleCancelButtons');
      const optBtn2 = page.locator('ion-toast button.cancel2-btn');
      await optBtn2.click();
      const confirmOptBtn2Alert = page.locator('ion-alert[data-testid=cancel2-btn-clicked]');
      const optBtn2AlertInfo = confirmOptBtn2Alert.locator('.alert-message').innerText();
      const optBtn2AlertOkBtn = confirmOptBtn2Alert.locator('.alert-button-group button');
      expect(await optBtn2AlertInfo).toBe('cancel2-btn-clicked');
      await toastFixture.screenshot('toastCancelBtn2', screenshot);
      await optBtn2AlertOkBtn.click();
    });

    test('cancel button 3', async ({ page }) => {
      await toastFixture.openToast('#multipleCancelButtons');
      const ionToastDidDismiss = await page.spyOnEvent('ionToastDidDismiss');
      const optBtn3 = page.locator('ion-toast button.cancel3-btn');
      await optBtn3.click();
      await ionToastDidDismiss.next();
      expect(ionToastDidDismiss).toHaveReceivedEventDetail({ data: undefined, role: 'cancel' });
    });
  });
});
