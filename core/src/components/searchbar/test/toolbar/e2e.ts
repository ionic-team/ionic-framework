import { newE2EPage } from '@stencil/core/testing';

it('searchbar: toolbar', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/toolbar?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
