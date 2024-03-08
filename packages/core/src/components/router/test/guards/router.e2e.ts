import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('router: guards'), () => {
    test('guards should be run on initial load', async ({ page }) => {
      await page.goto(`/src/components/router/test/guards#/guard-initial-page`, config);

      expect(page.url()).toContain('#/child/1');
    });
  });
});
