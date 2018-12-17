import { newE2EPage } from '@stencil/core/testing';

test('checkbox: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/checkbox/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
