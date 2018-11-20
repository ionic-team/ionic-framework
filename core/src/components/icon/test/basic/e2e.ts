import { newE2EPage } from '@stencil/core/testing';

test('icon: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/icon/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
