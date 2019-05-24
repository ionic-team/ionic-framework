// Opens a sliding item by simulating a drag event
export async function openItemSliding(id: string, page: any, rtl = false) {
  try {
    const slidingItem = await page.$(id);

    // Simulate a drag
    const boundingBox = await slidingItem.boundingBox();
    const centerX = parseFloat(boundingBox.x + boundingBox.width / 2);
    const centerY = parseFloat(boundingBox.y + boundingBox.height / 2);

    let halfX = centerX / 2;
    let endX = 0;
    if (rtl) {
      endX = boundingBox.width;
      halfX = endX / 2;
    }

    // Start in the center of the item
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();

    // Move halfway first
    await page.mouse.move(halfX, centerY);

    // Move all of the way to the end
    await page.mouse.move(endX, centerY);
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
