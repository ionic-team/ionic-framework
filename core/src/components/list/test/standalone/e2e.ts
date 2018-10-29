import { newE2EPage } from '@stencil/core/testing';

test('list: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/list/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
