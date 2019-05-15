import { newE2EPage } from '@stencil/core/testing';

test('button: round', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/round?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
