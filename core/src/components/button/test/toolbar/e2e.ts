import { newE2EPage } from '@stencil/core/testing';

test('button: toolbar', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/toolbar?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
