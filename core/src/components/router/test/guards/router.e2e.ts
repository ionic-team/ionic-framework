import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('router: guards', () => {
  test.beforeEach(({ skip }) => {
    skip.mode('md');
    skip.rtl();
  });

  test('guards should be run on initial load', async ({ page }) => {
    await page.goto(`/src/components/router/test/guards#/guard-initial-page`);

    expect(page.url()).toContain('#/child/1');
  });
});
