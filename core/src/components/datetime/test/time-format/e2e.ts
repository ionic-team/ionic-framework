import { newE2EPage } from '@stencil/core/testing';

test('time-format', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/time-format?ionic:_testing=true'
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
