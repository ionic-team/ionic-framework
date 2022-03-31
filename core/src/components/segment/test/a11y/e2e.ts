import { AxePuppeteer } from '@axe-core/puppeteer';
import { newE2EPage } from '@stencil/core/testing';

const getActiveElementText = async page => {
  const activeElement = await page.evaluateHandle(() => document.activeElement);
  return page.evaluate(el => el && el.innerText, activeElement);
}

test('segment: axe', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/a11y?ionic:_testing=true'
  });

  const results = await new AxePuppeteer(page)
    // TODO(FW-403): Re-enable rule once segment button is updated to avoid nested-interactive
    .disableRules('nested-interactive')
    .analyze();
  expect(results.violations.length).toEqual(0);
});

test('segment: keyboard navigation', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/a11y?ionic:_testing=true'
  });

  await page.keyboard.press('Tab');
  expect(await getActiveElementText(page)).toEqual('BOOKMARKS');

  await page.keyboard.press('ArrowRight');
  expect(await getActiveElementText(page)).toEqual('READING LIST');

  await page.keyboard.press('ArrowLeft');
  expect(await getActiveElementText(page)).toEqual('BOOKMARKS');

  await page.keyboard.press('End');
  expect(await getActiveElementText(page)).toEqual('SHARED LINKS');

  await page.keyboard.press('Home');
  expect(await getActiveElementText(page)).toEqual('BOOKMARKS');

  // Loop to the end from the start
  await page.keyboard.press('ArrowLeft');
  expect(await getActiveElementText(page)).toEqual('SHARED LINKS');

  // Loop to the start from the end
  await page.keyboard.press('ArrowRight');
  expect(await getActiveElementText(page)).toEqual('BOOKMARKS');
});

test('segment: RTL keyboard navigation', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/a11y?ionic:_testing=true&rtl=true'
  });

  await page.keyboard.press('Tab');
  expect(await getActiveElementText(page)).toEqual('BOOKMARKS');

  await page.keyboard.press('ArrowRight');
  expect(await getActiveElementText(page)).toEqual('SHARED LINKS');

  await page.keyboard.press('ArrowLeft');
  expect(await getActiveElementText(page)).toEqual('BOOKMARKS');
});
