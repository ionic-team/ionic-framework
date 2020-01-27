import { newE2EPage } from '@stencil/core/testing';

import { closeItemSliding, openItemSliding } from '../test.utils';

test('item-sliding: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-sliding/test/standalone?ionic:_testing=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot());

  // Pass sliding item with start icons in option
  await openItemSliding('#startItem', page);
  compares.push(await page.compareScreenshot(`start icons open`));
  await closeItemSliding(page);

  // Pass sliding item with top icons in option
  await openItemSliding('#topItem', page);
  compares.push(await page.compareScreenshot(`top icons open`));
  await closeItemSliding(page);

  // Pass sliding item with anchor option
  await openItemSliding('#anchorItem', page);
  compares.push(await page.compareScreenshot(`anchor option`));
  await closeItemSliding(page);

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});

test('item-sliding:rtl: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-sliding/test/standalone?ionic:_testing=true&rtl=true'
  });

  const compares = [];
  compares.push(await page.compareScreenshot());

  // Pass sliding item with start icons in option
  await openItemSliding('#startItem', page, true);
  compares.push(await page.compareScreenshot(`start icons open`));
  await closeItemSliding(page);

  // Pass sliding item with top icons in option
  await openItemSliding('#topItem', page, true);
  compares.push(await page.compareScreenshot(`top icons open`));
  await closeItemSliding(page);

  // Pass sliding item with anchor option
  await openItemSliding('#anchorItem', page, true);
  compares.push(await page.compareScreenshot(`anchor option`));
  await closeItemSliding(page);

  for (const compare of compares) {
    expect(compare).toMatchScreenshot();
  }
});
