import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('modal: custom dialog', () => {
  test('should size custom modal correctly', async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This does not test LTR vs. RTL layout.');
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/24080',
    });

    await page.goto('/src/components/modal/test/custom-dialog');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#custom-modal');

    await ionModalDidPresent.next();

    expect(await page.screenshot()).toMatchSnapshot(`modal-custom-dialog-${page.getSnapshotSettings()}.png`);
  });
});
