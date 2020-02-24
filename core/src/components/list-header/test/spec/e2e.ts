import { newE2EPage } from '@stencil/core/testing';

test('list-header: spec', async () => {
  const page = await newE2EPage({
    url: '/src/components/list-header/test/spec?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
