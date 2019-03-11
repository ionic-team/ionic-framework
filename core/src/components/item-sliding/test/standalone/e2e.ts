import { newE2EPage } from '@stencil/core/testing';

test('item-sliding: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-sliding/test/standalone?ionic:_testing=true'
  });

  const compares = [];

  compares.push(await page.compareScreenshot());

  // Grab item with start icons in option
  let item = await page.find('#start');
  await openItem(item, page);

  compares.push(await page.compareScreenshot());

  // Grab item with top icons in option
  item = await page.find('#top');
  await openItem(item, page);

  compares.push(await page.compareScreenshot());

  // Grab item with anchor option
  item = await page.find('#anchor');
  await openItem(item, page);

  compares.push(await page.compareScreenshot());

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

async function openItem(item: any, page: any) {
  try {
    // Simulate a drag
    const boundingBox = await item.boundingBox();
    const centerX = parseFloat(boundingBox.x + boundingBox.width / 2);
    const centerY = parseFloat(boundingBox.y + boundingBox.height / 2);

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(0, centerY);
    await page.mouse.up();
  } catch (err) {
    throw err;
  }
}
