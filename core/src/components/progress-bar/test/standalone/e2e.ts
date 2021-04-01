import { newE2EPage } from '@stencil/core/testing';

test('progress-bar: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/progress-bar/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
