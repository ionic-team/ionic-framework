import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('datetime: first day of the week', () => {
    test(title('should set the first day of the week correctly'), async ({ page }) => {
      await page.goto('/src/components/datetime/test/first-day-of-week', config);

      const datetime = page.locator('ion-datetime');
      expect(await datetime.screenshot()).toMatchSnapshot(`datetime-day-of-week-${page.getSnapshotSettings()}.png`);
    });
  });
});
