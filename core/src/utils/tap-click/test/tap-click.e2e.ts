import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

// TODO FW-3010
test.describe.skip('tap click utility', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios');
  });
  test('it should apply activated class when clicking element', async ({ page }) => {
    await page.setContent(`
      <ion-app>
        <button class="ion-activatable ion-activatable-instant">Click Me</button>
      </ion-app>
    `);

    const button = page.locator('button');
    const box = await button.boundingBox()!;

    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForChanges();
    }

    await expect(button).toHaveClass(/ion-activated/);
  });
});
