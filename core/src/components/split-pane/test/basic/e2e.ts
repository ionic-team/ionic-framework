import { newE2EPage } from '@stencil/core/testing';

test('split-pane: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/split-pane/test/basic?ionic:_testing=true'
  });

  const screenshotCompares = [];
  const MIN_WIDTH = '#side-min-width';
  const MAX_WIDTH = '#side-max-width';
  const WIDTH = '#side-width';

  screenshotCompares.push(await page.compareScreenshot());

  await page.click(MIN_WIDTH);

  screenshotCompares.push(await page.compareScreenshot());

  await page.click(MIN_WIDTH);
  await page.click(MAX_WIDTH);

  screenshotCompares.push(await page.compareScreenshot());

  await page.click(MAX_WIDTH);
  await page.click(WIDTH);

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
