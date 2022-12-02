import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('modal: custom dialog', () => {
    test(title('should size custom modal correctly'), async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/24080',
      });

      await page.goto('/src/components/modal/test/custom-dialog', config);
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#custom-modal');

      await ionModalDidPresent.next();

      expect(await page.screenshot()).toMatchSnapshot(`modal-custom-dialog-${page.getSnapshotSettings()}.png`);
    });
  });
});
