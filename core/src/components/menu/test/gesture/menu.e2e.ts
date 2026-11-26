import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

/**
 * Records the time of the last mouse move and of the event that ends
 * the menu animation, so the test can check that the drag happened
 * while the menu animated. Without that, the test would pass even
 * without the fix.
 */
const trackDrag = (menu: Locator, endEvent: 'ionDidOpen' | 'ionDidClose') =>
  menu.evaluate((el: HTMLIonMenuElement, endEvent: string) => {
    const w = window as any;
    w.lastMoveAt = 0;
    w.animationEndAt = Infinity;
    document.addEventListener('mousemove', () => (w.lastMoveAt = performance.now()));
    el.addEventListener(endEvent, () => (w.animationEndAt = performance.now()), { once: true });
  }, endEvent);

const draggedDuringAnimation = (page: E2EPage) =>
  page.evaluate(() => {
    const w = window as any;
    return w.lastMoveAt > 0 && w.lastMoveAt < w.animationEndAt;
  });

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('menu: gesture'), () => {
    test.beforeEach(async ({ page }) => {
      // The race needs a running menu animation, which _testing turns off.
      await page.goto(`/src/components/menu/test/gesture?ionic:_testing=false`, config);
    });

    test('should not throw when opened programmatically after a drag has started', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const menu = page.locator('#start-menu');
      await trackDrag(menu, 'ionDidOpen');

      // The pointer goes down at the menu edge before the menu animates.
      await page.mouse.move(10, 300);
      await page.mouse.down();

      // Resolve as soon as the animation starts, in the same round trip.
      await menu.evaluate(
        (el: HTMLIonMenuElement) =>
          new Promise<void>((resolve) => {
            el.addEventListener('ionWillOpen', () => resolve(), { once: true });
            el.open();
          })
      );

      // One move passes the gesture threshold while the menu animates.
      await page.mouse.move(40, 300);
      await page.mouse.up();

      await ionDidOpen.next();
      expect(await draggedDuringAnimation(page)).toBe(true);
      await expect(menu).toHaveClass(/show-menu/);
      expect(errors).toEqual([]);
    });

    test('should not throw when closed programmatically after a drag has started', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');
      const menu = page.locator('#start-menu');

      await menu.evaluate((el: HTMLIonMenuElement) => el.open());
      await ionDidOpen.next();
      await trackDrag(menu, 'ionDidClose');

      // The pointer goes down while the menu is open, before it animates.
      await page.mouse.move(150, 300);
      await page.mouse.down();

      // Resolve as soon as the animation starts, in the same round trip.
      await menu.evaluate(
        (el: HTMLIonMenuElement) =>
          new Promise<void>((resolve) => {
            el.addEventListener('ionWillClose', () => resolve(), { once: true });
            el.close();
          })
      );

      // One move passes the gesture threshold while the menu animates.
      await page.mouse.move(120, 300);
      await page.mouse.up();

      await ionDidClose.next();
      expect(await draggedDuringAnimation(page)).toBe(true);
      await expect(menu).not.toHaveClass(/show-menu/);
      expect(errors).toEqual([]);
    });
  });
});
