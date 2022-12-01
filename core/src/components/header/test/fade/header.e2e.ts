import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('header: fade', () => {
    test(title('should not have visual regressions with fade header'), async ({ page, skip }) => {
      skip.browser('firefox', 'Firefox has some issues rendering translucent effects on Linux.');

      await page.goto('/src/components/header/test/fade', config);

      const header = page.locator('ion-header');
      expect(await header.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `header-fade-not-blurred-diff-${page.getSnapshotSettings()}.png`
      );

      const content = page.locator('ion-content');
      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.waitForChanges();

      expect(await header.screenshot({ animations: 'disabled' })).toMatchSnapshot(
        `header-fade-blurred-diff-${page.getSnapshotSettings()}.png`
      );
    });
  });
});
