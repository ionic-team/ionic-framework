import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('img: draggable', () => {
    test(title('should correctly set draggable attribute on inner img element'), async ({ page }) => {
      await page.goto('/src/components/img/test/draggable', config);

      const imgDraggableTrue = page.locator('#img-draggable-true img');
      await expect(imgDraggableTrue).toHaveAttribute('draggable', 'true');

      const imgDraggableFalse = page.locator('#img-draggable-false img');
      await expect(imgDraggableFalse).toHaveAttribute('draggable', 'false');

      const imgDraggableUnset = page.locator('#img-draggable-unset img');
      await expect(imgDraggableUnset).toHaveAttribute('draggable', '');
    });
  });
});
