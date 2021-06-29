import { newE2EPage } from '@stencil/core/testing';

test('refresher: spec', async () => {
  const page = await newE2EPage({
    url: '/src/components/refresher/test/spec?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
