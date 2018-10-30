import { newE2EPage } from '@stencil/core/testing';

test('button: clear', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/clear?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
