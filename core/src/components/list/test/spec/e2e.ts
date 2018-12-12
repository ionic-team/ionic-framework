import { newE2EPage } from '@stencil/core/testing';

test('list: spec', async () => {
  const page = await newE2EPage({
    url: '/src/components/list/test/spec?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
