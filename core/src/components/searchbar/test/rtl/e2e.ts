import { newE2EPage } from '@stencil/core/testing';

test('searchbar: rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/rtl?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
