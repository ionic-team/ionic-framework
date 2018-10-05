import { newE2EPage } from '@stencil/core/testing';

it('slides: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/slides/test/standalone?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
