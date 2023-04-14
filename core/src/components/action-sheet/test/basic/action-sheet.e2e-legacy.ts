import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

test.describe('action sheet: basic', () => {
  let actionSheetFixture: ActionSheetFixture;
  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/action-sheet/test/basic`);
    actionSheetFixture = new ActionSheetFixture(page);
  });
  test.describe('action sheet: data', () => {
    test('should return data', async ({ page, skip }) => {
      skip.rtl();
      const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');

      await actionSheetFixture.open('#buttonData');

      const buttonOption = page.locator('ion-action-sheet button#option');
      await buttonOption.click();

      await ionActionSheetDidDismiss.next();
      expect(ionActionSheetDidDismiss).toHaveReceivedEventDetail({ data: { type: '1' }, role: undefined });
    });
    test('should return cancel button data', async ({ page, skip }) => {
      skip.rtl();
      const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');

      await actionSheetFixture.open('#buttonData');

      const buttonOption = page.locator('ion-action-sheet button.action-sheet-cancel');
      await buttonOption.click();

      await ionActionSheetDidDismiss.next();
      expect(ionActionSheetDidDismiss).toHaveReceivedEventDetail({ data: { type: 'cancel' }, role: 'cancel' });
    });
  });
  test.describe('action sheet: attributes', () => {
    test('should set htmlAttributes', async ({ page, skip }) => {
      skip.rtl();
      await actionSheetFixture.open('#basic');

      const actionSheet = page.locator('ion-action-sheet');
      await expect(actionSheet).toHaveAttribute('data-testid', 'basic-action-sheet');
    });
  });
  test.describe('action sheet: variants', () => {
    test('should open basic action sheet', async () => {
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
    test('should open cancel only action sheet', async () => {
      await actionSheetFixture.open('#cancelOnly');
      await actionSheetFixture.screenshot('cancel-only');
    });
    test('should open custom action sheet', async () => {
      await actionSheetFixture.open('#custom');
      await actionSheetFixture.screenshot('custom');
    });
    test('should open scrollable action sheet', async () => {
      await actionSheetFixture.open('#scrollableOptions');
      await actionSheetFixture.screenshot('scrollable-options');
    });
    test('should open scrollable action sheet without cancel', async () => {
      await actionSheetFixture.open('#scrollWithoutCancel');
      await actionSheetFixture.screenshot('scroll-without-cancel');
    });
    test('should open custom backdrop action sheet', async ({ page, skip }) => {
      skip.rtl();
      await actionSheetFixture.open('#customBackdrop');

      const backdrop = page.locator('ion-action-sheet ion-backdrop');
      await expect(backdrop).toHaveCSS('opacity', '1');
    });
    test('should open alert from action sheet', async ({ page, skip }) => {
      skip.rtl();
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      await actionSheetFixture.open('#alertFromActionSheet');

      await page.locator('#open-alert').click();

      await ionAlertDidPresent.next();
    });
    test('should not dismiss action sheet when backdropDismiss: false', async ({ page, skip }) => {
      skip.rtl();
      await actionSheetFixture.open('#noBackdropDismiss');

      const actionSheet = page.locator('ion-action-sheet');
      await actionSheet.locator('ion-backdrop').click();

      await expect(actionSheet).toBeVisible();
    });
  });
  test.describe('action sheet: focus trap', () => {
    test('it should trap focus in action sheet', async ({ page, skip, browserName }) => {
      skip.rtl();
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

  private actionSheet!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
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
    await expect(this.actionSheet).toHaveScreenshot(
      `action-sheet-${modifier}-diff-${this.page.getSnapshotSettings()}.png`
    );
  }
}
