import { expect } from '@playwright/test';
import { test } from '@playwright/test';
import { dragElementBy } from '../../utils/drag-element';

test.describe('reorder-group: angular standalone', () => {
  test('should reorder the items', async ({ page }) => {
    await page.goto('/standalone/reorder-group');

    // Get initial order
    const initialItems = await page.locator('ion-item').allTextContents();
    expect(initialItems).toEqual(['Item 1', 'Item 2', 'Item 3']);

    const reorderGroup = page.locator('ion-reorder-group');

    // Drag the first item down to move it to the end (below Item 3)
    await dragElementBy(reorderGroup.locator('ion-reorder').first(), page, 0, 300);

    // Wait for the reorder to complete
    await page.waitForTimeout(500);

    // Verify the new order - Item 1 should now be at the end
    const finalItems = await page.locator('ion-item').allTextContents();
    expect(finalItems).toEqual(['Item 2', 'Item 3', 'Item 1']);
  });
});
