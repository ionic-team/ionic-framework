import * as pd from '@stencil/core/dist/testing/puppeteer/puppeteer-declarations';

import { dragElementBy, queryDeep } from '../../../utils/test/utils';

/**
 * Moves a reorder item by simulating a drag event
 */
export const moveReorderItem = async (id: string, page: pd.E2EPage, direction: 'up' | 'down' = 'up', numberOfSpaces = 1, ...parentSelectors: string[]) => {
  try {
    const reorderItem = parentSelectors && parentSelectors.length > 0 ? await (await queryDeep(page, ...parentSelectors)).$(id) : await page.$(id);

    if (!reorderItem) { throw new Error('Reorder Item is undefined'); }

    const boundingBox = await reorderItem.boundingBox();
    if (!boundingBox) { throw new Error('Reorder Item bounding box is undefined'); }

    await dragElementBy(reorderItem, page, 0, (direction === 'up') ? -(boundingBox.height * numberOfSpaces) : (boundingBox.height * numberOfSpaces));

  } catch (err) {
    throw err;
  }
};
