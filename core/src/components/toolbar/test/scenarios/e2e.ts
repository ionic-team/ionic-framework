import { newE2EPage } from '@stencil/core/testing';

it('toolbar: scenarios', async () => {
  const page = await newE2EPage({
    url: '/src/components/toolbar/test/scenarios'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
