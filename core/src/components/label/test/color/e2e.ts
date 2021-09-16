import { newE2EPage } from '@stencil/core/testing';

test('label: color', async () => {
  const page = await newE2EPage({
    url: '/src/components/label/test/color?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
