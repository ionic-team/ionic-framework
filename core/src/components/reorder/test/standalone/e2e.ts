import { newE2EPage } from '@stencil/core/testing';

it('reorder: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/reorder/test/standalone?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
