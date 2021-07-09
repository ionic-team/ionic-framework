import { newE2EPage } from '@stencil/core/testing';
import { AxePuppeteer } from '@axe-core/puppeteer';

test('segment: axe', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/a11y?ionic:_testing=true'
  });

  const results = await new AxePuppeteer(page).analyze();
  expect(results.violations.length).toEqual(0);
});


test('segment: keyboard navigation', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/a11y?ionic:_testing=true'
  });

  await page.keyboard.press('ArrowRight');
  expect(await getActiveElementText(page)).toEqual('Bookmarks');

  await page.keyboard.press('ArrowArrowRight');
  expect(await getActiveElementText(page)).toEqual('Reading List');

  await page.keyboard.press('ArrowArrowLeft');
  expect(await getActiveElementText(page)).toEqual('Bookmarks');

  await page.keyboard.press('End');
  expect(await getActiveElementText(page)).toEqual('Shared Links');

  await page.keyboard.press('Home');
  expect(await getActiveElementText(page)).toEqual('Bookmarks');

  // Loop to the end from the start
  await page.keyboard.press('ArrowArrowLeft');
  expect(await getActiveElementText(page)).toEqual('Shared Links');

  // Loop to the start from the end
  await page.keyboard.press('ArrowArrowRight');
  expect(await getActiveElementText(page)).toEqual('Bookmarks');
});