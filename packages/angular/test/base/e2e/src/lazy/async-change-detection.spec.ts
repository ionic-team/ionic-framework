import { test } from '@playwright/test';

import { expectAsyncUpdateToRender } from '../../utils/async-change-detection-utils';

test.describe('Async Change Detection', () => {
  test('should let change detection reach a routed page', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31406',
    });

    await page.goto('/lazy/async-change-detection');

    await expectAsyncUpdateToRender(page);
  });

  test('should let change detection reach a routed page inside tabs', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31406',
    });

    await page.goto('/lazy/async-change-detection-tabs');

    await expectAsyncUpdateToRender(page);
  });
});
