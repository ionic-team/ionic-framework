import { expect } from '@playwright/test';
import { dragElementBy, test } from '@utils/test/playwright';

test.describe('card modal', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.mode !== 'ios', 'Card style modal is only available on iOS');

    await page.goto('/src/components/modal/test/card');
  });
  test.describe('card modal: rendering', () => {
    test('should not have visual regressions', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card');

      await ionModalDidPresent.next();

      expect(await page.screenshot()).toMatchSnapshot(`modal-card-present-${page.getSnapshotSettings()}.png`);
    });
    test('should not have visual regressions with custom modal', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card-custom');

      await ionModalDidPresent.next();

      expect(await page.screenshot()).toMatchSnapshot(`modal-card-custom-present-${page.getSnapshotSettings()}.png`);
    });
    test('should not have visual regressions with stacked cards', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card');
      await ionModalDidPresent.next();

      await page.click('.add');
      await ionModalDidPresent.next();

      expect(await page.screenshot()).toMatchSnapshot(`modal-card-stacked-present-${page.getSnapshotSettings()}.png`);
    });
    test('should not have visual regressions with stacked custom cards', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card-custom');
      await ionModalDidPresent.next();

      await page.click('.add');
      await ionModalDidPresent.next();

      expect(await page.screenshot()).toMatchSnapshot(
        `modal-card-custom-stacked-present-${page.getSnapshotSettings()}.png`
      );
    });
  });
  test.describe('card modal: swipe to close', () => {
    test('it should swipe to close when swiped on the header', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#card');
      await ionModalDidPresent.next();

      const header = await page.locator('ion-modal ion-header');
      await dragElementBy(header, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test('it should swipe to close when swiped on the content', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#card');
      await ionModalDidPresent.next();

      const content = await page.locator('ion-modal ion-content');
      await dragElementBy(content, page, 0, 500);

      await ionModalDidDismiss.next();
    });
    test('it should not swipe to close when swiped on the content but the content is scrolled', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card');
      await ionModalDidPresent.next();

      const modal = await page.locator('ion-modal');
      const content = (await page.$('ion-modal ion-content'))!;

      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));

      await dragElementBy(content, page, 0, 500);

      await content.waitForElementState('stable');

      expect(modal).toBeVisible();
    });
    test('content should be scrollable after gesture ends', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#card');
      await ionModalDidPresent.next();

      const content = await page.locator('ion-modal ion-content');
      await dragElementBy(content, page, 0, 20);

      expect(content).toHaveJSProperty('scrollY', true);
    });
  });
});
