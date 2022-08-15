import { expect } from '@playwright/test';
import { test, dragElementBy } from '@utils/test/playwright';

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
  });

  test.describe('card modal - iOS swiping', () => {
    test.beforeEach(async ({ page, skip }) => {
      skip.mode('md');

      await page.click('#radio-card');
    });

    test('should dismiss on swipe when canDismiss is true', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('ion-modal #modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test('should not dismiss on swipe when canDismiss is false', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      const modal = await page.locator('ion-modal');
      expect(modal).not.toBe(null);
    });
    test('should dismiss on swipe when canDismiss is Promise<true>', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test('should not dismiss on swipe when canDismiss is Promise<false>', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionHandlerDone = await page.spyOnEvent('ionHandlerDone');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionHandlerDone.next();

      const modal = await page.locator('ion-modal');
      expect(modal).not.toBe(null);
    });
    test('should dismiss when canDismiss is Action Sheet and user clicks confirm', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      await page.click('#radio-action-sheet');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionActionSheetDidPresent.next();
      await page.click('.button-confirm');

      await ionModalDidDismiss.next();
    });
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
    test('should dismiss on swipe when canDismiss is true', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test('should not dismiss on swipe when canDismiss is false', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      const modal = await page.locator('ion-modal');
      expect(modal).not.toBe(null);
    });
    test('should dismiss on swipe when canDismiss is Promise<true>', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test('should not dismiss on swipe when canDismiss is Promise<false>', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionHandlerDone = await page.spyOnEvent('ionHandlerDone');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionHandlerDone.next();

      const modal = await page.locator('ion-modal');
      expect(modal).not.toBe(null);
    });
    test('should not dismiss on swipe when not attempting to close', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, -500);

      const modal = await page.locator('ion-modal');
      expect(modal).not.toBe(null);
    });
    test('should hit the dismiss threshold when swiping', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, 100);

      await ionModalDidDismiss.next();
    });
    test('should dismiss when canDismiss is Action Sheet and user clicks confirm', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      await page.click('#radio-action-sheet');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modalHeader = await page.locator('#modal-header');
      await dragElementBy(modalHeader, page, 0, 500);

      await ionActionSheetDidPresent.next();
      await page.click('.button-confirm');

      await ionModalDidDismiss.next();
    });
  });
});
