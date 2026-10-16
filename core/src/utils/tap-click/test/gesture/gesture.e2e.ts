import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

// https://github.com/ionic-team/ionic-framework/issues/22491
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('tap click captured gesture'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/utils/tap-click/test/gesture?ionic:_testing=false', config);
      await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
    });

    test('keeps the ripple while a captured press is held', async ({ page }) => {
      const button = page.locator('#press');
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await page.mouse.down();
      await expect(button.locator('ion-ripple-effect .ripple-effect')).toHaveCount(1);
      await page.waitForTimeout(600);
      await expect(button.locator('ion-ripple-effect .ripple-effect')).toHaveCount(1);
      await page.mouse.up();
      await expect(button.locator('ion-ripple-effect .ripple-effect')).toHaveCount(0);
    });

    test('removes the ripple during a captured mouse drag', async ({ page }) => {
      const button = page.locator('#press');
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      const x = box!.x + box!.width / 2;
      const y = box!.y + box!.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await expect(button.locator('ion-ripple-effect .ripple-effect')).toHaveCount(1);
      await page.mouse.move(x + 20, y);
      await expect(button.locator('ion-ripple-effect .ripple-effect')).toHaveCount(0);
      await page.mouse.up();
    });
  });
});
