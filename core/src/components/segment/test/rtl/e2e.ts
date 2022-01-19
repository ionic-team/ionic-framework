import { newE2EPage } from '@stencil/core/testing';

test('segment: rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/rtl?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
