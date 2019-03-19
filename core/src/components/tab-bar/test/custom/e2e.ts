import { newE2EPage } from '@stencil/core/testing';

test('tab-bar: custom', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-bar/test/custom?ionic:_testing=true'
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot('tab-bar: custom default'));

  await page.waitFor(150);
  await page.keyboard.press('Tab');

  screenshotCompares.push(await page.compareScreenshot('tab-bar: custom tabbed'));

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
