import { configs, test } from '@utils/test/playwright';

import { PopoverFixture } from '../fixture';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: standalone'), async () => {
    test('should render correctly', async ({ page }) => {
      const popoverFixture = new PopoverFixture(page);
      await popoverFixture.goto(`src/components/popover/test/standalone`, config);
      await popoverFixture.open('#basic-popover');
      await popoverFixture.screenshot('standalone-basic-popover', screenshot);
    });
  });
});
