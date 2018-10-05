import { newE2EPage } from '@stencil/core/testing';

it('infinite-scroll: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/infinite-scroll/test/standalone?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
