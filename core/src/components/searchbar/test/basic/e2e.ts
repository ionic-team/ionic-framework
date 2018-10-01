import { newE2EPage } from '@stencil/core/testing';

it('searchbar: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/basic?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
