import { newE2EPage } from '@stencil/core/testing';

test('start-of-week', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/start-of-week?ionic:_testing=true'
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
