// Opens a sliding item by simulating a drag event
export async function openItemSliding(id: string, page: any) {
  try {
    const slidingItem = await page.$(id);

    // Simulate a drag
    const boundingBox = await slidingItem.boundingBox();
    const centerX = parseFloat(boundingBox.x + boundingBox.width / 2);
    const centerY = parseFloat(boundingBox.y + boundingBox.height / 2);

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX / 2, centerY);
    await page.mouse.move(0, centerY);
    await page.mouse.up();

    // Add a timeout to make sure the item is open
    await page.waitFor(2000);
  } catch (err) {
    throw err;
  }
}

// Close a sliding item after taking a screenshot
// to allow other sliding items to open
export async function closeItemSliding(page: any) {
  await page.mouse.move(0, 0);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitFor(1000);
}
