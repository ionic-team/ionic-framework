import { newE2EPage } from '@stencil/core/testing';

test('item-sliding: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-sliding/test/standalone?ionic:_testing=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot());

  // Pass sliding item with start icons in option
  await openItem('#startItem', page);
  compares.push(await page.compareScreenshot(`start icons open`));
  await closeItem(page);

  // Pass sliding item with top icons in option
  await openItem('#topItem', page);
  compares.push(await page.compareScreenshot(`top icons open`));
  await closeItem(page);

  // Pass sliding item with anchor option
  await openItem('#anchorItem', page);
  compares.push(await page.compareScreenshot(`anchor option`));
  await closeItem(page);

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

// Opens a sliding item by simulating a drag event
async function openItem(id: string, page: any) {
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
  } catch (err) {
    throw err;
  }
}

// Close a sliding item after taking a screenshot
// to allow other sliding items to open
async function closeItem(page: any) {
  await page.mouse.move(0, 0);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitFor(1000);
}
