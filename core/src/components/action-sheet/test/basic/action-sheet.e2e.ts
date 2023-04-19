import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

test.describe('action sheet: data', () => {
  configs({ direction: ['ltr'] }).forEach(({ config, title }) => {
    test(title('should return data'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page);

      const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');

      await actionSheetFixture.open('#buttonData');

      const buttonOption = page.locator('ion-action-sheet button#option');
      await buttonOption.click();

      await ionActionSheetDidDismiss.next();
      expect(ionActionSheetDidDismiss).toHaveReceivedEventDetail({ data: { type: '1' }, role: undefined });
    });
    test(title('should return cancel button data'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page);

      const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');

      await actionSheetFixture.open('#buttonData');

      const buttonOption = page.locator('ion-action-sheet button.action-sheet-cancel');
      await buttonOption.click();

      await ionActionSheetDidDismiss.next();
      expect(ionActionSheetDidDismiss).toHaveReceivedEventDetail({ data: { type: 'cancel' }, role: 'cancel' });
    });
  });
});

test.describe('action sheet: attributes', () => {
  configs({ direction: ['ltr'] }).forEach(({ config, title }) => {
    test(title('should set htmlAttributes'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page);

      await actionSheetFixture.open('#basic');

      const actionSheet = page.locator('ion-action-sheet');
      await expect(actionSheet).toHaveAttribute('data-testid', 'basic-action-sheet');
    });
  });
});

test.describe('action sheet: variant rendering', () => {
  configs().forEach(({ config, screenshot, title }) => {
    test(title('should open basic action sheet'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page, screenshot);

      await actionSheetFixture.open('#basic');
      await actionSheetFixture.screenshot('basic');

      /**
       * We want to test that the dismiss method
       * actually works, but we do not need to test
       * it every time. As a result, we only
       * call dismiss in this test.
       */
      await actionSheetFixture.dismiss();
    });
    test(title('should open cancel only action sheet'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page, screenshot);

      await actionSheetFixture.open('#cancelOnly');
      await actionSheetFixture.screenshot('cancel-only');
    });
    test(title('should open custom action sheet'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page, screenshot);

      await actionSheetFixture.open('#custom');
      await actionSheetFixture.screenshot('custom');
    });
    test(title('should open scrollable action sheet'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page, screenshot);

      await actionSheetFixture.open('#scrollableOptions');
      await actionSheetFixture.screenshot('scrollable-options');
    });
    test(title('should open scrollable action sheet without cancel'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page, screenshot);

      await actionSheetFixture.open('#scrollWithoutCancel');
      await actionSheetFixture.screenshot('scroll-without-cancel');
    });
  });
});

test.describe('action sheet: variant functionality', () => {
  configs({ direction: ['ltr'] }).forEach(({ config, title }) => {
    test(title('should open custom backdrop action sheet'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page);

      await actionSheetFixture.open('#customBackdrop');

      const backdrop = page.locator('ion-action-sheet ion-backdrop');
      await expect(backdrop).toHaveCSS('opacity', '1');
    });
    test(title('should open alert from action sheet'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page);

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      await actionSheetFixture.open('#alertFromActionSheet');

      await page.click('#open-alert');

      await ionAlertDidPresent.next();
    });
    test(title('should not dismiss action sheet when backdropDismiss: false'), async ({ page }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page);

      await actionSheetFixture.open('#noBackdropDismiss');

      const actionSheet = page.locator('ion-action-sheet');
      await actionSheet.locator('ion-backdrop').click();

      await expect(actionSheet).toBeVisible();
    });
  });
});

test.describe('action sheet: focus trap', () => {
  configs({ direction: ['ltr'] }).forEach(({ config, title }) => {
    test(title('it should trap focus in action sheet'), async ({ page, browserName }) => {
      await page.goto(`/src/components/action-sheet/test/basic`, config);
      const actionSheetFixture = new ActionSheetFixture(page);

      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      await actionSheetFixture.open('#basic');
      const buttons = page.locator('ion-action-sheet button');

      await page.keyboard.press(tabKey);
      await expect(buttons.nth(0)).toBeFocused();

      await page.keyboard.press(`Shift+${tabKey}`);
      await expect(buttons.nth(4)).toBeFocused();

      await page.keyboard.press(tabKey);
      await expect(buttons.nth(0)).toBeFocused();
    });
  });
});

class ActionSheetFixture {
  readonly page: E2EPage;
  readonly screenshotFn?: (file: string) => string;

  private actionSheet!: Locator;

  constructor(page: E2EPage, screenshot?: (file: string) => string) {
    this.page = page;
    this.screenshotFn = screenshot;
  }

  async open(selector: string) {
    const ionActionSheetDidPresent = await this.page.spyOnEvent('ionActionSheetDidPresent');
    await this.page.locator(selector).click();
    await ionActionSheetDidPresent.next();
    this.actionSheet = this.page.locator('ion-action-sheet');
    await expect(this.actionSheet).toBeVisible();
  }

  async dismiss() {
    const ionActionSheetDidDismiss = await this.page.spyOnEvent('ionActionSheetDidDismiss');
    await this.actionSheet.evaluate((el: HTMLIonActionSheetElement) => el.dismiss());
    await ionActionSheetDidDismiss.next();
    await expect(this.actionSheet).not.toBeVisible();
  }

  async screenshot(modifier: string) {
    const { screenshotFn } = this;

    if (!screenshotFn) {
      throw new Error(
        'A screenshot function is required to take a screenshot. Pass one in when creating ActionSheetFixture.'
      );
    }

    await expect(this.actionSheet).toHaveScreenshot(screenshotFn(`action-sheet-${modifier}-diff`));
  }
}
