import { test } from '@playwright/test';

import { expectAsyncUpdateToRender } from '../../utils/async-change-detection-utils';

test.describe(
  'Async Change Detection',
  { annotation: { type: 'issue', description: 'https://github.com/ionic-team/ionic-framework/issues/31406' } },
  () => {
    test('should let change detection reach a routed page', async ({ page }) => {
      await page.goto('/standalone/async-change-detection');

      await expectAsyncUpdateToRender(page);
    });

    test('should let change detection reach a routed page inside tabs', async ({ page }) => {
      await page.goto('/standalone/async-change-detection-tabs');

      await expectAsyncUpdateToRender(page);
    });
  }
);
