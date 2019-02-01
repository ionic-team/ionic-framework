import { newE2EPage } from '@stencil/core/testing';

test('list: lines', async () => {
  const page = await newE2EPage({
    url: '/src/components/list/test/lines?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
