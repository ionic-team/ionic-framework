import { newE2EPage } from '@stencil/core/testing';

test('item-sliding: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-sliding/test/standalone?ionic:_testing=true'
  });

  const compares = [];

  compares.push(await page.compareScreenshot());

  // Pass item with start icons in option
  await openItem('#start', page);
  compares.push(await page.compareScreenshot(`start icons open`));

  // Pass item with top icons in option
  await openItem('#top', page);
  compares.push(await page.compareScreenshot(`top icons open`));

  // Pass item with anchor option
  await openItem('#anchor', page);
  compares.push(await page.compareScreenshot(`anchor option`));

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

async function openItem(id: string, page: any) {
  try {
    const slidingItem = await page.$(id);

    // Simulate a drag
    const boundingBox = await slidingItem.boundingBox();
    const centerX = parseFloat(boundingBox.x + boundingBox.width / 2);
    const centerY = parseFloat(boundingBox.y + boundingBox.height / 2);

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(0, centerY);
    await page.mouse.up();

    const slidingEl = await page.find(id);
    const open = await slidingEl.callMethod('getOpenAmount');
    console.log('open amount is', open);
  } catch (err) {
    throw err;
  }
}
