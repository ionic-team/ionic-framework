import { expect } from '@playwright/test';
import { test, Viewports, configs } from '@utils/test/playwright';

import { CardModalPage } from '../fixtures';

configs({ modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe('card modal', () => {
    let cardModalPage: CardModalPage;
    test.beforeEach(async ({ page }) => {
      cardModalPage = new CardModalPage(page);
      await cardModalPage.navigate('/src/components/modal/test/card', config);
    });
    test.describe('card modal: rendering', () => {
      test(title('should not have visual regressions'), async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card');

        expect(await page.screenshot()).toMatchSnapshot(`modal-card-present-${page.getSnapshotSettings()}.png`);
      });
      test(title('should not have visual regressions with custom modal'), async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card-custom');

        expect(await page.screenshot()).toMatchSnapshot(`modal-card-custom-present-${page.getSnapshotSettings()}.png`);
      });
      test(title('should not have visual regressions with stacked cards'), async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.openModalByTrigger('.add');

        expect(await page.screenshot()).toMatchSnapshot(`modal-card-stacked-present-${page.getSnapshotSettings()}.png`);
      });
      test(title('should not have visual regressions with stacked custom cards'), async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card-custom');
        await cardModalPage.openModalByTrigger('.add');

        expect(await page.screenshot()).toMatchSnapshot(
          `modal-card-custom-stacked-present-${page.getSnapshotSettings()}.png`
        );
      });
    });
    test.describe('card modal: swipe to close', () => {
      test(title('it should swipe to close when swiped on the header'), async () => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.swipeToCloseModal('ion-modal ion-header');
      });
      test(title('it should swipe to close when swiped on the content'), async () => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.swipeToCloseModal('ion-modal ion-content');
      });
      test(
        title('it should not swipe to close when swiped on the content but the content is scrolled'),
        async ({ page }) => {
          const modal = await cardModalPage.openModalByTrigger('#card');

          const content = (await page.$('ion-modal ion-content'))!;
          await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

          await cardModalPage.swipeToCloseModal('ion-modal ion-content', false);

          await content.waitForElementState('stable');
          await expect(modal).toBeVisible();
        }
      );
      test(
        title(
          'it should not swipe to close when swiped on the content but the content is scrolled even when content is replaced'
        ),
        async ({ page }) => {
          const modal = await cardModalPage.openModalByTrigger('#card');

          await page.click('ion-button.replace');

          const content = (await page.$('ion-modal ion-content'))!;
          await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

          await cardModalPage.swipeToCloseModal('ion-modal ion-content', false);

          await content.waitForElementState('stable');
          await expect(modal).toBeVisible();
        }
      );
      test(title('content should be scrollable after gesture ends'), async ({ page }) => {
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
      test(title('should not have visual regressions'), async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card');

        expect(await page.screenshot()).toMatchSnapshot(`modal-card-present-tablet-${page.getSnapshotSettings()}.png`);
      });
      test(title('should not have visual regressions with custom modal'), async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card-custom');

        expect(await page.screenshot()).toMatchSnapshot(
          `modal-card-custom-present-tablet-${page.getSnapshotSettings()}.png`
        );
      });
      test(title('should not have visual regressions with stacked cards'), async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.openModalByTrigger('.add');

        expect(await page.screenshot()).toMatchSnapshot(
          `modal-card-stacked-present-tablet-${page.getSnapshotSettings()}.png`
        );
      });
      test(title('should not have visual regressions with stacked custom cards'), async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card-custom');
        await cardModalPage.openModalByTrigger('.add');

        expect(await page.screenshot()).toMatchSnapshot(
          `modal-card-custom-stacked-present-tablet-${page.getSnapshotSettings()}.png`
        );
      });
    });
    test.describe('card modal: swipe to close - tablet', () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(Viewports.tablet.portrait);
      });
      test(title('it should swipe to close when swiped on the header'), async () => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.swipeToCloseModal('ion-modal ion-header');
      });
      test(title('it should swipe to close when swiped on the content'), async () => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.swipeToCloseModal('ion-modal ion-content');
      });
      test(
        title('it should not swipe to close when swiped on the content but the content is scrolled'),
        async ({ page }) => {
          const modal = await cardModalPage.openModalByTrigger('#card');

          const content = (await page.$('ion-modal ion-content'))!;
          await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

          await cardModalPage.swipeToCloseModal('ion-modal ion-content', false);

          await content.waitForElementState('stable');
          await expect(modal).toBeVisible();
        }
      );
      test(
        title(
          'it should not swipe to close when swiped on the content but the content is scrolled even when content is replaced'
        ),
        async ({ page }) => {
          const modal = await cardModalPage.openModalByTrigger('#card');

          await page.click('ion-button.replace');

          const content = (await page.$('ion-modal ion-content'))!;
          await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

          await cardModalPage.swipeToCloseModal('ion-modal ion-content', false);

          await content.waitForElementState('stable');
          await expect(modal).toBeVisible();
        }
      );
      test(title('content should be scrollable after gesture ends'), async ({ page }) => {
        await cardModalPage.openModalByTrigger('#card');
        await cardModalPage.swipeToCloseModal('ion-modal ion-content', false, 20);

        const content = await page.locator('ion-modal ion-content');
        await expect(content).toHaveJSProperty('scrollY', true);
      });
    });
  });
});
