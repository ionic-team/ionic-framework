import { newE2EPage } from '@stencil/core/testing';

test('toolbar: components', async () => {
  const page = await newE2EPage({
    url: '/src/components/toolbar/test/components?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
