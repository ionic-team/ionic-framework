import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('modal: canDismiss', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/modal/test/canDismiss');
  });

  test.describe('regular modal', () => {
    test('should dismiss when canDismiss is true', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(true);
    });
    test('should not dismiss when canDismiss is false', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(false);
    });
    test('should not dismiss when canDismiss is Promise<true>', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(true);
    });
    test('should not dismiss when canDismiss is Promise<false>', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(false);
    });
    test('should dismiss when canDismiss is Action Sheet and user clicks confirm', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      await page.click('#radio-action-sheet');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      await page.keyboard.press('Escape');

      await ionActionSheetDidPresent.next();
      await page.click('.button-confirm');

      await ionModalDidDismiss.next();
    });
  });
  test.describe('card modal', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('#radio-card');
    });
    test('should dismiss when canDismiss is true', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(true);
    });
    test('should not dismiss when canDismiss is false', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(false);
    });
    test('should dismiss when canDismiss is Promise<true>', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(true);
    });
    test('should not dismiss when canDismiss is Promise<false>', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(false);
    });
    /*test.skip('should dismiss on swipe when canDismiss is true', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.$('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test.skip('should not dismiss on swipe when canDismiss is false', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.$('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      const modal = await page.find('ion-modal');
      expect(modal).not.toBe(null);
    });
    test.skip('should dismiss on swipe when canDismiss is Promise<true>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.$('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test.skip('should not dismiss on swipe when canDismiss is Promise<false>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionHandlerDone = await page.spyOnEvent('ionHandlerDone');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.$('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionHandlerDone.next();

      const modal = await page.find('ion-modal');
      expect(modal).not.toBe(null);
    });
    test.skip('should dismiss when canDismiss is Action Sheet and user clicks confirm', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      await page.click('#radio-action-sheet');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.$('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionActionSheetDidPresent.next();
      await page.click('.button-confirm');

      await ionModalDidDismiss.next();
    });*/
  });
  test.describe('sheet modal', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('#radio-sheet');
    });
    test('should dismiss when canDismiss is true', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(true);
    });
    test('should not dismiss when canDismiss is false', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(false);
    });
    test('should dismiss when canDismiss is Promise<true>', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(true);
    });
    test('should not dismiss when canDismiss is Promise<false>', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const returnValue = await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

      expect(returnValue).toBe(false);
    });
    /*test.skip('should dismiss on swipe when canDismiss is true', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.$('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test.skip('should not dismiss on swipe when canDismiss is false', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.$('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      const modal = await page.find('ion-modal');
      expect(modal).not.toBe(null);
    });
    test.skip('should dismiss on swipe when canDismiss is Promise<true>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.$('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test.skip('should not dismiss on swipe when canDismiss is Promise<false>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionHandlerDone = await page.spyOnEvent('ionHandlerDone');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.$('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionHandlerDone.next();

      const modal = await page.find('ion-modal');
      expect(modal).not.toBe(null);
    });
    test.skip('should dismiss when canDismiss is Action Sheet and user clicks confirm', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      await page.click('#radio-action-sheet');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.$('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionActionSheetDidPresent.next();
      await page.click('.button-confirm');

      await ionModalDidDismiss.next();
    });*/
  });
});
