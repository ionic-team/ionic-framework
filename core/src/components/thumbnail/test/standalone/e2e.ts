import { newE2EPage } from '@stencil/core/testing';

it('thumbnail: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/thumbnail/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
