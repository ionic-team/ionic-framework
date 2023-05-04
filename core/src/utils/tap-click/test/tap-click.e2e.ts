import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

// TODO FW-3010

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe.skip(title('tap click utility'), () => {
    test('it should apply activated class when clicking element', async ({ page }) => {
      await page.setContent(
        `
        <ion-app>
          <button class="ion-activatable ion-activatable-instant">Click Me</button>
        </ion-app>
      `,
        config
      );

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
});
