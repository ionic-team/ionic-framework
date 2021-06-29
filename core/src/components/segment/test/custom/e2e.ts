import { newE2EPage } from '@stencil/core/testing';

test('segment: custom', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/custom?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
