import { newE2EPage } from '@stencil/core/testing';

test('content: customscroll', async () => {
  const page = await newE2EPage({
    url: '/src/components/content/test/customscroll?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
