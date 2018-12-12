import { newE2EPage } from '@stencil/core/testing';

test('searchbar: toolbar', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/toolbar'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
