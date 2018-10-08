import { newE2EPage } from '@stencil/core/testing';

it('searchbar: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
