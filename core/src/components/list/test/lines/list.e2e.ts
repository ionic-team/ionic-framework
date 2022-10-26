import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('list: lines', () => {
  test('lines="full" should render correctly', async ({ page }) => {
    await page.goto(`/src/components/list/test/lines`);

    const list = page.locator('ion-list[lines="full"]');

    expect(await list.screenshot()).toMatchSnapshot(`list-lines-full-${page.getSnapshotSettings()}.png`);
  });
  test('lines="inset" should render correctly', async ({ page }) => {
    await page.goto(`/src/components/list/test/lines`);

    const list = page.locator('ion-list[lines="inset"]');

    expect(await list.screenshot()).toMatchSnapshot(`list-lines-inset-${page.getSnapshotSettings()}.png`);
  });
  test('lines="none" should render correctly', async ({ page }) => {
    await page.goto(`/src/components/list/test/lines`);

    const list = page.locator('ion-list[lines="none"]');

    expect(await list.screenshot()).toMatchSnapshot(`list-lines-none-${page.getSnapshotSettings()}.png`);
  });
});
