// Moves a reorder item by simulating a drag event
export async function moveReorderItem(id: string, page: any, direction: 'up' | 'down' = 'up', numberOfSpaces = 1) {
  try {
    const reorderItem = await page.$(id);

    // Simulate a drag
    const boundingBox = await reorderItem.boundingBox();
    const centerX = parseFloat(boundingBox.x + boundingBox.width / 2);
    const centerY = parseFloat(boundingBox.y + boundingBox.height / 2);

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX, (direction === 'up') ? centerY - (boundingBox.height * numberOfSpaces) : centerY + (boundingBox.height * numberOfSpaces));
    await page.mouse.up();

    // Add a timeout to make sure the item has moved
    await page.waitFor(500);
  } catch (err) {
    throw err;
  }
}
