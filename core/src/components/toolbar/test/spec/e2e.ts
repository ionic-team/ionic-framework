import { newE2EPage } from '@stencil/core/testing';

test('toolbar: spec', async () => {
  const page = await newE2EPage({
    url: '/src/components/toolbar/test/spec'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
