import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

const openSide = async (item: Locator, side: 'start' | 'end', direction: 'ltr' | 'rtl') => {
  await item.evaluate((el: HTMLIonItemSlidingElement, side) => el.open(side), side);
  const ratio = (side === 'end' ? 1 : -1) * (direction === 'rtl' ? -1 : 1);
  await expect.poll(() => item.evaluate((el: HTMLIonItemSlidingElement) => el.getSlidingRatio())).toBe(ratio);
  const itemElement = await item.locator('ion-item').elementHandle();
  await itemElement!.waitForElementState('stable');
};

const slidingItem = `
  <ion-item-sliding>
    <ion-item><ion-label>Sliding item</ion-label></ion-item>
    <ion-item-options side="start">
      <ion-item-option onclick="document.querySelector('output').textContent = 'start'">Start</ion-item-option>
    </ion-item-options>
    <ion-item-options side="end">
      <ion-item-option onclick="document.querySelector('output').textContent = 'end'">End</ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
`;

// Programmatic open() in RTL is tracked separately in FW-3711.
configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('item-sliding: switching open sides'), () => {
    test.describe('single item', () => {
      test.beforeEach(async ({ page }) => {
        await page.setContent(
          `
          <ion-list>
            ${slidingItem}
          </ion-list>
          <output></output>
        `,
          config
        );
      });

      for (const side of ['start', 'end'] as const) {
        const previousSide = side === 'start' ? 'end' : 'start';

        test(`should allow option clicks after opening ${side} from ${previousSide}`, async ({ page }) => {
          const item = page.locator('ion-item-sliding');
          await openSide(item, previousSide, config.direction);
          await openSide(item, side, config.direction);

          await page.locator(`ion-item-options[side="${side}"] ion-item-option`).click();
          await expect(page.locator('output')).toHaveText(side);
        });

        test(`should allow swiping closed after opening ${side} from ${previousSide}`, async ({ page }) => {
          const item = page.locator('ion-item-sliding');
          await openSide(item, previousSide, config.direction);
          await openSide(item, side, config.direction);

          await dragElementBy(
            item,
            page,
            (await item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount())) * 0.75
          );
          await expect.poll(() => item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount())).toBe(0);
        });

        test(`should preserve disabled gestures when switching to ${side}`, async ({ page }) => {
          const item = page.locator('ion-item-sliding');
          await openSide(item, previousSide, config.direction);
          await item.evaluate((el: HTMLIonItemSlidingElement) => (el.disabled = true));
          await page.waitForChanges();
          await openSide(item, side, config.direction);

          await dragElementBy(
            item,
            page,
            (await item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount())) * 0.75
          );
          expect(
            await item.evaluate(async (el: HTMLIonItemSlidingElement) => Math.abs(await el.getSlidingRatio()))
          ).toBe(1);

          await item.evaluate((el: HTMLIonItemSlidingElement) => (el.disabled = false));
          await page.waitForChanges();
          await dragElementBy(
            item,
            page,
            (await item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount())) * 0.75
          );
          await expect.poll(() => item.evaluate((el: HTMLIonItemSlidingElement) => el.getOpenAmount())).toBe(0);
        });
      }

      test('should keep options clickable after repeated side changes', async ({ page }) => {
        const item = page.locator('ion-item-sliding');
        for (const side of ['start', 'end', 'start', 'end'] as const) {
          await openSide(item, side, config.direction);
        }

        await page.locator('ion-item-options[side="end"] ion-item-option').click();
        await expect(page.locator('output')).toHaveText('end');
      });

      test('should still finish closing before allowing a new swipe', async ({ page }) => {
        const item = page.locator('ion-item-sliding');
        await openSide(item, 'end', config.direction);
        await openSide(item, 'start', config.direction);
        await item.evaluate((el: HTMLIonItemSlidingElement) => el.close());
        await expect(item).not.toHaveClass(/item-sliding-active-slide/);

        await dragElementBy(item, page, config.direction === 'rtl' ? 150 : -150);
        await expect
          .poll(() => item.evaluate((el: HTMLIonItemSlidingElement) => el.getSlidingRatio()))
          .toBe(config.direction === 'rtl' ? -1 : 1);
      });
    });

    test('should still close the first item when another item opens', async ({ page }) => {
      await page.setContent(`<ion-list>${slidingItem}${slidingItem}</ion-list><output></output>`, config);
      const first = page.locator('ion-item-sliding').first();
      const second = page.locator('ion-item-sliding').last();
      await openSide(first, 'end', config.direction);
      await openSide(second, 'start', config.direction);

      await expect(first).not.toHaveClass(/item-sliding-active-slide/);
      await second.locator('ion-item-options[side="start"] ion-item-option').click();
      await expect(page.locator('output')).toHaveText('start');
    });
  });
});
