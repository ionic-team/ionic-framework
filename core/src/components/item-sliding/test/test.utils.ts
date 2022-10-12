import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';

export const testSlidingItem = async (
  page: E2EPage,
  item: Locator,
  screenshotNameSuffix: string,
  openStart = false
) => {
  // passing a param into the eval callback is tricky due to execution context
  // so just do the check outside the callback instead to make things easy
  if (openStart) {
    await item.evaluate(async (el: HTMLIonItemSlidingElement) => {
      await el.open('start');
    });
  } else {
    await item.evaluate(async (el: HTMLIonItemSlidingElement) => {
      await el.open('end');
    });
  }

  // opening animation takes longer than waitForChanges accounts for
  await page.waitForTimeout(500);

  expect(await item.screenshot()).toMatchSnapshot(
    `item-sliding-${screenshotNameSuffix}-${page.getSnapshotSettings()}.png`
  );

  await item.evaluate(async (el: HTMLIonItemSlidingElement) => {
    await el.close();
  });
};

// Opens a sliding item by simulating a drag event
export const openItemSliding = async (id: string, page: any, rtl = false) => {
  try {
    const slidingItem = await page.$(id);

    // Simulate a drag
    const boundingBox = await slidingItem.boundingBox();
    const centerX = parseFloat(boundingBox.x + boundingBox.width / 2);
    const centerY = parseFloat(boundingBox.y + boundingBox.height / 2);

    // In LTR start the drag at the center, move halfway in between the
    // center and 0, then end at 0
    //
    //  0                                boundingBox.width
    //  |---------|---------|---------|---------|
    // endX     halfX    centerX

    let halfX = centerX / 2;
    let endX = 0;

    // In RTL start at the center, move halfway in between the center and
    // the total width, then end at the total width
    //
    //  0                                boundingBox.width
    //  |---------|---------|---------|---------|
    //                   centerX    halfX      endX

    if (rtl) {
      halfX = centerX + centerX / 2;
      endX = boundingBox.width;
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
    await page.waitForTimeout(2000);
  } catch (err) {
    throw err;
  }
};

// Close a sliding item after taking a screenshot
// to allow other sliding items to open
export const closeItemSliding = async (page: any) => {
  await page.mouse.move(0, 0);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(1000);
};
