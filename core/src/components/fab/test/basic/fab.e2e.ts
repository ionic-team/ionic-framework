import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('fab: basic (visual checks)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/fab/test/basic`, config);
    });

    test(title('should not have visual regressions'), async ({ page }) => {
      await page.setIonViewport();

      expect(await page.screenshot()).toMatchSnapshot(`fab-basic-${page.getSnapshotSettings()}.png`);
    });

    test(title('should not have visual regressions when open'), async ({ page }) => {
      // this fab has multiple buttons on each side, so it covers all the bases
      const fab = page.locator('#fab5');

      await fab.click();
      await page.waitForChanges();

      /**
       * fab.screenshot doesn't work since ion-fab's bounding box only covers the
       * central button. This viewport size crops extra white space while also
       * containing all the buttons in the open fab.
       */
      await page.setViewportSize({
        width: 320,
        height: 415,
      });

      expect(await page.screenshot()).toMatchSnapshot(`fab-open-${page.getSnapshotSettings()}.png`);
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('fab: basic (functionality checks)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/fab/test/basic`, config);
    });

    test(title('should toggle active state when clicked'), async ({ page }) => {
      const fab = page.locator('#fab1');
      const fabList = fab.locator('ion-fab-list');

      expect(fabList).not.toHaveClass(/fab-list-active/);

      // open fab
      await fab.click();
      await page.waitForChanges();
      expect(fabList).toHaveClass(/fab-list-active/);

      // close fab
      await fab.click();
      await page.waitForChanges();
      expect(fabList).not.toHaveClass(/fab-list-active/);
    });

    test(title('should not open when disabled'), async ({ page }) => {
      const fab = page.locator('#fab2');
      const fabList = fab.locator('ion-fab-list');

      expect(fabList).not.toHaveClass(/fab-list-active/);

      // attempt to open fab
      await fab.click();
      await page.waitForChanges();
      expect(fabList).not.toHaveClass(/fab-list-active/);
    });
  });
});
