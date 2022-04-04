import { newE2EPage } from '@stencil/core/testing';

test('hour-cycle', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/hour-cycle?ionic:_testing=true',
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
