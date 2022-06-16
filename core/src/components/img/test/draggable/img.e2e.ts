import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('img: rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/img/test/draggable');

    const imgDraggableTrue = page.locator('#img-draggable-true img');
    expect(imgDraggableTrue).toHaveJSProperty('draggable', true);

    const imgDraggableFalse = page.locator('#img-draggable-false img');
    expect(imgDraggableFalse).toHaveJSProperty('draggable', false);

    const imgDraggableUnset = page.locator('#img-draggable-unset img');
    expect(imgDraggableUnset).toHaveJSProperty('draggable', true);
  });
});
