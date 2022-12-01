import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('list: lines', () => {
    test(title('lines="full" should render correctly'), async ({ page }) => {
      await page.goto(`/src/components/list/test/lines`, config);

      const list = page.locator('ion-list[lines="full"]');

      expect(await list.screenshot()).toMatchSnapshot(`list-lines-full-${page.getSnapshotSettings()}.png`);
    });
    test(title('lines="inset" should render correctly'), async ({ page }) => {
      await page.goto(`/src/components/list/test/lines`, config);

      const list = page.locator('ion-list[lines="inset"]');

      expect(await list.screenshot()).toMatchSnapshot(`list-lines-inset-${page.getSnapshotSettings()}.png`);
    });
    test(title('lines="none" should render correctly'), async ({ page }) => {
      await page.goto(`/src/components/list/test/lines`, config);

      const list = page.locator('ion-list[lines="none"]');

      expect(await list.screenshot()).toMatchSnapshot(`list-lines-none-${page.getSnapshotSettings()}.png`);
    });
  });
});
