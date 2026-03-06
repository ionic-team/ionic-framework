import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

import { CardModalPage } from '../fixtures';

/**
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('card modal: rendering'), () => {
    let cardModalPage: CardModalPage;
    test.beforeEach(async ({ page }) => {
      cardModalPage = new CardModalPage(page);
      await cardModalPage.navigate('/src/components/modal/test/card', config);
    });
    test('should not have visual regressions', async ({ page }) => {
      await cardModalPage.openModalByTrigger('#card');

      await expect(page).toHaveScreenshot(screenshot(`modal-card-present`));
    });
  });

  test.describe(title('card modal: scenario rendering'), () => {
    let cardModalPage: CardModalPage;
    test.beforeEach(async ({ page }) => {
      cardModalPage = new CardModalPage(page);
      await cardModalPage.navigate('/src/components/modal/test/card', config);
    });
    test('should not have visual regressions with custom modal', async ({ page }) => {
      await cardModalPage.openModalByTrigger('#card-custom');

      await expect(page).toHaveScreenshot(screenshot(`modal-card-custom-present`));
    });
    test('should not have visual regressions with stacked cards', async ({ page }) => {
      await cardModalPage.openModalByTrigger('#card');
      await cardModalPage.openModalByTrigger('.add');

      await expect(page).toHaveScreenshot(screenshot(`modal-card-stacked-present`));
    });
    test('should not have visual regressions with stacked custom cards', async ({ page }) => {
      await cardModalPage.openModalByTrigger('#card-custom');
      await cardModalPage.openModalByTrigger('.add');

      await expect(page).toHaveScreenshot(screenshot(`modal-card-custom-stacked-present`));
    });
  });

  test.describe(title('card modal: functionality'), () => {
    let cardModalPage: CardModalPage;
    test.beforeEach(async ({ page }) => {
      cardModalPage = new CardModalPage(page);
      await cardModalPage.navigate('/src/components/modal/test/card', config);
    });
    test.describe(title('card modal: swipe to close'), () => {
      test('it should swipe to close when swiped on the header', async () => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.swipeToCloseModal('ion-modal ion-header');
      });
      test('it should swipe to close when swiped on the content', async () => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.swipeToCloseModal('ion-modal ion-content');
      });
      test('it should not swipe to close when swiped on the content but the content is scrolled', async ({ page }) => {
        const modal = await cardModalPage.openModalByTrigger('#card');

        const content = (await page.$('ion-modal ion-content'))!;
        await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

        await cardModalPage.swipeToCloseModal('ion-modal ion-content', false);

        await content.waitForElementState('stable');
        await expect(modal).toBeVisible();
      });
      test('it should not swipe to close when swiped on the content but the content is scrolled even when content is replaced', async ({
        page,
      }) => {
        const modal = await cardModalPage.openModalByTrigger('#card');

        await page.click('ion-button.replace');

        const content = (await page.$('ion-modal ion-content'))!;
        await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

        await cardModalPage.swipeToCloseModal('ion-modal ion-content', false);

        await content.waitForElementState('stable');
        await expect(modal).toBeVisible();
      });
      test('content should be scrollable after gesture ends', async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.swipeToCloseModal('ion-modal ion-content', false, 20);

        const content = page.locator('ion-modal ion-content');
        await expect(content).toHaveJSProperty('scrollY', true);
      });
    });
  });

  test.describe(title('card modal: drag events'), () => {
    test('should emit ionDragStart, ionDragMove, and ionDragEnd events', async ({ page }) => {
      await page.goto('/src/components/modal/test/card', config);

      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#drag-events');
      await ionModalDidPresent.next();

      const ionDragStart = await page.spyOnEvent('ionDragStart');
      const ionDragMove = await page.spyOnEvent('ionDragMove');
      const ionDragEnd = await page.spyOnEvent('ionDragEnd');

      const header = page.locator('.modal-card ion-header');

      // Start the drag to verify it emits the events before the gesture ends
      await dragElementBy(header, page, 0, 50, undefined, undefined, false);

      await ionDragStart.next();
      const dragMoveEvent = await ionDragMove.next();

      expect(ionDragStart.length).toBe(1);

      expect(ionDragMove.length).toBeGreaterThan(0);
      expect(Object.keys(dragMoveEvent.detail).length).toBe(4);

      expect(ionDragEnd.length).toBe(0);

      /**
       * Drage the modal further to verify it does:
       * - not emit the event again for `ionDragStart`
       * - emit more `ionDragMove` events
       * - emit the `ionDragEnd` event when the gesture ends
       */
      await dragElementBy(header, page, 0, 100);

      const dragEndEvent = await ionDragEnd.next();

      expect(ionDragStart.length).toBe(1);
      expect(ionDragMove.length).toBeGreaterThan(0);

      expect(ionDragEnd.length).toBe(1);
      expect(Object.keys(dragEndEvent.detail).length).toBe(4);
    });
  });
});
