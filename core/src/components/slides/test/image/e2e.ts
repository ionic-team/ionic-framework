import { newE2EPage } from '@stencil/core/testing';

test('slides: image', async () => {
  const page = await newE2EPage({
    url: '/src/components/slides/test/image?ionic:_testing=true'
  });

  await page.waitFor(500);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
