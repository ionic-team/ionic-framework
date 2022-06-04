import { newE2EPage } from '@stencil/core/testing';

test('label: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/label/test/standalone?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
