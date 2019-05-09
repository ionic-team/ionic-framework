import { newE2EPage } from '@stencil/core/testing';

test('list: headers', async () => {
  const page = await newE2EPage({
    url: '/src/components/list/test/headers?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
