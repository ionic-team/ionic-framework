import { test } from '@utils/test/playwright';

test.describe('tap click utility', () => {
  test('it should apply activated class when clicking element', async ({ page }) => {
    await page.setContent(`
      <ion-app>
        <button class="ion-activatable">Click Me</button>
      </ion-app>
    `);

    const button = page.locator('button');
    const box = await button.boundingBox()!;

    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
    }

    await page.waitForSelector('button.ion-activated');
  });
});
