import { newE2EPage } from '@stencil/core/testing';

test('label: headings', async () => {
  const page = await newE2EPage({
    url: '/src/components/label/test/headings?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
