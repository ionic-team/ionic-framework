import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('footer: fade', () => {
    test(title('should not have visual regressions with fade footer'), async ({ page, skip }) => {
      skip.browser('firefox', 'Firefox has some issues rendering translucent effects on Linux.');

      await page.goto('/src/components/footer/test/fade', config);

      const footer = page.locator('ion-footer');
      expect(await footer.screenshot()).toMatchSnapshot(`footer-fade-blurred-diff-${page.getSnapshotSettings()}.png`);

      const content = page.locator('ion-content');
      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.waitForChanges();

      expect(await footer.screenshot()).toMatchSnapshot(
        `footer-fade-not-blurred-diff-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
