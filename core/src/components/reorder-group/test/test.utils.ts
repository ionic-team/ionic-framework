// Moves a reorder item by simulating a drag event
import * as pd from '@stencil/core/dist/testing/puppeteer/puppeteer-declarations';

import { queryDeep } from '../../../utils/test/utils';

export async function moveReorderItem(id: string, page: pd.E2EPage, direction: 'up' | 'down' = 'up', numberOfSpaces = 1, ...parentSelectors: string[]) {
  try {
    const reorderItem = parentSelectors && parentSelectors.length > 0 ? await (await queryDeep(page, ...parentSelectors)).$(id) : await page.$(id);

    if (reorderItem) {
      // Simulate a drag
      const boundingBox = await reorderItem.boundingBox();
      if (boundingBox) {
        const centerX = (boundingBox.x + boundingBox.width / 2);
        const centerY = (boundingBox.y + boundingBox.height / 2);

        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX, (direction === 'up') ? centerY - (boundingBox.height * numberOfSpaces) : centerY + (boundingBox.height * numberOfSpaces));
        await page.mouse.up();

        // Add a timeout to make sure the item has moved
        await page.waitFor(500);
      }
    }

  } catch (err) {
    throw err;
  }
}
