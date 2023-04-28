import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('img: draggable'), () => {
    test('should correctly set draggable attribute on inner img element', async ({ page }) => {
      await page.goto('/src/components/img/test/draggable', config);

      const imgDraggableTrue = page.locator('#img-draggable-true img');
      await expect(imgDraggableTrue).toHaveAttribute('draggable', 'true');

      const imgDraggableFalse = page.locator('#img-draggable-false img');
      await expect(imgDraggableFalse).toHaveAttribute('draggable', 'false');

      const imgDraggableUnset = page.locator('#img-draggable-unset img');
      expect(await imgDraggableUnset.getAttribute('draggable')).toBeNull();
    });
  });
});
