import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('footer: fade', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  test('should not have visual regressions with fade footer', async ({ page, skip }) => {
    skip.mode('md', 'Translucent effect is only available in iOS mode.');
    skip.browser('firefox', 'Firefox has some issues rendering translucent effects on Linux.');

    await page.goto('/src/components/footer/test/fade');

    const footer = page.locator('ion-footer');
    expect(await footer.screenshot()).toMatchSnapshot(`footer-fade-blurred-diff-${page.getSnapshotSettings()}.png`);

    const content = page.locator('ion-content');
    await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
    await page.waitForChanges();

    expect(await footer.screenshot()).toMatchSnapshot(`footer-fade-not-blurred-diff-${page.getSnapshotSettings()}.png`);
  });
});
