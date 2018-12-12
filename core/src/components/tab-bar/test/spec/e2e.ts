import { newE2EPage } from '@stencil/core/testing';

test('tab-bar: spec', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-bar/test/spec?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
