import { newE2EPage } from '@stencil/core/testing';

test('time-label', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/time-label?ionic:_testing=true',
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
