import { expect } from '@playwright/test';
import { test, Viewports } from '@utils/test/playwright';

import { CardModalPage } from '../fixtures';

test.describe('card modal', () => {
  test.beforeEach(async ({ skip }) => {
    skip.mode('md');
  });
  test.describe('card modal: rendering', () => {
    let cardModalPage: CardModalPage;
    test.beforeEach(async ({ page }) => {
      cardModalPage = new CardModalPage(page);
      await cardModalPage.navigate('/src/components/modal/test/card');
    });
    test('should not have visual regressions', async ({ page }) => {
      await cardModalPage.openModalByTrigger('#card');

      await expect(page).toHaveScreenshot(`modal-card-present-${page.getSnapshotSettings()}.png`);
    });
    test('should not have visual regressions with custom modal', async ({ page }) => {
      await cardModalPage.openModalByTrigger('#card-custom');

      await expect(page).toHaveScreenshot(`modal-card-custom-present-${page.getSnapshotSettings()}.png`);
    });
    test('should not have visual regressions with stacked cards', async ({ page }) => {
      await cardModalPage.openModalByTrigger('#card');
      await cardModalPage.openModalByTrigger('.add');

      await expect(page).toHaveScreenshot(`modal-card-stacked-present-${page.getSnapshotSettings()}.png`);
    });
    test('should not have visual regressions with stacked custom cards', async ({ page }) => {
      await cardModalPage.openModalByTrigger('#card-custom');
      await cardModalPage.openModalByTrigger('.add');

      await expect(page).toHaveScreenshot(`modal-card-custom-stacked-present-${page.getSnapshotSettings()}.png`);
    });
  });
  test.describe('card modal: functionality', () => {
    let cardModalPage: CardModalPage;
    test.beforeEach(async ({ page, skip }) => {
      skip.rtl();
      cardModalPage = new CardModalPage(page);
      await cardModalPage.navigate('/src/components/modal/test/card');
    });
    test.describe('card modal: swipe to close', () => {
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

        const content = await page.locator('ion-modal ion-content');
        await expect(content).toHaveJSProperty('scrollY', true);
      });
    });
    test.describe('card modal: rendering - tablet', () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(Viewports.tablet.portrait);
      });
      test('should not have visual regressions', async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card');

        await expect(page).toHaveScreenshot(`modal-card-present-tablet-${page.getSnapshotSettings()}.png`);
      });
      test('should not have visual regressions with custom modal', async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card-custom');

        await expect(page).toHaveScreenshot(`modal-card-custom-present-tablet-${page.getSnapshotSettings()}.png`);
      });
      test('should not have visual regressions with stacked cards', async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.openModalByTrigger('.add');

        await expect(page).toHaveScreenshot(`modal-card-stacked-present-tablet-${page.getSnapshotSettings()}.png`);
      });
      test('should not have visual regressions with stacked custom cards', async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card-custom');
        await cardModalPage.openModalByTrigger('.add');

        await expect(page).toHaveScreenshot(
          `modal-card-custom-stacked-present-tablet-${page.getSnapshotSettings()}.png`
        );
      });
    });
    test.describe('card modal: swipe to close - tablet', () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(Viewports.tablet.portrait);
      });
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

        const content = await page.locator('ion-modal ion-content');
        await expect(content).toHaveJSProperty('scrollY', true);
      });
    });
  });
});
