
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: basic', () => {

  test('should not open multiple alert windows when clicked multiple times', async ({ page }) => {

    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25126'
    });

    await page.goto(`/src/components/select/test/basic`);

    const genderSelect = page.locator('#gender');

    await Promise.all([
      genderSelect.click(),
      genderSelect.click(),
      genderSelect.click()
    ]);

    const alerts = await page.$$('ion-alert');

    expect(alerts.length).toBe(1);
  });

});
