import { newE2EPage } from '@stencil/core/testing';

// made to catch animation issues when transform is applied to host
// example: https://github.com/ionic-team/ionic-framework/issues/19247
test('spinner: transform', async () => {
  const page = await newE2EPage({
    url: '/src/components/spinner/test/transform?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  // wait for a bit less than the spinner's duration (to avoid looping before screenshot is taken)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  expect(compare).toMatchScreenshot();
});
