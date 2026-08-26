import { test } from '@playwright/test';

import { expectAsyncUpdateToRender } from '../../utils/async-change-detection-utils';

test.describe('Async Change Detection', () => {
  test('should render state set after an await', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31406',
    });

    await page.goto('/standalone/async-change-detection');

    await expectAsyncUpdateToRender(page);
  });

  test('should render state set after an await inside tabs', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31406',
    });

    await page.goto('/standalone/async-change-detection-tabs');

    await expectAsyncUpdateToRender(page);
  });
});
