import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('icon: basic', () => {
  test('should render icon when passed', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.setContent(`
      <ion-icon name="star"></ion-icon>
    `);

    const icon = page.locator('ion-icon');
    expect(await icon.screenshot()).toMatchSnapshot(`icon-${page.getSnapshotSettings()}.png`);
  });
});
