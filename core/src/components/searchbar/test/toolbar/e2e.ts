import { newE2EPage } from '@stencil/core/testing';

it('searchbar: toolbar', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/toolbar?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
